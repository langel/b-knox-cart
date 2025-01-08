let fs = require('fs');
let path = require('path');
let nsf = require('./lib/nsf.js');

let {tohex} = require('./lib/util.js');

console.log(tohex(69));

fs.readdirSync('./nsf').forEach(file => {
	if (path.extname(file) == '.nsf') {
 		console.log(file);
		let data = fs.readFileSync('./nsf/' + file);
		nsf.process(data);
	}
});
