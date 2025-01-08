
module.exports = {
	char: (ord) => String.fromCharCode(ord),
	ord: (char) => char.charCodeAt(0),
	tohex: (x) => x.toString(16).padStart(2, '0'),
	isset: (x) => (typeof x !== 'undefined'),
	obj_clone: (obj) => JSON.parse(JSON.stringify(obj))
};
