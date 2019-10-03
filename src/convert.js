// Transcrypt'ed from Python, 2019-09-30 15:39:20

var romaji_dict = {'.': 'ten', '0': 'zero', '1': 'ichi', '2': 'ni', '3': 'san', '4': 'yon', '5': 'go', '6': 'roku', '7': 'nana', '8': 'hachi', '9': 'kyuu', '10': 'juu', '100': 'hyaku', '1000': 'sen', '10000': 'man', '100000000': 'oku', '300': 'sanbyaku', '600': 'roppyaku', '800': 'happyaku', '3000': 'sanzen', '8000': 'hassen'};
var kanji_dict = {'.': '点', '0': '零', '1': '一', '2': '二', '3': '三', '4': '四', '5': '五', '6': '六', '7': '七', '8': '八', '9': '九', '10': '十', '100': '百', '1000': '千', '10000': '万', '100000000': '億', '300': '三百', '600': '六百', '800': '八百', '3000': '三千', '8000': '八千'};
var hiragana_dict = {'.': 'てん', '0': 'ゼロ', '1': 'いち', '2': 'に', '3': 'さん', '4': 'よん', '5': 'ご', '6': 'ろく', '7': 'なな', '8': 'はち', '9': 'きゅう', '10': 'じゅう', '100': 'ひゃく', '1000': 'せん', '10000': 'まん', '100000000': 'おく', '300': 'さんびゃく', '600': 'ろっぴゃく', '800': 'はっぴゃく', '3000': 'さんぜん', '8000': 'はっせん'};
var key_dict = {'K': kanji_dict, 'H': hiragana_dict, 'R': romaji_dict};

var len_one = function (convert_num, requested_dict) {
	return requested_dict[convert_num];
};

var len_two = function (convert_num, requested_dict) {
	if (convert_num[0] === '0') {
		return len_one(convert_num[1], requested_dict);
	}
	if (convert_num === '10') {
		return requested_dict['10'];
	}
	if (convert_num[0] === '1') {
		return (requested_dict['10'] + ' ') + len_one(convert_num[1], requested_dict);
	} else if (convert_num[1] === '0') {
		return (len_one(convert_num[0], requested_dict) + ' ') + requested_dict['10'];
	}
	var num_list = [];
	convert_num.split('').forEach(
        x => num_list.push(requested_dict[x]));
	num_list.splice(1, 0, requested_dict['10']);
	return num_list.join(' ');;
};

var len_three = function (convert_num, requested_dict) {
	var num_list = [];
	if (convert_num[0] === '1') {
		num_list.push(requested_dict['100']);
	}
	else if (convert_num[0] === '3') {
		num_list.push(requested_dict['300']);
	}
	else if (convert_num[0] === '6') {
		num_list.push(requested_dict['600']);
	}
	else if (convert_num[0] === '8') {
		num_list.push(requested_dict['800']);
	}
	else {
		num_list.push(requested_dict[convert_num[0]]);
		num_list.push(requested_dict['100']);
	}
	if (convert_num.slice(1) === '00' && convert_num.length === 3) {
		// pass;
	}
	else if (convert_num[1] === '0') {
		num_list.push(requested_dict[convert_num[2]]);
	}
	else {
		num_list.push(len_two(convert_num.slice(1), requested_dict));
	}
	return num_list.join(' ');
};

var len_four = function (convert_num, requested_dict) {
	var num_list = [];
	if (convert_num === '0000') {
		return '';
	}
	while (convert_num[0] === '0') {
		convert_num = convert_num.slice(1);
	}
	if (convert_num.length === 1) {
		return len_one(convert_num, requested_dict);
	}
	else if (convert_num.length === 2) {
		return len_two(convert_num, requested_dict);
	}
	else if (convert_num.length === 3) {
		return len_three(convert_num, requested_dict);
	}
	else {
		if (convert_num[0] === '1') {
			num_list.push(requested_dict['1000']);
		}
		else if (convert_num[0] === '3') {
			num_list.push(requested_dict['3000']);
		}
		else if (convert_num[0] === '8') {
			num_list.push(requested_dict['8000']);
		}
		else {
			num_list.push(requested_dict[convert_num[0]]);
			num_list.push(requested_dict['1000']);
		}
		if (convert_num.slice(1) === '000' && convert_num.length === 4) {
			// pass;
		}
		else if (convert_num[1] === '0') {
			num_list.push(len_two(convert_num.slice(2), requested_dict));
		}
		else {
			num_list.push(len_three(convert_num.slice(1), requested_dict));
		}
		return num_list.join(' ');
	}
};

var len_x = function (convert_num, requested_dict) {
	var num_list = [];
	if (convert_num.slice(0, -4).length === 1) {
		num_list.push(requested_dict[convert_num.slice(0, -4)]);
		num_list.push(requested_dict['10000']);
	}
	else if (convert_num.slice(0, -4).length === 2) {
		num_list.push(len_two(convert_num.slice(0, 2), requested_dict));
		num_list.push(requested_dict['10000']);
	}
	else if (convert_num.slice(0, -4).length === 3) {
		num_list.push(len_three(convert_num.slice(0, 3), requested_dict));
		num_list.push(requested_dict['10000']);
	}
	else if (convert_num.slice(0, -4).length === 4) {
		num_list.push(len_four(convert_num.slice(0, 4), requested_dict));
		num_list.push(requested_dict['10000']);
	}
	else if (convert_num.slice(0, -4).length === 5) {
		num_list.push(requested_dict[convert_num[0]]);
		num_list.push(requested_dict['100000000']);
		num_list.push(len_four(convert_num.slice(1, 5), requested_dict));
		if (convert_num.slice(1, 5) !== '0000') {
			num_list.push(requested_dict['10000']);
		}
	}
	else {
		return 'Not yet implemented, please choose a lower number.';
	}
	num_list.push(len_four(convert_num.slice(-4), requested_dict));
	return num_list.join(' ');
};

var convert = function (convert_num, requested_dict) {

	if (convert_num.length === 1) {
		return len_one(convert_num, requested_dict);
	}
	else if (convert_num.length === 2) {
		return len_two(convert_num, requested_dict);
	}
	else if (convert_num.length === 3) {
		return len_three(convert_num, requested_dict);
	}
	else if (convert_num.length === 4) {
		return len_four(convert_num, requested_dict);
	}
	else {
		return len_x(convert_num, requested_dict);
	}
};

var split_point = function (num, dict_choice) {
	const join_char = dict_choice === 'R' ? 't' : 'っ';
	num = num.split('.');
	var right_res = '';
	var left_res = '';
	right_res = num[1].split('').forEach(
		x => len_one(x, key_dict[dict_choice])).join(' ')
	left_res = convert(num[0], dict_choice);

	if (num[0][num[0].length - 1] === '0'
		&& num[0][num[0].length - 2] !== '0') {
		// TODO What does that mean ?
		left_res = left_res.slice(0, -1) + join_char;
	}
	return [left_res,
			key_dict[dict_choice]['.'],
			right_res].join(' ')
};

var web_convert = function (convert_num, dict_choice) {

	let result = null;
	convert_num = String(convert_num);
	convert_num = convert_num.replace(',', '');
	// Stripping 0's from the beginning and the end
	//  but the integer part should not be empty
	convert_num = convert_num.replace(/^0+/, '0').replace(/\.\d+0+$/, '');
	convert_num = convert_num.replace(/^0([1-9])/, '$1');

	if (convert_num.indexOf('.') >= 0) {
		result = split_point(convert_num, dict_choice);
	} else {
		result = convert(convert_num, key_dict[dict_choice]);
	}

	if (dict_choice !== 'R') {
		// Removing spaces for Hiragana and Kanji
		result = result.replace(' ', '');
	}
	return result;
};

module.exports = {
	web_convert: web_convert,
	romaji_dict: romaji_dict,
	kanji_dict: kanji_dict,
	hiragana_dict: hiragana_dict
}

//# sourceMappingURL=convert2.map