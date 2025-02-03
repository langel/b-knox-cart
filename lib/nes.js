let {ord} = require('./util.js');

module.exports = {

	// prg_count * 16k
	// chr_count * 8k
	// mirror
	// 0 = horizontal mirror
	// 1 = vertical mirror
	header: (mapper_id, prg_count, chr_count, mirror) => {
		header = new Uint8Array(16);
		header[0] = ord('N');
		header[1] = ord('E');
		header[2] = ord('S');
		header[3] = 0x1a;
		header[4] = prg_count; // (PRG 16k)
		header[5] = chr_count; // (CHR 8k)
		header[6] = ((mapper_id & 0xf) << 4) | mirror;
		header[7] = mapper_id & 0xf0;
		for (let i = 8; i < 16; i++) header[i] = 0;
		return header;
	}

}
