
module.exports = {
	char: (ord) => String.fromCharCode(ord),
	ord: (char) => char.charCodeAt(0),
	tohex: (x) => x.toString(16).padStart(2, '0'),
	tohex16: (x) => x.toString(16).padStart(4, '0'),
	isset: (x) => (typeof x !== 'undefined'),
	obj_clone: (obj) => JSON.parse(JSON.stringify(obj)),
	cliclr: (clr, str) => {
		if (!module.exports.isset(cli_colors[clr])) {
			console.error('cliclr missing color "'+clr+'"');
			return false;
		}
		return cli_colors['bright'] + cli_colors[clr] + str + cli_colors['reset'];
	}
};

const cli_colors = {
	reset: "\x1b[0m",
	bright: "\x1b[1m",
	dim: "\x1b[2m",
	underscore: "\x1b[4m",
	blink: "\x1b[5m",
	reverse: "\x1b[7m",
	hidden: "\x1b[8m",

	black: "\x1b[30m",
	red: "\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	magenta: "\x1b[35m",
	cyan: "\x1b[36m",
	white: "\x1b[37m",
	gray: "\x1b[90m",
	crimson: "\x1b[38m" // Scarlet
};
