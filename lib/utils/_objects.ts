import { bool } from '../types';
import { _jsonCopy, _jsonParse, _jsonStringify } from './_json';
import { _int, _num } from './_number';
import { _str, _string, _stringable } from './_string';
import { _isBuffer } from '../3rd-party';

/**
 * Flatten array recursively
 * 
 * @param values
 */
export const _flatten = (values: any[]): any[] => values.flat(Infinity);

/**
 * Check if value has property
 * 
 * @param value  Search `object` value
 * @param prop  Find property
 * @param own  [default: `false`] As own property
 * 
 */
export const _hasProp = (value: any, prop: any, own: bool = false): boolean => {
	if (!('object' === typeof value && value)) return false;
	return Object.prototype.hasOwnProperty.call(value, prop) || (own ? false : prop in value);
};

/**
 * Check if object has properties
 * 
 * @param value  Search `object` value
 * @param props  Spread find properties
 * 
 */
export const _hasProps = (value: any, ...props: any): boolean => !props.length ? false : !props.filter((k: any) => !_hasProp(value, k)).length;

/**
 * Check if object has any of the properties
 * 
 * @param value  Search `object` value
 * @param props  Spread find properties
 * 
 */
export const _hasAnyProps = (value: any, ...props: any): boolean => !props.length ? false : !!props.filter((k: any) => _hasProp(value, k)).length;

/**
 * Check if value is a class function
 * 
 * @param value  Test value
 */
export const _isClass = (value: any): boolean => {
	if (!(value && value.constructor === Function) || value.prototype === undefined) return false;
	if (Function.prototype !== Object.getPrototypeOf(value)) return true;
	return Object.getOwnPropertyNames(value.prototype).length > 1;
};

/**
 * Check if value is a function (or class optionally)
 * 
 * @param value  Test value
 * @param orClass  [default: `false`] Includes class function
 */
export const _isFunc = (value: any, orClass: boolean = false): boolean => {
	return value && 'function' === typeof value && (orClass ? true : !_isClass(value));
};

/**
 * Get `[min, max]` compared and arranged in order
 * - Example: `_minMax(20, 10)` => `[10, 20]`
 * - Example: `_minMax(0.23, null)` => `[null, 0.23]`
 *  
 * @param a  Compare value 1
 * @param b  Compare value 2
 * @returns `[min, max]`
 */
export const _minMax = (a: any, b: any): [min: any, max: any] => {
	let min: any = a, max: any = b;
	if (a > b){
		min = b;
		max = a;
	}
	return [min, max];
};

/**
 * Flatten object values recursively to dot paths (i.e. `{a:{x:1},b:{y:2,z:[5,6]}}` => `{'a.x':1,'b.y':2,'b.z.0':5,'b.z.1':6}`)
 * 
 * @param value  Parse object
 * @param omit  Omit entry keys/dot paths
 * @returns `{[key: string]: any}`
 */
export const _dotFlat = (value: any, omit: string[] = []):{[key: string]: any} => {
	if (!(value && 'object' === typeof value)) return {};
	const _entries: [key: string, val: any][] = [];
	const _addEntries = (obj: any, _p_key: string) => {
		Object.entries(obj).forEach(entry => {
			const [k, v] = entry;
			const _key = `${(_p_key ? `${_p_key}.` : '')}${k}`;
			if (omit && Array.isArray(omit) && omit.length && (omit.includes(`${k}`) || omit.includes(_key))) return;
			if (v && 'object' === typeof v) _addEntries(v, _key);
			else _entries.push([_key, v]);
		});
	};
	_addEntries(value, '');
	return Object.fromEntries(_entries);
};

/**
 * Get validated object dot path (i.e. `'a.b.c'` to refer to `{a:{b:{c:1}}}`)
 * 
 * @param dot_path - dot separated keys
 * @param operations - supports operations (i.e. '!reverse'/'!slice=0') ~ tests dot keys using `/^[-_0-9a-zA-Z]+\=([^\=\.]*)$/` instead of default `/^[-_0-9a-zA-Z]+$/`
 * @param _failure - error handling ~ `0` = (default) disabled, '1' = warn error, `2` = warn and throw error
 * @returns `string` valid dot path
 */
export const _validDotPath = (dot_path: string, operations: boolean = false, _failure: 0|1|2 = 0): string => {
	try {
		if (!(dot_path = _str(dot_path, true))) throw new TypeError('Invalid dot path value.');
		const parts: string[] = dot_path.split('.').map(v => v.trim()).filter(v => v.length);
		if (!parts.length) throw new TypeError(`Invalid dot path format "${dot_path}".`);
		const buffer = [];
		for (let i = 0; i < parts.length; i ++){
			let tmp, part = parts[i];
			let valid: boolean = /^[-_0-9a-zA-Z]+$/.test(part);
			if (!valid && operations){
				if (['!reverse', '!slice'].includes(part)) valid = true;
				else if (part.indexOf('=') > -1){
					const _invalid = part.split(',')
					.filter(v => v.trim())
					.filter(v => !/^[-_0-9a-zA-Z]+\=([^\=\.]*)$/.test(v));
					if (!_invalid.length) valid = true;
				}
			}
			if (!valid) throw new TypeError(`Invalid dot path key "${part}".`);
			buffer.push(part);
		}
		return buffer.join('.');
	}
	catch (e){
		if (_failure){
			if (_failure === 1) console.warn(e, {dot_path, operations});
			else if (_failure === 2) throw e;
		}
		return '';
	}
};

/**
 * Get parsed `boolean` value
 * 
 * @param value - parse value
 * @param strict - strict mode ~ support only `boolean-like` value (i.e. `'true'|'false'|true|false|1|0`) returns `undefined` if unsupported when enabled.
 * @param trim - trim `string` value (default `true`)
 * @returns
 * - `boolean`
 * - `undefined` when invalid if `strict` is enabled
 * - `'false' => false` | `!!value` when strict is disabled
 */
export const _bool = (value: any, strict: boolean = false, trim: boolean = true): boolean|undefined => {
	if (trim && 'string' === typeof value) value = value.trim();
	if (strict && !['true', 'false', true, false, 1, 0].includes(value)) return undefined;
	return value === 'false' ? false : !!value;
};

/**
 * Resolve dot path object value ~ supports array operations chaining
 * 
 * @example
 * 
 * //simple usage
 * _dotGet('x', {'x':1}) => 1
 * _dotGet('a.b.c', {'a':{'b':{'c':1}}}) => 1
 * _dotGet('a.b.d', {'a':{'b':{'c':1}}}) => null
 * _dotGet('a.0', {'a':['x','y']}) => 'x'
 * 
 * //array reverse operation (done slice copy)
 * _dotGet('0.!reverse', [[3,2,1]]) => [3,2,1]
 * 
 * //array slice operation
 * _dotGet('0.!slice', [[1,2,3]]) => [1,2,3]
 * 
 * //array slice negative `-number`
 * _dotGet('0.-2', [[1,2,3]]) => [2,3]
 * 
 * //array `key=value` searching
 * _dotGet('0.a=2', [[{'a':1,'b':2},{'a':2,'b':3}]]) => {'a':2,'b':3}
 * _dotGet('0.a=1,b=2', [[{'a':1,'b':2,'c':3},{'a':2,'b':3,'c':4}]]) => {'a':1,'b':2,'c':3}
 * 
 * @param dot_path - dot separated keys ~ optional array operations
 * @param target - traverse object
 * @param _failure - error handling ~ `0` = (default) disabled, `1` = warn error, `2` = throw error
 * @param _default - default result on failure
 * @returns `any` dot path match result
 */
export const _dotGet = (dot_path: string, target: any, _failure: 0|1|2 = 0, _default?: any): any => {
	try {
		const keys = (dot_path = _validDotPath(dot_path, true, _failure)).split('.');
		if (!keys.length) throw new TypeError('Invalid resolve dot path format.');
		let abort: boolean = false, value: any = keys.reduce((prev: any, key: string) => {
			if (abort) return prev; //not found
			if (prev && 'object' === typeof prev){
				if (_hasProp(prev, key)) return prev[key]; //key value
				if (Array.isArray(prev)){
					if (key === '!reverse') return prev.slice().reverse(); //array reverse (slice)
					if (key === '!slice') return prev.slice(); //array slice
					
					//array slice `-number`
					let tmp: any;
					if ((tmp = _num(key, 0)) < 0 && Number.isInteger(tmp)) return prev.slice(tmp);
					
					//array search
					if (prev.length && key.indexOf('=') > -1){
						const search_entries = key.split(',')
						.filter(v => v.trim())
						.map(val => {
							let arr = val.split('=');
							if (arr.length !== 2) return [];
							let k = arr[0].trim();
							let v = decodeURIComponent(arr[1]);
							return k ? [k, _jsonParse(v, v)] : [];
						})
						.filter(v => v.length);
						let index = -1;
						if (search_entries.length) index = prev.findIndex(o => {
							const matches = search_entries.filter(v => _hasProp(o, v[0]) && o[v[0]] === v[1]);
							return matches.length && matches.length === search_entries.length;
						});
						if (index > -1) return prev[index];
						abort = true;
						return undefined;
					}
				}
			}
			
			//not found
			abort = true;
			return undefined;
		}, target);
		return !abort ? value : _default;
	}
	catch (e) {
		if (_failure){
			if (_failure === 1) console.warn(e, {dot_path, target});
			else if (_failure === 2) throw e;
		}
		return _default;
	}
};

/**
 * Get dot path value
 * 
 * @param dot_path - dot separated keys ~ optional array operations
 * @param target - traverse object
 * @param _failure - error handling ~ `0` = (default) disabled, '1' = warn error, `2` = warn and throw error
 * @returns ``
 */
export const _dotValue = <TResult = any>(dot_path: string, target: any, _failure: 0|1|2 = 0): TResult|undefined => {
	try {
		const keys = (dot_path = _validDotPath(dot_path, true, _failure)).split('.');
		if (!keys.length) throw new TypeError('Invalid resolve dot path format.');
		return keys.reverse().reduce((prev, key) => ({[key]: prev}), target) as (TResult|undefined);
	}
	catch (e) {
		if (_failure){
			if (_failure === 1) console.warn(e, {dot_path, target});
			else if (_failure === 2) throw e;
		}
		return undefined;
	}
};

//Get all property descriptors
export const _getAllPropertyDescriptors = (value: any): {[key: string|number|symbol]: any} => {
	if ([null, undefined].includes(value)) return {};
	const proto = Object.getPrototypeOf(value);
	return {..._getAllPropertyDescriptors(proto), ...Object.getOwnPropertyDescriptors(value)};
};

//Get all properties
export const _getAllProperties = (value: any, statics: boolean = false): (string|number|symbol)[] => {
	if ([null, undefined].includes(value)) return []; //ignore null/undefined
	const props = new Set<string|number|symbol>(); //properies

	//add own property names
	Object.getOwnPropertyNames(value).forEach(v => props.add(v)); //own
	
	//fn => get keys helper
	const __get_keys = (obj: any): (string|number|symbol)[] => {
		const keys: (string|number|symbol)[] = [];
		for (let key in obj) keys.push(key);
		return keys;
	};

	//fn => get properties helper
	const __get_props = (val: any): (string|number|symbol)[] => __get_keys(_getAllPropertyDescriptors(val)).concat(Object.getOwnPropertySymbols(val));

	//excluded default props
	const excluded_props: (string|number|symbol)[] = [...new Set([
		
		//Function
		...__get_props(Function.prototype),
		...(!statics ? [] : __get_props(Function)),

		//Object
		...__get_props(Object.prototype),
		...(!statics ? [] : __get_props(Object)),
	])];

	//fn => add props helper
	const __add_props = (val: any): void => __get_props(val).filter(v => !excluded_props.includes(v)).forEach(v => props.add(v));

	//add props
	__add_props(value);
	if (statics) __add_props(Object(value).constructor);

	//result
	return [...props];
};

/**
 * @deprecated
 * Get coerced `number/string/JSON` value ~ `value.valueOf()`
 * 
 * @param value - parse value
 * @returns `any` ~ `object`|`undefined`|`boolean`|`number`|`bigint`|`string`|`symbol`
 */
export const _valueOf = (value: any): any => {
	if (!(value && 'object' === typeof value)) return value;
	let val: any = value.valueOf();
	if (val === value){
		if (Object(value[Symbol.toPrimitive]) === value[Symbol.toPrimitive] && !isNaN(val = Number(value))) return val; //hint number
		if ((val = _stringable(value)) !== false) return val; //hint string | value.toString()
		if ('function' === typeof value.toJSON && (val = value.toJSON()) !== value) return val; //value.toJSON()
	}
	return val; //value.valueOf()
};

/**
 * Check if value is empty ~ `null`/`undefined`/`NaN`/`''`/`{}`/`![...value]`
 * 
 * @param value - parse value
 * @param trim - trim whitespace ~ when value is `string/Buffer`
 * @returns `boolean`
 */
export const _empty = (value: any, trim: boolean = false): boolean => {
	if ([null, undefined, NaN, ''].includes(value)) return true; //default empty
	if (['function', 'boolean', 'number'].includes(typeof value)) return false; //function/boolean/number - ignore
	if ('string' === typeof value || _isBuffer(value)) return !_str(value, trim).length; //string/Buffer - !length
	if ('object' !== typeof value) return false; //non object - ignore
	if (value instanceof Map || value instanceof Set) return !value.size; //Map/Set - !size
	if (Array.isArray(value)) return !value.length; //Array - !length
	if (Object(value[Symbol.iterator]) === value[Symbol.iterator]) return ![...value].length; //value[Symbol.iterator] - !length
	if (!_getAllProperties(value).length) return true; //has no self properties
	return false; //ignore
};

/**
 * Check if value can be iterated ~ `[...value]`
 * 
 * @param value - parse value
 * @param _async - using `[Symbol.asyncIterator]` (default `false` ~ `[Symbol.iterator]`)
 * @returns `boolean`
 */
export const _iterable = (value: any, _async: boolean = false): boolean => 'function' === typeof value?.[_async ? Symbol.asyncIterator : Symbol.iterator];

/**
 * Object array values
 * 
 * @param value - parse array value
 * @param entries - enable get entries (i.e. `[key: any, value: any][]`) instead of default values (i.e. `any[]`)
 * @param object - enable get `Object.values(value)`/`Object.entries(value)`
 * @returns
 * - `any[]` values or `[key: any, value: any][]` when `entries` argument is `true`
 * - `[value]` when `value` argument is not iterable or arrayable
 * - `[]` when `value` argument is empty ~ `[]`/`{}`/`undefined`
 */
export const _values = (value: any, entries: boolean = false, object: boolean = false): any[] => {
	let items: any[] = value === undefined ? [] : entries ? [['0', value]] : [value];
	if (value && 'object' === typeof value && 'function' !== typeof value){
		if (Object(value[Symbol.iterator]) === value[Symbol.iterator]){
			const has_entries = (items = [...value]).length && items.findIndex(v => !(Array.isArray(v) && v.length === 2 && Object.keys(v) + '' === '0,1')) < 0;
			if (entries) items = has_entries ? items : Object.entries(items);
			else if (has_entries) items = items.map(v => v[1]);
		}
		else if (object){
			const arr = Object.entries(value);
			if (arr.length || (_empty(value) && Object.getPrototypeOf(value) === Object.prototype)) items = !entries && arr.length ? arr.map(v => v[1]) : arr;
		}
		else if (_empty(value) && Object.getPrototypeOf(value) === Object.prototype) items = []; //{}
	}
	return items;
};

/**
 * Get dump value with limit max string length
 * 
 * @param value - parse value
 * @param maxStrLength - max string length [default: `200`]
 * @param first - summarize object array to count and first entry (i.e. `{count:number,first:any}`) 
 * @returns `any` - dump value
 */
export const _dumpVal = (value: any, maxStrLength: number = 200, first: boolean = false): any => {
	const minStrLength = 20;
	value = _jsonCopy(value);
	maxStrLength = !(maxStrLength = _int(maxStrLength, 200)) ? 0 : (maxStrLength >= minStrLength ? maxStrLength : 200);
	const _maxStr = (v: any): any => {
		if (!('string' === typeof v && v.length > maxStrLength)) return v;
		const append = `...(${v.length})`;
		return v.substring(0, maxStrLength - append.length) + append;
	};
	const _get_first = (val: any): any => {
		if (Array.isArray(val)){
			let same_keys = 1, prev_keys = '';
			for (let i = 0; i < val.length; i ++){
				const v = val[i];
				if (Object(v) !== v){
					same_keys = 0;
					break;
				}
				const keys = Object.keys(v);
				if (keys.length){
					same_keys = 0;
					break;
				}
				const keys_val = keys.join(',');
				if (!i) prev_keys = keys_val;
				else if (keys_val !== prev_keys){
					same_keys = 0;
					break;
				}
			}
			if (same_keys && val.length) return {count: val.length, first: _get_first(val[0])};
		}
		return val;
	};
	const _parse = (val: any): any => {
		if ('object' === typeof val && val){
			for (let k in val){
				if (!val.hasOwnProperty(k)) continue;
				val[k] = _parse(val[k]);
			}
		}
		else val = _maxStr(val);
		return val;
	};
	return _parse(first ? _get_first(value) : value);
};