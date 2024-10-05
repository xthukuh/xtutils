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
	_elapsed,
	_duration,
	_parseIso,
	_datetime,
	_date,
} from '../lib';

//tests
(async(): Promise<any> => {
	const val = '0005-03-01';
	// const val = '0005-03-01T00:00:00.000Z';
	const parseIsoTimestamp = _parseIso(val) as number;
	const parseIsoTimestampDate = new Date(parseIsoTimestamp);
	const parseIsoTimestampDate_toISOString = parseIsoTimestampDate.toISOString();
	const parseIsoTimestampDate_datetime =  _datetime(parseIsoTimestampDate);
	const date = _date(val) as Date;
	const date_toISOString = date?.toISOString();
	const date_datetime = _datetime(date, true);
	console.log(_jsonStringify({
		val,
		parseIsoTimestamp,
		parseIsoTimestampDate,
		parseIsoTimestampDate_toISOString,
		parseIsoTimestampDate_datetime,
		_date: [
			date,
			date_toISOString,
			date_datetime,
		],
	}, 2));
})();
