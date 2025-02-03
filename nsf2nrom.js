let fs = require('fs');
let path = require('path');
let nsf = require('./lib/nsf.js');

let {tohex, cliclr} = require('./lib/util.js');

console.log(tohex(69));

fs.readdirSync('./nsf').forEach(file => {
	if (path.extname(file) == '.nsf') {
 		console.log(cliclr('cyan', '\n=== ' + file));
		nsf.file_process('./nsf/' + file);
	}
});

console.log('\nEMPTY PAGES inside all processed NSFs:');
console.log(nsf.empty_pages());
