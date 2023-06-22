/**
 * Shallow values match comparison
 * 
 * @param a  Compare value 1
 * @param b  Compare value 2
 * @param looseEquality  Use `==` instead of `===` during comparison
 * @returns `boolean` values match
 */
export const _shallowCompare = (a: any, b: any, looseEquality: boolean = false): boolean => {
	//eslint-disable-next-line
	const _comp = (x: any, y: any) => (looseEquality ? x == y : x === y);
	if (_comp(a, b)) return true;
	if (!(a instanceof Object) || !(b instanceof Object)) return false;
	if (a.constructor !== b.constructor) return false;
	let k;
	for (k in a){
		if (!a.hasOwnProperty(k)) continue;
		if (!b.hasOwnProperty(k)) return false;
		if (_comp(a[k], b[k])) continue;
		if ('object' !== typeof(a[k])) return false;
		if (!_shallowCompare(a[k], b[k], looseEquality)) return false;
	}
	for (k in b){
		if (b.hasOwnProperty(k) && !a.hasOwnProperty(k)) return false;
	}
	return true;
};

//TODO: deep compare multiple values
// /**
//  * Deep compare.
//  * 
//  * ~ compareTarget	= arguments[0]
//  * ~ compareWith	= arguments[1*]
//  * 
//  * @returns {Boolean}  //is match
//  */
// function deepCompare(){
// 	let leftChain, rightChain;

// 	//check if two items match
// 	const deepMatch = (a, b) => {
		
// 		//Note that NaN === NaN returns false and isNaN(undefined) returns true
// 		if ('number' === typeof a && 'number' === typeof b && isNaN(a) && isNaN(b)) return true;

// 		//Check if both arguments link to the same object.
// 		if (a === b) return true;

// 		//Check functions in case when functions are created in constructor (i.e. dates, built-ins)
// 		if (
// 			('function' === typeof a && 'function' === typeof b)
// 			|| (a instanceof Date && b instanceof Date)
// 			|| (a instanceof RegExp && b instanceof RegExp)
// 			|| (a instanceof String && b instanceof String)
// 			|| (a instanceof Number && b instanceof Number)
// 		) return a.toString() === b.toString();

// 		//Check prototypes
// 		if (!(a instanceof Object && b instanceof Object)) return false;
// 		if (a.isPrototypeOf(b) || b.isPrototypeOf(a)) return false;
// 		if (a.constructor !== b.constructor) return false;
// 		if (a.prototype !== b.prototype) return false;

// 		//Check for infinitive linking loops
// 		if (leftChain.indexOf(a) > -1 || rightChain.indexOf(b) > -1) return false;

// 		//Check b props in a
// 		for (let key in b){
// 			if (b.hasOwnProperty(key) === a.hasOwnProperty(key)){
// 				if (typeof b[key] !== typeof a[key]) return false;
// 			}
// 		}

// 		//Check a props in b
// 		for (let key in a){
// 			if (b.hasOwnProperty(key) !== a.hasOwnProperty(key)) return false;
// 			else if (typeof b[key] !== typeof a[key]) return false;
// 			let val_a = a[key];
// 			let val_b = b[key];
// 			switch (typeof val_a){
// 				case 'object':
// 				case 'function':
// 					leftChain.push(a);
// 					rightChain.push(b);
// 					if (!deepMatch(val_a, val_b)) return false;
// 					leftChain.pop();
// 					rightChain.pop();
// 					break;

// 				default:
// 					if (val_a !== val_b) return false;
// 					break;
// 			}
// 		}

// 		//matched
// 		return true;
// 	};

// 	//no args
// 	if (arguments.length < 1){
// 		console.warn('deepCompare received no arguments.');
// 		return true;
// 	}

// 	//compare args
// 	for (let i = 1, len = arguments.length; i < len; i ++){
// 		leftChain = [];
// 		rightChain = [];
// 		if (!deepMatch(arguments[0], arguments[i])) return false;
// 	}

// 	//deep matched
// 	return true;
// }