import { _jsonStringify, _jsonParse, _jsonClone } from '../lib';
import { _expectTestDataFn } from './helpers';

//_jsonStringify
describe('_jsonStringify: (value: any, space?: string | number | undefined, _undefined?: any) => string', () => {
	_expectTestDataFn('_jsonStringify', _jsonStringify, [
		{
			text: 'Date instance',
			code: `new Date(0)`,
			args: [new Date(0)],
			expected: `"1970-01-01T00:00:00.000Z"`,
		},
		{
			text: 'Date invalid instance',
			code: `new Date('')`,
			args: [new Date('')],
			expected: `null`,
		},
		{
			text: 'number',
			code: `420.69`,
			args: [420.69],
			expected: `420.69`,
		},
		{
			text: 'string',
			code: `'Hello world!'`,
			args: ['Hello world!'],
			expected: `"Hello world!"`,
		},
		{
			text: 'boolean',
			code: `true`,
			args: [true],
			expected: `true`,
		},
		{
			text: 'null',
			code: `null`,
			args: [null],
			expected: `null`,
		},
		{
			text: 'undefined',
			code: `undefined`,
			args: [undefined],
			expected: `null`,
		},
		{
			text: 'undefined (sub)',
			code: `undefined, null, ''`,
			args: [undefined, null, ''],
			expected: `""`,
		},
		{
			text: 'array',
			code: `[1,2,'a']`,
			args: [[1,2,'a']],
			expected: `[1,2,"a"]`,
		},
		{
			text: 'object',
			code: `{name:'John',guest:true}`,
			args: [{name:'John',guest:true}],
			expected: `{"name":"John","guest":true}`,
		},
		{
			text: 'circular reference',
			code: `new (class T{self:T;constructor(){this.self=this}})`,
			args: [new (class T{self:T;constructor(){this.self=this}})],
			expected: `{"self":"[Circular]this"}`,
		},
		{
			text: 'Set instance',
			code: `new Set<number>([1,1,2])`,
			args: [new Set<number>([1,1,2])],
			expected: `{"[Set]":[1,2]}`,
		},
		{
			text: 'Map instance',
			code: `new Map<string,string|number>([['one',1],['two','ii']])`,
			args: [new Map<string,string|number>([['one',1],['two','ii']])],
			expected: `{"[Map]":[["one",1],["two","ii"]]}`,
		},
		{
			text: 'Error instance',
			code: `new TypeError('example')`,
			args: [new TypeError('example')],
			expected: `{"[Error]":"TypeError: example"}`,
		},
		{
			text: 'space indentation',
			code: `{name: 'John', arr: [1,2]}, 2`,
			args: [{name: 'John', arr: [1,2]}, 2],
			expected: '{\n  "name": "John",\n  "arr": [\n    1,\n    2\n  ]\n}',
		},
	]);
});

//_jsonParse
describe('\n  _jsonParse: (value: string, _default?: any) => any', () => {
	_expectTestDataFn('_jsonParse', _jsonParse, [
		{
			text: 'null',
			code: `'null'`,
			args: ['null'],
			expected: null,
		},
		{
			text: 'boolean',
			code: `'true'`,
			args: ['true'],
			expected: true,
		},
		{
			text: 'number',
			code: `'69.420'`,
			args: ['69.420'],
			expected: 69.420,
		},
		{
			text: 'string',
			code: `"1970-01-01T00:00:00.000Z"`,
			args: [`"1970-01-01T00:00:00.000Z"`],
			expected: `1970-01-01T00:00:00.000Z`,
		},
		{
			text: 'array',
			code: `[1,2,"a"]`,
			args: [`[1,2,"a"]`],
			expected: [1,2,'a'],
		},
		{
			text: 'object',
			code: `"{\\"name\\":\\"John\\",\\"guest\\":true}"`,
			args: ["{\"name\":\"John\",\"guest\":true}"],
			expected: {name:'John',guest:true},
		},
		{
			text: 'object (alt)',
			code: `'{"name":"John","guest":true}'`,
			args: ['{"name":"John","guest":true}'],
			expected: {name:'John',guest:true},
		},
		{
			text: 'invalid',
			code: `'undefined'`,
			args: ['undefined'],
			expected: undefined,
		},
		{
			text: 'invalid format',
			code: `'{name:"John",guest:true}'`,
			args: ['{name:"John",guest:true}'],
			expected: undefined,
		},
		{
			text: 'invalid format (default)',
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