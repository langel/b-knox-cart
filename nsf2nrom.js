let fs = require('fs');
let path = require('path');
let nsf = require('./lib/nsf.js');

let array = require('./lib/array.js');
let {tohex, tohex16, cliclr} = require('./lib/util.js');
let {nrom_from_obj} = require('./lib/nrom.js');

let nsf_pages = [];

fs.readdirSync('./nsf').forEach(file => {
	if (path.extname(file) == '.nsf') {
 		console.log(cliclr('cyan', '\n=== ' + file));
		let obj = nsf.file_process('./nsf/' + file);
		console.log('addr load $' + obj.address_load);
		console.log('addr init $' + obj.address_init);
		console.log('addr play $' + obj.address_play);
		console.log('    title: ' + obj.title);
		console.log('   artist: ' + obj.artist);
		console.log('copyright: ' + obj.copyright);
		console.log(cliclr('yellow', 'NTSC playback speed: ' + (Math.round(((1000000 / obj.playspeed) + Number.EPSILON) * 100) / 100) + 'Hz'));
		let nrom = nrom_from_obj(obj);
		// find empty chunks of rom
		//console.log('zero segments:');
		//console.log(array.value_segments(nes_rom, 0, 256));
		//console.log('255 segments:');
		//console.log(array.value_segments(nes_rom, 255, 256));
		let segments_00 = array.blank_pages(nrom.prg, 0x00);
		console.log ('0x00 filled pages: ' + segments_00.length);
		let segments_ff = array.blank_pages(nrom.prg, 0xff);
		console.log ('0xff filled pages: ' + segments_ff.length);
		let segments = [...segments_00, ...segments_ff];
		//console.log('empty page segments:');
		//console.log(segments.sort((a, b) => a - b));
		console.log(cliclr('magenta', 'potentially free rom space:'));
		let chains = array.ascending_chains(segments);
		for (chain of chains) {
			let start = tohex16((chain.start+0x80)<<8);
			let end = tohex16(((chain.end+0x80)<<8)+0xff);
			console.log(cliclr('green', '\t$'+start+'-'+end));
		}
		nsf_pages.push(segments);
	}
});

console.log('\nEMPTY PAGES inside all processed NSFs:');
console.log(nsf.empty_pages(nsf_pages));
