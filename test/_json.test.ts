import { _jsonStringify, _jsonParse, _jsonClone } from '../lib';
import { _expectTests } from './__helpers';

//_jsonStringify
describe('_jsonStringify: (value: any, space?: string | number | undefined, _undefined?: any) => string', () => {
	_expectTests('_jsonStringify', _jsonStringify, [
		{
			label: 'Date instance',
			code: 'new Date(0)',
			args: [new Date(0)],
			expected: '"1970-01-01T00:00:00.000Z"',
		},
		{
			label: 'Date invalid instance',
			code: `new Date('')`,
			args: [new Date('')],
			expected: 'null',
		},
		{
			label: 'number',
			code: '420.69',
			args: [420.69],
			expected: '420.69',
		},
		{
			label: 'string',
			code: `'Hello world!'`,
			args: ['Hello world!'],
			expected: '"Hello world!"',
		},
		{
			label: 'boolean',
			code: 'true',
			args: [true],
			expected: 'true',
		},
		{
			label: 'null',
			code: 'null',
			args: [null],
			expected: 'null',
		},
		{
			label: 'undefined',
			code: 'undefined',
			args: [undefined],
			expected: 'null',
		},
		{
			label: 'undefined (sub)',
			code: `undefined, null, ''`,
			args: [undefined, null, ''],
			expected: '""',
		},
		{
			label: 'array',
			code: `[1,2,'a']`,
			args: [[1,2,'a']],
			expected: '[1,2,"a"]',
		},
		{
			label: 'object',
			code: `{name:'John',guest:true}`,
			args: [{name:'John',guest:true}],
			expected: '{"name":"John","guest":true}',
		},
		{
			label: 'circular reference',
			code: 'new (class T{self:T;constructor(){this.self=this}})',
			args: [new (class T{self:T;constructor(){this.self=this}})],
			expected: '{"self":"[Circular Reference]this"}',
		},
		{
			label: 'Set instance',
			code: 'new Set<number>([1,1,2])',
			args: [new Set<number>([1,1,2])],
			expected: '[1,2]',
		},
		{
			label: 'Map instance',
			code: `new Map<string,string|number>([['one',1],['two','ii']])`,
			args: [new Map<string,string|number>([['one',1],['two','ii']])],
			expected: '[["one",1],["two","ii"]]',
		},
		{
			label: 'Error instance',
			code: `new TypeError('example')`,
			args: [new TypeError('example')],
			expected: '"TypeError: example"',
		},
		{
			label: 'space indentation',
			code: `{name: 'John', arr: [1,2]}, 2`,
			args: [{name: 'John', arr: [1,2]}, 2],
			expected: '{\n  "name": "John",\n  "arr": [\n    1,\n    2\n  ]\n}',
		},
	]);
});

//_jsonParse
describe('\n  _jsonParse: (value: string, _default?: any) => any', () => {
	_expectTests('_jsonParse', _jsonParse, [
		{
			label: 'null',
			code: `'null'`,
			args: ['null'],
			expected: null,
		},
		{
			label: 'boolean',
			code: `'true'`,
			args: ['true'],
			expected: true,
		},
		{
			label: 'number',
			code: `'69.420'`,
			args: ['69.420'],
			expected: 69.420,
		},
		{
			label: 'string',
			code: '"1970-01-01T00:00:00.000Z"',
			args: ['"1970-01-01T00:00:00.000Z"'],
			expected: '1970-01-01T00:00:00.000Z',
		},
		{
			label: 'array',
			code: '[1,2,"a"]',
			args: ['[1,2,"a"]'],
			expected: [1,2,'a'],
		},
		{
			label: 'object',
			code: '"{\\"name\\":\\"John\\",\\"guest\\":true}"',
			args: ["{\"name\":\"John\",\"guest\":true}"],
			expected: {name:'John',guest:true},
		},
		{
			label: 'object (alt)',
			code: `'{"name":"John","guest":true}'`,
			args: ['{"name":"John","guest":true}'],
			expected: {name:'John',guest:true},
		},
		{
			label: 'invalid',
			code: `'undefined'`,
			args: ['undefined'],
			expected: undefined,
		},
		{
			label: 'invalid format',
			code: `'{name:"John",guest:true}'`,
			args: ['{name:"John",guest:true}'],
			expected: undefined,
		},
		{
			label: 'invalid format (default)',
			code: `'{name:"John",guest:true}', 'fail'`,
			args: ['{name:"John",guest:true}', 'fail'],
			expected: 'fail',
		},
	]);
});

//_jsonClone
describe('\n  _jsonClone: <TReturn extends any>(value: any, space?: string|number|undefined, _undefined: any = null) => TReturn', () => {
	describe(`/* Example */ const a = {name: 'John'}, b = a, c = _jsonClone(a);`, () => {
		let a = {name: 'John'}, b = a, c = _jsonClone(a);
		test(`a equals {name: 'John'} --> true`, () => expect(a).toEqual({name: 'John'}));
		test(`b equals {name: 'John'} --> true`, () => expect(b).toEqual({name: 'John'}));
		test(`c equals {name: 'John'} --> true`, () => expect(c).toEqual({name: 'John'}));
		test('a === b --> true', () => expect(a === b).toBe(true));
		test('a === c --> false', () => expect(a === c).toBe(false));
	});
});