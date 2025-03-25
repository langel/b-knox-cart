let { execSync } = require('child_process');
let fs = require('fs');
let path = require('path');

let asm = require('./lib/asm.js');
let nes = require('./lib/nes.js');
let nsf = require('./lib/nsf.js');
let array = require('./lib/array.js');
let {alphabin} = require('./lib/string.js');
let {tohex, tohex16, cliclr} = require('./lib/util.js');

let header = nes.nes2_header(34, 32, 1, 0, 2);
// xxx missing J and two ?
let alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ,.?!()\'#@[\\]|_"$%&*/:;<=>?+-() ';

const project_name = process.argv[2];
let track_list
try {
	track_list = fs.readFileSync(project_name + "/track_list.json", "utf8");
	track_list = track_list.replace(/0x([0-9a-fA-F]+)/g, (_, hex) => `${parseInt(hex, 16)}`);
	track_list = JSON.parse(track_list);
} catch (e) {
	if (project_name == undefined) {
		console.log("usage :: node build.js {project_name}");
	}
	else {
		console.log(project_name + ".json not found or borked json");
	}
	process.exit(1);
}

let nsf_objs = [];
let track_inits = [];
let track_updates = [];
let track_lengths = [];
let length_total = 0;
// process NSFs
for (const track of track_list) {
	let input = 'nsf/' + track.title + '.nsf';
	console.log(cliclr('cyan', 'Loading ' + input + ' . . .'));
	let obj = nsf.file_process(input);
	obj.track_data = track;
	track_inits.push(obj.address_init);
	track_updates.push(obj.address_play);
	track_lengths.push(track.length);
	nsf_objs.push(obj);
	length_total += track.length;
}

// build asm LUTs
let tables = '';
tables += asm.pointer_table('track_inits', track_inits);
tables += asm.pointer_table('track_updates', track_updates);
tables += asm.pointer_table('track_lengths', track_lengths);
fs.writeFileSync('bnrom/tables.asm', tables);
// start rom file
let outfile = project_name + '.nes';
fs.writeFileSync(outfile, Buffer.from(header));
// build banks
for (const [i, obj] of nsf_objs.entries()) {
	let bank = new Uint8Array(32 * 1024);
	// copy nsf data
	bank.set(obj.data, obj.address_load - 0x8000);
	// build rom vector routines
	fs.writeFileSync('titlet_table', alphabin(alphabet, obj.titlet, 0x20, 0x80, 0x00));
	let command = "dasm bnrom/vector.asm -Ibnrom/ -f3 ";
	command += "-ovector_chunk -T1 -sromsym.txt";
	//console.log(command);
	require('child_process').execSync(command,{stdio: 'inherit'});
	let booter = fs.readFileSync('vector_chunk');
	bank.set(booter, 0x7d00);
	//fs.unlinkSync('titlet_table');
	//fs.unlinkSync('vector_chunk');
	fs.appendFileSync(outfile, Buffer.from(bank));
	// display void data
	console.log(i + ') ' +obj.track_data.title);
	let void_space = 0;
	let void_chunks = [];
	for (const void_data of obj.track_data.voids) {
		void_space += void_data[1] - void_data[0] + 1;
		void_chunks.push((void_data[1] - void_data[0] + 1) >> 8); 
	}
	console.log('void space knownst: ' + (void_space / 1024) + 'kb  (page chunks: ' + void_chunks.join(' + ') + ')');
}
// finish rom file
let chr = fs.readFileSync('bnrom/graphix.chr');
fs.appendFileSync(outfile, Buffer.from(chr));

// display total length of playback
let length_seconds = Math.round(length_total / 60);
let minutes = Math.floor(length_seconds / 60);
let seconds = length_seconds - minutes * 60;
console.log('total length: ' + minutes + ':' + seconds);

/*
	let segments_00 = array.blank_pages(nrom.prg, 0x00);
	let segments_ff = array.blank_pages(nrom.prg, 0xff);
	let segments = [...segments_00, ...segments_ff];
	console.log(cliclr('magenta', 'potentially free rom space:'));
	let chains = array.ascending_chains(segments);
	for (chain of chains) {
		let start = tohex16((chain.start+0x80)<<8);
		let end = tohex16(((chain.end+0x80)<<8)+0xff);
		console.log(cliclr('green', '\t$'+start+'-'+end));
	}
*/
