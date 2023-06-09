import { _jsonStringify, _jsonParse, _jsonClone } from '../lib';
import { _expectTestData } from './__utils';

//_jsonStringify
describe.skip("Test call arguments... \`_jsonStringify: (value: any, space?: string | number | undefined, _undefined?: any) => string\`", () => {
	_expectTestData('_jsonStringify', _jsonStringify, [
		{
			text: 'Date instance',
			code: `new Date(0)`,
			args: [new Date(0)],
			result: `"1970-01-01T00:00:00.000Z"`,
		},
		{
			text: 'Date invalid instance',
			code: `new Date('')`,
			args: [new Date('')],
			result: `null`,
		},
		{
			text: 'integer',
			code: `69`,
			args: [69],
			result: `69`,
		},
		{
			text: 'float',
			code: `420.247`,
			args: [420.247],
			result: `420.247`,
		},
		{
			text: 'float',
			code: `420.247`,
			args: [420.247],
			result: `420.247`,
		},
		{
			text: 'string',
			code: `'Hello world!'`,
			args: ['Hello world!'],
			result: `"Hello world!"`,
		},
		{
			text: 'null',
			code: `null`,
			args: [null],
			result: `null`,
		},
		{
			text: 'undefined',
			code: `undefined`,
			args: [undefined],
			result: `null`,
		},
		{
			text: 'boolean true',
			code: `undefined`,
			args: [true],
			result: `true`,
		},
		{
			text: 'boolean false',
			code: `undefined`,
			args: [false],
			result: `false`,
		},
		{
			text: 'array',
			code: `[1,2,3]`,
			args: [[1,2,3]],
			result: `[1,2,3]`,
		},
		{
			text: 'object',
			code: `{name:'John',guest:true}`,
			args: [{name:'John',guest:true}],
			result: `{"name":"John","guest":true}`,
		},
		{
			text: 'circular reference',
			code: `new (class T{self:T;constructor(){this.self=this}})`,
			args: [new (class T{self:T;constructor(){this.self=this}})],
			result: `{"self":"[Circular]this"}`,
		},
		{
			text: 'Set instance',
			code: `new Set<number>([1,1,2])`,
			args: [new Set([1,1,2])],
			result: `{"[Set]":[1,2]}`,
		},
		{
			text: 'Map instance',
			code: `new Map<string,string|number>([['one',1],['two','ii']])`,
			args: [new Map<string,string|number>([['one',1],['two','ii']])],
			result: `{"[Map]":[["one",1],["two","ii"]]}`,
		},
		{
			text: 'Error instance',
			code: `new TypeError('example')`,
			args: [new TypeError('example')],
			result: `{"[Error]":"TypeError: example"}`,
		},
	]);
});