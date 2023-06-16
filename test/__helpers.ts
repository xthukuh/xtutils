/**
 * Test data item interface
 */
export interface ITestItem {
	label: string;
	code: string;
	args: any[];
	expected: any;
}

/**
 * Test label escape string special characters
 * 
 * @param v  Escape value 
 * @param q  Escape "'" quote
 */
export const _testEsc = (value: string, quote: boolean = false): string => {
	value = quote ? `${value}`.replace(/'/g, `\\'`) : `${value}`;
	return value.replace(/\r/g, '\\r')
	.replace(/\n/g, '\\n')
	.replace(/\t/g, '\\t')
	.replace(/\f/g, '\\f')
	.replace(/\v/g, '\\v')
	.replace(/\x00/g, '\\x00');
};

/**
 * Run function expect tests
 * 
 * @param name  Function name
 * @param func  Function handler
 * @param tests  Function tests
 */
export const _expectTests = (name: string, func: (...args:any[])=>any, tests: ITestItem[]): void => {
	if (!tests.length) return;
	let p1 = 0, p2 = 0, max = 200;
	const _pre = (v: any) => _testEsc(v);
	const _code = (v: any) => `${name}(${_testEsc(v)})`;
	const _exp = (v: any) => {
		if ('string' === typeof v) return /\\/.test(v) ? JSON.stringify(v) : `'${_testEsc(v, true)}'`;
		else if ('object' === typeof v && v) return JSON.stringify(v);
		return `${v}`;
	};
	tests.forEach(item => {
		const t = _pre(item.label).length, c = _code(item.code).length;
		let xl = t + c + ` :  --> ${_exp(item.expected)}`.length;
		if (xl > max) return;
		p1 = t > p1 ? t : p1;
		p2 = c > p2 ? c : p2;
	});
	const items: {
		description: string;
		args: any[];
		expected: any;
	}[] = tests.map(item => {
		let ret: any = _exp(item.expected);
		let description = `${_pre(item.label).padEnd(p1)} : ${_code(item.code).padEnd(p2)} --> ${ret}`;
		if (description.length > max) description = `${_pre(item.label).padEnd(p1)} : ${_code(item.code)} --> ${ret}`;
		const args = item.args;
		const expected = item.expected;
		return {description, args, expected};
	});
	test.each(items)('$description', ({args, expected}) => {
		expect(func(...args)).toStrictEqual(expected);
	});
};