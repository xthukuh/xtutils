import {
	_uuid,
	_string,
	_stringable,
	_strNorm,
	_str,
	_regEscape,
	_strEscape,
	_trim,
	_ltrim,
	_rtrim,
	_titleCase,
	_sentenceCase,
	// _snakeCase,
  // _slugCase,
  // _studlyCase,
} from '../lib';

(async()=>{
	console.log('-- default');
	[
		'hello world. This IS A test',
		'heLLo woRld. This IS A test',
		'heLLo-WORld, This IS A test',
		'heLLo WORld.\nthis IS A test',
		'heLLo WORld,\nthis IS A test',
		'heLLo WORld\n-this IS A test',
	].forEach(v => console.log(`'${_strEscape(v)}', '${_strEscape(_sentenceCase(v))}'`));
	console.log('');
	console.log('-- ignore');
	[
		'hello world. This IS A test',
		'heLLo woRld, this IS A test',
	].forEach(v => console.log(`'${_strEscape(v)}', '${_strEscape(_sentenceCase(v, true))}'`));
})();