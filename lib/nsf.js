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
		let obj = {};
		obj.data = fs.readFileSync(filename);
		obj.titlet = path.basename(filename, path.extname(filename));
		// nsf vector addresses
		obj.address_load = (obj.data[9] << 8) + obj.data[8];
		obj.address_init = (obj.data[11] << 8) + obj.data[10];
		obj.address_play = (obj.data[13] << 8) + obj.data[12];
		// credits
		obj.title = '';
		obj.artist = '';
		obj.copyright = '';
		for (let i = 0; i < 32; i++) {
			obj.title += char(obj.data[0x0e + i]);
			obj.artist += char(obj.data[0x02e + i]);
			obj.copyright += char(obj.data[0x4e + i]);
		}
		// play speed
		obj.playspeed = obj.data[0x6e] + (obj.data[0x6f] << 8);

		return obj;
	}
};


