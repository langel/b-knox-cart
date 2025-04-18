
module.exports = {

	ascending_chains: (arr) => {
		// arr = array to be examined
		// return array of start,end objects
		if (arr.length < 2) {
			console.error('array.ascending_chains() requires array length of 2 minimum');
			return null;
		}
		let out = [];
		let start = 0;
		let end = 0;
		let size = 0;
		for (let i = 1; i < arr.length; i++) {
			if (arr[i-1] !== arr[i]-1) {
				out.push({
					start: arr[start],
					end: arr[end],
				});
				start = i;
			}
			end = i;
		}
		out.push({
			start: arr[start],
			end: arr[end],
		});
		out.sort((a, b) => a.start - b.start);
		return out;
	},

	blank_pages: (arr, val) => {
		// arr = array to be examined
		// val = empty value to seeach for
		// return array of empty pages
		let out = [];
		let page_blank = true;
		let page_id = 0;
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] != val) page_blank = false;
			if (i % 256 == 0 && i != 0) {
				if (page_blank == true) out.push(page_id);
				page_id++;
				page_blank = true;
			}
		}
		// include final page if unfilled
		if (page_blank == true) out.push(page_id);
		return out;
	},

	common: (arrs) => { 
		return arrs[0].filter(val => arrs.every(arr => arr.includes(val)));
	},

	value_segments: (arr, val, min) => {
		// arr = array to be examined
		// val = segment value to search for
		// min = minimum integer size of segment
		let val_count = 0;
		let start_index = -1;
		let segments = [];
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] === val) {
				if (val_count === 0) {
					start_index = i;
				}
				val_count++;
			}
			else {
				if (val_count >= min) {
					segments.push({ 
						start: start_index, 
						end: i - 1,
						length: i - 1 - start_index,
					});
				}
				val_count = 0;
			}
		}
		if (val_count >= min) {
			segments.push({ 
				start: start_index, 
				end: arr.length - 1,
				length: arr.length - 1 - start_index,
			});
		}
		return segments;
	}
};
