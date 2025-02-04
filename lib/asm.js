let {tohex} = require('./util.js');


module.exports = {

	pointer_table: (table_name, ptr_array) => {
		let lut_lo = table_name + '_lo:\n\thex ';
		let lut_hi = table_name + '_hi:\n\thex ';
		for (const ptr of ptr_array) {
			lut_lo += tohex(ptr & 0xff) + ' ';
			lut_hi += tohex((ptr >> 8) & 0xff) + ' ';
		}
		return lut_lo + '\n' + lut_hi + '\n';
	}

}
