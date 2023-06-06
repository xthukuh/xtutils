import { _jsonStringify, _jsonParse, _jsonClone } from './_json';

//tests
describe("Testing \`_json\` utils", () => {
	
	//json stringify
	describe("Test function \`_jsonStringify: (value: any, space?: string | number | undefined, _undefined?: any) => string\`", () => {
		
		//date
		it(`stringify Date instance - calling \`_jsonStringify(new Date(0))\` returns '"1970-01-01T00:00:00.000Z"'`, () => {
			expect(_jsonStringify(new Date(0))).toBe(`"1970-01-01T00:00:00.000Z"`);
		});

		//date - invalid
		it(`stringify invalid Date instance - calling \`_jsonStringify(new Date(''))\` returns "null"`, () => {
			expect(_jsonStringify(new Date(''))).toBe(`null`);
		});

		//number - int
		it(`stringify int - calling \`_jsonStringify(1000)\` returns "1000"`, () => {
			expect(_jsonStringify(1000)).toBe(`1000`);
		});

		//number - float
		it(`stringify float - calling \`_jsonStringify(125.3421)\` returns "125.3421"`, () => {
			expect(_jsonStringify(125.3421)).toBe(`125.3421`);
		});

		//string
		it(`stringify string - calling \`_jsonStringify('Hello world!')\` returns ""Hello world!""`, () => {
			expect(_jsonStringify('Hello world!')).toBe(`"Hello world!"`);
		});

		//null
		it(`stringify null - calling \`_jsonStringify(null)\` returns "null"`, () => {
			expect(_jsonStringify(null)).toBe(`null`);
		});

		//undefined
		it(`stringify undefined (default) - calling \`_jsonStringify(undefined)\` returns "null"`, () => {
			expect(_jsonStringify(undefined)).toBe(`null`);
		});

		//undefined with `_undefined`=""
		it(`stringify undefined (substituted) - calling \`_jsonStringify(undefined, null, '')\` returns '""'`, () => {
			expect(_jsonStringify(undefined, null, '')).toBe(`""`);
		});

		//array
		it(`stringify array - calling \`_jsonStringify([1, 2, 3, 4])\` returns "[1,2,3,4]"`, () => {
			expect(_jsonStringify([1, 2, 3, 4])).toBe(`[1,2,3,4]`);
		});

		//Set
		it(`stringify Set instance - calling \`_jsonStringify(new Set<any>([1, 2, 2, 3]))\` returns "{"[Set]":[1,2,3]}"`, () => {
			expect(_jsonStringify(new Set<any>([1, 2, 2, 3]))).toBe(`{"[Set]":[1,2,3]}`);
		});

		//Map
		it(`stringify Map instance - calling \`_jsonStringify(new Map<string, any>([['name', 'John'], ['age', 30]]))\` returns "{"[Map]":[["name","John"],["age",30]]}"`, () => {
			expect(_jsonStringify(new Map<string, any>([['name', 'John'], ['age', 30]]))).toBe(`{"[Map]":[["name","John"],["age",30]]}`);
		});

		//Error
		it(`stringify Error instance - calling \`_jsonStringify(new TypeError('Example message.'))\` returns "{"[Error]":"TypeError: Example message."}"`, () => {
			expect(_jsonStringify(new TypeError('Example message.'))).toBe(`{"[Error]":"TypeError: Example message."}`);
		});

		//object
		it(`stringify object - calling \`_jsonStringify({pet: 'dog', gender: 'Male'})\` returns "{"pet":"dog","gender":"Male"}"`, () => {
			expect(_jsonStringify({pet: 'dog', gender: 'Male'})).toBe(`{"pet":"dog","gender":"Male"}`);
		});

		//object - with circular reference
		it(`stringify object with circular reference - calling \`_jsonStringify(Circular)\` returns "{"value":"Hello World","self":"[Circular Reference]this","inner":{"value":"Inner value.","self":"[Circular Reference]this.self.inner"}}"`, () => {
			class Circular {
				value: string = '';
				self: Circular;
				inner: any;
				constructor() {
					this.value = "Hello World";
					this.self = this;
				}
			}
			const _circular = new Circular();
			const _circular_inner = new Circular();
			_circular_inner.value = 'Inner value.';
			_circular.inner = _circular_inner;
			expect(_jsonStringify(_circular)).toBe(`{"value":"Hello World","self":"[Circular Reference]this","inner":{"value":"Inner value.","self":"[Circular Reference]this.self.inner"}}`);
		});

		//boolean - true
		it(`stringify boolean (true) - calling \`_jsonStringify(true)\` returns "true"`, () => {
			expect(_jsonStringify(true)).toBe(`true`);
		});

		//boolean - false
		it(`stringify boolean (false) - calling \`_jsonStringify(false)\` returns "false"`, () => {
			expect(_jsonStringify(false)).toBe(`false`);
		});
	});
});