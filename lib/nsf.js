let array = require('./array.js');
let {char, ord, tohex} = require('./util.js');

let nsf_pages = [];

module.exports = {

	empty_pages: () => {
		out = [];
		let pages = array.common(nsf_pages);
		for (page_id of pages) {
			let page = {
				id: page_id,
				addr: tohex((page_id + 0x80) << 8)
			};
			out.push(page);
		}
		return out;
	},

	file_process: (data) => {
		let hi, lo;
		// load address
		let address_load = (data[9] << 8) + data[8];
		hi = tohex(data[9]);
		lo = tohex(data[8]);
		console.log('addr load $' + hi + lo);
		// init address
		let address_init = (data[11] << 8) + data[10];
		hi = tohex(data[11]);
		lo = tohex(data[10]);
		console.log('addr init $' + hi + lo);
		// play adress
		let address_play = (data[13] << 8) + data[12];
		hi = tohex(data[13]);
		lo = tohex(data[12]);
		console.log('addr play $' + hi + lo);
		// credits
		let title = '';
		let artist = '';
		let copyright = '';
		for (let i = 0; i < 32; i++) {
			title += char(data[0x0e + i]);
			artist += char(data[0x02e + i]);
			copyright += char(data[0x4e + i]);
		}
		console.log('title: ' + title);
		console.log('artist: ' + artist);
		console.log('copyright: ' + copyright);
		// play speed
		let playspeed = data[0x6e] + (data[0x6f] << 8);
		console.log('NTSC playback speed: ' + (Math.round(((1000000 / playspeed) + Number.EPSILON) * 100) / 100) + 'Hz');

		// CONVERTING NSF TO NES ROM
		// build nes rom header
		// header added at the end
		let nes_header = new Uint8Array(16);
		nes_header[0] = ord('N');
		nes_header[1] = ord('E');
		nes_header[2] = ord('S');
		nes_header[3] = 0x1a;
		nes_header[4] = 2; // (PRG 16k)
		nes_header[5] = 1; // (CHR 8k)
		for (let i = 6; i < 16; i++) nes_header[i] = 0;
		// copy nsf data to nes rom
		let nes_rom = new Uint8Array(32 * 1024);
		//console.log(address_load - 0x8000);
		//console.log(0x8000);
		//console.log(data.length);
		nes_rom.set(data.slice(0x80), address_load - 0x8000);
		//console.log(nes_rom);
		// find empty chunks of rom
		//console.log('zero segments:');
		//console.log(array.value_segments(nes_rom, 0, 256));
		//console.log('255 segments:');
		//console.log(array.value_segments(nes_rom, 255, 256));
		let segments_00 = array.blank_pages(nes_rom, 0x00);
		console.log ('0x00 pages free: ' + segments_00.length);
		let segments_ff = array.blank_pages(nes_rom, 0xff);
		console.log ('0xff pages free: ' + segments_ff.length);
		let segments = [...segments_00, ...segments_ff];
		console.log('empty page segments:');
		console.log(segments.sort((a, b) => a - b));
		nsf_pages.push(segments);
		// copy nsf data to load target
		//nes_rom.set(nes_header, 0);
	/* TO DO
		-- create portable booter binary
		-- set rom vectors
		-- force donload rom
		-- fail warning on oversized nsf
	*/
	}
};


