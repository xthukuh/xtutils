import { _string, _stringable, _strNorm, _str } from './_string';

//tests
describe("Testing \`_string\` utils", () => {
	
	//_string(...)
	describe("Test function \`_string: (value: any, _default?: string) => string\`", () => {
		
		//int
		it(`calling \`_string(10)\` returns "10"`, () => {
			expect(_string(10)).toBe('10');
		});

		//object
		it(`calling \`_string({name: 'test'})\` returns "[object Object]"`, () => {
			expect(_string({name: 'test'})).toBe('[object Object]');
		});

		//TODO: ...
	});
});