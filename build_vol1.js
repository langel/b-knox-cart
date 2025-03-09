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

let track_list = [
	{ title: 'breakface fliplol', length: 0x1700,
		voids: [[0, 0x1fff]] },
	{ title: 'wafer blossum', length: 0x23f8,
		voids: [[0, 0x1aff], [0x5100, 0x7cff]] },
	{ title: 'bediddle stump thrusters', length: 0x3060,
		voids: [[0, 0x05ff], [0x4e00, 0x7cff]] },
	{ title: 'bipdem deblip', length: 0x0e10,
		voids: [[0, 0x29ff], [0x6200, 0x7cff]] },
	{ title: 'boddinbodden', length: 0x1130,
		voids: [[0x1cc0, 0x3fff], [0x7a00, 0x7cff]] },
	{ title: 'bomnads', length: 0x0f32,
		voids: [[0x1b00, 0x3fff], [0x7700, 0x7cff]] },
	{ title: '256 orange hues', length: 0x1aa0,
		voids: [[0, 0x1eff], [0x4400, 0x7cff]] },
	{ title: 'naubrawk', length: 0x0ba0, 
		voids: [[0x1600, 0x3fff]] },
	{ title: 'grizzle login', length: 0x0c90, 
		voids: [[0, 0x2aff], [0x7900, 0x7cff]] },
	{ title: 'homewrecker jim', length: 0x0ab0,
		voids: [[0x1a00, 0x3fff], [0x7500, 0x7cff]] },
	{ title: 'you don\'t know', length: 0x0bf0,
		voids: [[0x1900, 0x3fff], [0x5700, 0x5fff], [0x6000, 0x7cff]] },
	{ title: 'wizzy does it', length: 0x2150,
		voids: [[0, 0x07ff], [0x6800, 0x7cff]] },
	{ title: 'ogoru fire', length: 0x2a20,
		voids: [[0x4c00, 0x7cff]] },
	{ title: 'biggum dimdum', length: 0x1030,
		voids: [[0, 0x2aff], [0x7100, 0x7cff]] },
	{ title: 'boombutt', length: 0x1198,
		voids: [[0x1700, 0x3fff], [0x7500, 0x7cff]] },
	{ title: 'beardboy castle', length: 0x313a,
		voids: [[0x4a00, 0x7cff]] },
];

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
let outfile = 'vol1.nes';
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
