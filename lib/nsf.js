let { execSync } = require('child_process');
let fs = require('fs');
let path = require('path');

let array = require('./array.js');
let {char, ord, tohex, tohex16, cliclr} = require('./util.js');

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

	file_process: (filename) => {
		let data = fs.readFileSync(filename);
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
		console.log(cliclr('yellow', 'NTSC playback speed: ' + (Math.round(((1000000 / playspeed) + Number.EPSILON) * 100) / 100) + 'Hz'));

		// CONVERTING NSF TO NES ROM
		// create output array
		let nes_rom = new Uint8Array(32 * 1024);
		// copy nsf data
		nes_rom.set(data.slice(0x80), address_load - 0x8000);
		// find empty chunks of rom
		//console.log('zero segments:');
		//console.log(array.value_segments(nes_rom, 0, 256));
		//console.log('255 segments:');
		//console.log(array.value_segments(nes_rom, 255, 256));
		let segments_00 = array.blank_pages(nes_rom, 0x00);
		console.log ('0x00 filled pages: ' + segments_00.length);
		let segments_ff = array.blank_pages(nes_rom, 0xff);
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
		// build rom vector routines
		let command = "dasm bin/vector.asm -Ibin/ -f3 ";
		let init = tohex16(address_init);
		let play = tohex16(address_play);
		command += `-Dnsf_init=\\$${init} -Dnsf_play=\\$${play} `;
		command += "-ovector_chunk";
		console.log(command);
		execSync(command);
		let booter = fs.readFileSync('vector_chunk');
		nes_rom.set(booter, 0x7d00);
		fs.unlinkSync('vector_chunk');
		// attach header
		let nes_header = new Uint8Array(16);
		nes_header[0] = ord('N');
		nes_header[1] = ord('E');
		nes_header[2] = ord('S');
		nes_header[3] = 0x1a;
		nes_header[4] = 2; // (PRG 16k)
		nes_header[5] = 0; // (CHR 8k)
		for (let i = 6; i < 16; i++) nes_header[i] = 0;
		// assemble final rom
		let outfile = 'out/' + path.basename(filename, path.extname(filename)) + '.nes';
		console.log('export to ${outfile}');
		fs.writeFileSync(outfile, Buffer.from(nes_header));
		fs.appendFileSync(outfile, Buffer.from(nes_rom));
		// output file
	/* TO DO
		-- create portable booter binary
		-- set rom vectors
		dasm bin/vector.asm -Ibin/ -f3 -Dnsf_init=\$a456 -Dnsf_play=\$b123 -onsf.nes 
		-- fail warning on oversized nsf
	*/
	}
};


