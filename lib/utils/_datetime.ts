/**
 * Validate `Date` instance
 * 
 * @param value
 */
export const _isDate = (value: any): boolean => value instanceof Date && !isNaN(value.getTime());

/**
 * Get/create `Date` instance
 * 
 * @param value  Parse value ~ `value instanceOf Date ? value : new Date(value)`
 * @param _default  Parse default on failure [default: `undefined` => `new Date()`]
 */
export const _getDate = (value?: any, _default?: Date|string|number|null|undefined): Date => {
	if (!_isDate(value) && !_isDate(value = new Date(value))){
		if (_default instanceof Date) value = _default;
		else if (_default === undefined) value = new Date();
		else value = new Date(_default as any);
	}
	return value;
};

/**
 * Convert `Date` value to datetime format (i.e. `2023-05-27 22:11:57` ~ `YYYY-MM-DD HH:mm:ss`)
 * 
 * @param value  Parse value ~ `value instanceOf Date ? value : new Date(value)`
 * @param _default  Parse default on failure [default: `undefined` => `new Date()`]
 */
export const _datetime = (value?: any, _default?: Date|string|number|null|undefined): string => {
	const date = _getDate(value, _default), _pad = (v: number) => `${v}`.padStart(2, '0');
	return !_isDate(date) ? `${date}` : `${date.getFullYear()}-${_pad(date.getMonth() + 1)}-${_pad(date.getDate())} ${_pad(date.getHours())}:${_pad(date.getMinutes())}:${_pad(date.getSeconds())}`;
};

/**
 * Convert `Date` value to ISO format (i.e. `new Date().toISOString()` ~ `2023-05-27T19:30:44.575Z`)
 * 
 * @param value  Parse value ~ `value instanceOf Date ? value : new Date(value)`
 * @param _default  Parse default on failure [default: `undefined` => `new Date()`]
 */
export const _timestamp = (value?: any, _default?: Date|string|number|null|undefined): string => {
	const date = _getDate(value, _default);
	return !_isDate(date) ? `${date}` : date.toISOString();
};