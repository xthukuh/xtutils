import {
	_cr,
	_strKeyValues,
	_parseKeyValues,
	_mapValues,
	Term,
	_jsonParse,
	_num,
	_posInt,
	_str,

	_unescape,
	_escape,
	_utf8Encode,
	_utf8Decode,
	_strEscape,
	_sort,
	_jsonStringify,
	AlphaNum,
	_selectKeys,
	_base64Encode,
	_rc4,
	_base64Decode,
	_asyncAll,
	_sleep,
	_rand,
	IAnimateOptions,
	_animate,
	Easing,
} from '../lib';

//tests
(async(): Promise<any> => {
	const test_animate = () => {
		const char_len = 12;
		const animation = _animate({
			duration: 500,
			autoplay: false,
			from: 0,
			to: char_len,
			update({index, delta, pos, time}){
				const len: number = Math.round(pos)||0;
				console.log('[+] update:', {index, delta: +delta.toFixed(3), pos: +pos.toFixed(3), time, len, max: char_len});
				// const lines: string[] = [];
				// for (let i = 0; i < char_lines.length; i ++){
				// 	// const char_line: string = len >= char_len ? _pad_text(char_lines[i], len, ' ') : ''.padEnd(len, ' ');
				// 	const char_line: string = ''.padEnd(len, ' ');
				// 	lines.push(start_lines[i] + char_line + end_lines[i]);
				// }
				// const text: string = lines.join('\n');
				// Printer.print(text);
			},
			after(){
				console.log('[+] done.');
				// Printer.print(full);
				// resolve();
			},
			//[easings](https://easings.net/en)
			// easing: Easing.easeOutBounce,
			easing: Easing.easeInOutBack,
			// easing: Easing.easeInOutQuart,
			// easing: Easing.easeInOutExpo,
			// easing: Easing.easeInOutQuint,
		} as IAnimateOptions);
		animation.play();
	};
	test_animate();
})();