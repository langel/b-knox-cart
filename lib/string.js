
module.exports = {

	// converts to hex string
	alphavert: (alphabet, text, length, offset, empty_tile) => {
		text = text.padEnd(length, ' ');
		let encoded = '';
		for (const char of text) {
			if (char == ' ') encoded += tohex(empty_tile);
			else encoded += tohex(alphabet.indexOf(char) + offset);
		}
		return encoded;
	},

	// converts to binary data
	alphabin: (alphabet, text, length, offset, empty_tile) => {
		let bin = new Uint8Array(length);
		for (const [i, char] of Array.from(text).entries()) {
			if (char == ' ') bin[i] = empty_tile;
			else bin[i] = alphabet.indexOf(char) + offset;
		}
		return bin;
	}

};
