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
	{ title: 'breakface fliplol', length: 0x1700 },
	{ title: 'wafer blossum', length: 0x23f8 },
	{ title: 'bediddle stump thrusters', length: 0x3060 },
	{ title: 'bipdem deblip', length: 0x0e10 },
	{ title: 'boddinbodden', length: 0x1130 },
	{ title: 'bomnads', length: 0x0f32 },
	{ title: '256 orange hues', length: 0x1aa0 },
	{ title: 'naubrawk', length: 0x0ba0 },
	{ title: 'grizzle login', length: 0x0c90 },
	{ title: 'homewrecker jim', length: 0x0ab0 },
	{ title: 'you don\'t know', length: 0x0bf0 },
	{ title: 'wizzy does it', length: 0x2150 },
	{ title: 'ogoru fire', length: 0x2a20 },
	{ title: 'biggum dimdum', length: 0x1030 },
	{ title: 'boombutt', length: 0x1198 },
	{ title: 'beardboy castle', length: 0x313a },
];

let nsf_objs = [];
let track_inits = [];
let track_updates = [];
let track_lengths = [];
// process NSFs
for (const track of track_list) {
	let input = 'nsf/' + track.title + '.nsf';
	console.log(cliclr('cyan', 'Loading ' + input + ' . . .'));
	let obj = nsf.file_process(input);
	track_inits.push(obj.address_init);
	track_updates.push(obj.address_play);
	track_lengths.push(track.length);
	nsf_objs.push(obj);
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
for (const obj of nsf_objs) {
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
}
// finish rom file
let chr = fs.readFileSync('bnrom/graphix.chr');
fs.appendFileSync(outfile, Buffer.from(chr));

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
