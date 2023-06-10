/**
 * Test data item interface
 */
export interface ITestDataItem {
	text: string;
	code: string;
	args: any[];
	expected: any;
	returns?: string;
}

/**
 * Runs expect tests on function with data
 * 
 * @param func  Handler function name
 * @param handler  Handler function
 * @param data  Test data items
 */
export const _expectTestDataFn = (func:string, handler: (...args:any[])=>any, data: ITestDataItem[]): void => {
	if (!data.length) return;

	//padding helpers
	let p1 = 0, p2 = 0, max = 200, _pre = (v: any) => `${v}`, _code = (v: any) => `${func}(${v})`;
	data.forEach(item => {
		const t = _pre(item.text).length, c = _code(item.code).length;
		let xl = t + c + ` :  --> ${item.returns ? `(${item.returns}) `: ''}${item.expected}`.length;
		if (xl > max) return;
		p1 = t > p1 ? t : p1;
		p2 = c > p2 ? c : p2;
	});

	//map tests
	const tests: {
		description: string;
		args: any[];
		expected: any;
	}[] = data.map(item => {
		let ret: any = item.expected;
		if ('string' === typeof ret) ret = `'${ret.replace(/'/g, '\\\'').replace(/\t/g, '\\t').replace(/\n/g, '\\n')}'`;
		else if ('object' === typeof ret && ret) ret = JSON.stringify(ret);
		else ret = `${ret}`;
		let description = `${_pre(item.text).padEnd(p1)} : ${_code(item.code).padEnd(p2)} --> ${ret}`;
		if (description.length > max) description = `${_pre(item.text).padEnd(p1)} : ${_code(item.code)} --> ${ret}`;
		const args = item.args;
		const expected = item.expected;
		return {description, args, expected};
	});

	//run tests
	test.each(tests)('$description', ({args, expected}) => {
		expect(handler(...args)).toStrictEqual(expected);
	});
};