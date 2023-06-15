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
	let p1 = 0, p2 = 0, max = 200;
	const _esc = (v: any, q: boolean = false) => {
		v = q ? `${v}`.replace(/'/g, `\\'`) : `${v}`;
		return v.replace(/\n/g, '\\n')
		.replace(/\r/g, '\\r')
		.replace(/\t/g, '\\t')
		.replace(/\v/g, '\\v')
		.replace(/\x00/g, '\\x00');
	};
	const _pre = (v: any) => _esc(v);
	const _code = (v: any) => `${func}(${_esc(v)})`;
	const _exp = (v: any) => {
		if ('string' === typeof v) return `'${_esc(v, true)}'`;
		else if ('object' === typeof v && v) return JSON.stringify(v);
		return `${v}`;
	};
	data.forEach(item => {
		const t = _pre(item.text).length, c = _code(item.code).length;
		let xl = t + c + ` :  --> ${_exp(item.expected)}`.length;
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
		let ret: any = _exp(item.expected);
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