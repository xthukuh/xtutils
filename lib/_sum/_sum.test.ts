import { _sum } from './_sum';

//_sum tests
describe("test _sum function", () => {
	it(`calling "_sum(1, 2)" should return 3.`, () => {
		expect(_sum(1, 2)).toBe(3);
	});
});