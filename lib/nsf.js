let fs = require('fs');
let path = require('path');

let array = require('./array.js');
let {char, ord, tohex, tohex16, cliclr} = require('./util.js');


module.exports = {

	empty_pages: (page_array) => {
		out = [];
		let pages = array.common(page_array);
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
		let obj = {};
		obj.header = data.slice(0x00, 0x80);
		obj.data = data.slice(0x80);
		obj.titlet = path.basename(filename, path.extname(filename));
		// nsf vector addresses
		obj.address_load = (obj.header[9] << 8) + obj.header[8];
		obj.address_init = (obj.header[11] << 8) + obj.header[10];
		obj.address_play = (obj.header[13] << 8) + obj.header[12];
		// credits
		obj.title = '';
		obj.artist = '';
		obj.copyright = '';
		for (let i = 0; i < 32; i++) {
			obj.title += char(obj.header[0x0e + i]);
			obj.artist += char(obj.header[0x02e + i]);
			obj.copyright += char(obj.header[0x4e + i]);
		}
		// play speed
		obj.playspeed = obj.header[0x6e] + (obj.header[0x6f] << 8);

		return obj;
	}
};


