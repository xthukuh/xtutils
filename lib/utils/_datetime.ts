import { _str } from './_string';

/**
 * Parse `Date` value ~ does not accept `[undefined, null, 0, '']`
 * 
 * @param value - parse date value
 * @returns
 * - `Date` value instance ~ `date.getTime() > 0`
 * - `undefined` when invalid
 */
export const _date = (value: any): Date|undefined => {
	let date: Date|undefined = undefined;
	if (value instanceof Date) date = value;
	else if (![undefined, null].includes(value)){
		if ('number' === typeof value) date = new Date(value);
		else if (value = _str(value, true)) date = new Date(/^\d{0,13}$/.test(value) ? Number(value) : value);
	}
	return date && date.getTime() > 0 ? date : undefined;
};

/**
 * Validate `Date` instance
 * 
 * @param value
 * @returns `boolean`
 */
export const _isDate = (value: any): boolean => value instanceof Date && !isNaN(value.getTime());

/**
 * Convert `Date` value to `datetime` format (i.e. `2023-05-27 22:11:57` ~ `YYYY-MM-DD HH:mm:ss`)
 * 
 * @param value - parse date value
 * @returns
 * - `string` ~ formatted `YYYY-MM-DD HH:mm:ss`
 * - `''` when date value is invalid
 */
export const _datetime = (value: any): string => {
	const date = _date(value);
	if (!date) return '';
	const arr = [
		date.getFullYear(), //yyyy
		date.getMonth() + 1, //MM
		date.getDate(), //dd
		date.getHours(), //HH
		date.getMinutes(), //mm
		date.getSeconds(), //ss
	].map(v => `${v}`.padStart(2, '0')); //pad ~ `'1' => '01'`
	return arr.splice(0, 3).join('-') + ' ' + arr.join(':'); //timestamp
};




//TODO: (from yup) parse ISO date string
//var isoReg = /^(\d{4}|[+\-]\d{6})(?:-?(\d{2})(?:-?(\d{2}))?)?(?:[ T]?(\d{2}):?(\d{2})(?::?(\d{2})(?:[,\.](\d{1,}))?)?(?:(Z)|([+\-])(\d{2})(?::?(\d{2}))?)?)?$/;
// function parseISO(str, utcMode, xdate) {
// 	var m = str.match(/^(\d{4})(-(\d{2})(-(\d{2})([T ](\d{2}):(\d{2})(:(\d{2})(\.(\d+))?)?(Z|(([-+])(\d{2})(:?(\d{2}))?))?)?)?)?$/);
// 	if (m) {
// 					var d = new Date(UTC(
// 									m[1],
// 									m[3] ? m[3] - 1 : 0,
// 									m[5] || 1,
// 									m[7] || 0,
// 									m[8] || 0,
// 									m[10] || 0,
// 									m[12] ? Number('0.' + m[12]) * 1000 : 0
// 					));
// 					if (m[13]) { // has gmt offset or Z
// 									if (m[14]) { // has gmt offset
// 													d.setUTCMinutes(
// 																	d.getUTCMinutes() +
// 																	(m[15] == '-' ? 1 : -1) * (Number(m[16]) * 60 + (m[18] ? Number(m[18]) : 0))
// 													);
// 									}
// 					}else{ // no specified timezone
// 									if (!utcMode) {
// 													d = coerceToLocal(d);
// 									}
// 					}
// 					return xdate.setTime(d.getTime());
// 	}
// }
// XDate.locales = {
// 	'': {
// 					monthNames: ['January','February','March','April','May','June','July','August','September','October','November','December'],
// 					monthNamesShort: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
// 					dayNames: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
// 					dayNamesShort: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
// 					amDesignator: 'AM',
// 					pmDesignator: 'PM'
// 	}
// };