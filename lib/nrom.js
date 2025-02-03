let { execSync } = require('child_process');
let fs = require('fs');
let path = require('path');

let array = require('./array.js');
let {char, ord, tohex, tohex16, cliclr} = require('./util.js');
let {alphabin} = require('./string.js');

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz\'_: ';

module.exports = {

	nrom_from_obj: (obj) => {
		// CONVERTING NSF TO NES ROM
		let nrom = {};
		// create output array
		nrom.prg = new Uint8Array(32 * 1024);
		// copy nsf data
		nrom.prg.set(obj.data.slice(0x80), obj.address_load - 0x8000);
		// build rom vector routines
		fs.writeFileSync('titlet_table', alphabin(alphabet, obj.titlet.toLowerCase(), 0x20, 0x80, 0x00));
		let command = "dasm nrom/vector.asm -Inrom/ -f3 ";
		let init = tohex16(obj.address_init);
		let play = tohex16(obj.address_play);
		command += `-Dnsf_init=\\$${init} -Dnsf_play=\\$${play} `;
		command += "-ovector_chunk";
		//console.log(command);
		execSync(command);
		let booter = fs.readFileSync('vector_chunk');
		nrom.prg.set(booter, 0x7d00);
		fs.unlinkSync('titlet_table');
		fs.unlinkSync('vector_chunk');
		// attach header
		nrom.header = new Uint8Array(16);
		nrom.header[0] = ord('N');
		nrom.header[1] = ord('E');
		nrom.header[2] = ord('S');
		nrom.header[3] = 0x1a;
		nrom.header[4] = 2; // (PRG 16k)
		nrom.header[5] = 1; // (CHR 8k)
		for (let i = 6; i < 16; i++) nrom.header[i] = 0;
		// assemble final rom
		let outfile = 'out/' + obj.titlet + '.nes';
		console.log(`export to ./${outfile}`);
		fs.writeFileSync(outfile, Buffer.from(nrom.header));
		fs.appendFileSync(outfile, Buffer.from(nrom.prg));
		nrom.chr = fs.readFileSync('nrom/graphix.chr');
		fs.appendFileSync(outfile, Buffer.from(nrom.chr));
		// output file
		return nrom;
	/* TO DO
		-- fail warning on oversized nsf
	*/
	}

};
