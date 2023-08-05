import { bool } from '../types';

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
 * Get `[min, max]` compared and arranged
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

//TODO: dot path objects
// export const dotPath = (path, operations=false, throwable=false) => {
// 	try {
// 		let parts = splitStr(path, '.');
// 		if (!parts.length) throw 'Invalid dot path.';
// 		let buffer = [];
// 		for (let i = 0; i < parts.length; i ++){
// 			let tmp, part = parts[i], valid = 0;
// 			if (!part.match(/^[-_0-9a-zA-Z]+$/)){
// 				if (operations){
// 					if (['!reverse', '!slice'].includes(tmp = part.toLowerCase())){
// 						part = tmp;
// 						valid = 1;
// 					}
// 					else if (part.match(/^[-_0-9a-zA-Z]+\=([^\=\.]*)$/)) valid = 1;
// 				}
// 			}
// 			else valid = 1;
// 			if (!valid) throw `Invalid dot path key [${i}] -> (${part}).`;
// 			buffer.push(part);
// 		}
// 		return buffer.join('.');
// 	}
// 	catch (e){
// 		if (throwable !== false) console.warn(e, {path, operations});
// 		if (throwable) throw new Error(e);
// 		return '';
// 	}
// };

// export const objDotPath = (obj, path, _default, throwable=false) => {
// 	let keys = splitStr(dotPath(path, 1, throwable), '.');
// 	if (!keys.length) return _default === obj ? obj : undefined;
// 	let exists = 1, value = keys.reduce((val, key) => {
		
// 		//val not found
// 		if (!exists) return val;

// 		//val object get
// 		if (is(val, 'object')){

// 			//key value
// 			if (hasProp(val, key)) return val[key];

// 			//val array get
// 			if (is(val, 'array')){
// 				let tmp, sk, sv;

// 				//reverse operation
// 				if (key === '!reverse') return val.reverse();
				
// 				//slice operation
// 				if (key === '!slice') return val.slice();
// 				if (Number.isInteger(tmp = toNum(key)) && tmp < 0) return val.slice(tmp);

// 				//search operation
// 				if (val.length && key.indexOf('=') > -1 && (tmp = key.split('=')).length === 2 && (sk = tmp[0].trim())){
// 					sv = jsonParse(tmp[1], tmp[1]);
// 					let i = val.findIndex(o => {
// 						if (!hasProp(o, sk)) return false;
// 						return isMatch(o[sk], sv);
// 					});
// 					if (i < 0){
// 						exists = 0;
// 						return undefined;
// 					}
// 					return val[i];
// 				}
// 			}
// 		}

// 		//not found
// 		exists = 0;
// 		return undefined;
// 	}, obj);
// 	return exists ? value : _default;
// };

// //dot path value
// export const dotPathValue = (path, value, throwable=false) => {
// 	let keys = splitStr(dotPath(path, 0, throwable), '.');
// 	if (!keys.length) return;
// 	return keys.reverse().reduce((prev, key) => ({[key]: prev}), value);
// };

// //dot path assign
// export const objDotPathAssign = (obj, path, value, array_object=false, throwable=false) => {
// 	let item = dotPathValue(path, value, throwable);
// 	return deepAssignGet(obj, [item], [], [], !!array_object);
// };