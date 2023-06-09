/**
 * Test data item interface
 */
export interface ITestDataItem {
	text: string;
	code: string;
	args: any[];
	result: string;
}

/**
 * Test data expect test
 * 
 * @param func 
 * @param handler 
 * @param items 
 */
export const _expectTestData = (func:string, handler: (...args:any[])=>any, items: ITestDataItem[]): void => {
	if (!items.length) return;
	let p1 = 0, p2 = 0, _pre = (v: any) => `${v}`, _code = (v: any) => `${func}(${v})`;
	items.forEach(item => {
		const t = _pre(item.text).length, c = _code(item.code).length;
		p1 = t > p1 ? t : p1;
		p2 = c > p2 ? c : p2;
	});
	items.forEach(item => {
		it(`${_pre(item.text).padEnd(p1)} : ${_code(item.code).padEnd(p2)} --> "${item.result.replace(/"/g,'\\"')}"`, () => {
			expect(handler(...item.args)).toBe(item.result);
		});
	});
};