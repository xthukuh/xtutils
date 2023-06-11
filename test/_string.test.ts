import { _string, _stringable, _strNorm, _str } from '../lib';
import { _expectTestDataFn } from './helpers';

//_string
describe("_string: (value: any, _default?: string) => string", () => {
	_expectTestDataFn('_string', _string, [
		{
			text: 'string',
			code: `'Hello'`,
			args: ['Hello'],
			expected: `Hello`,
		},
		{
			text: 'number',
			code: `420.69`,
			args: [420.69],
			expected: `420.69`,
		},
		{
			text: 'boolean',
			code: `true`,
			args: [true],
			expected: `true`,
		},
		{
			text: 'undefined',
			code: `undefined`,
			args: [undefined],
			expected: `undefined`,
		},
		{
			text: 'null',
			code: `null`,
			args: [null],
			expected: `null`,
		},
		{
			text: 'array',
			code: `[1,2,'a',{}]`,
			args: [[1,2,'a',{}]],
			expected: `1,2,a,[object Object]`,
		},
		{
			text: 'object',
			code: `{name:'John'}`,
			args: [{name:'John'}],
			expected: `[object Object]`,
		},
		{
			text: 'Set instance',
			code: `new Set()`,
			args: [new Set()],
			expected: `[object Set]`,
		},
		{
			text: 'Map instance',
			code: `new Map()`,
			args: [new Map()],
			expected: `[object Map]`,
		},
		{
			text: 'Date instance',
			code: `new Date(0)`,
			args: [new Date(0)],
			expected: `1970-01-01T00:00:00.000Z`,
		},
		{
			text: 'Error instance',
			code: `new TypeError('example')`,
			args: [new TypeError('example')],
			expected: `TypeError: example`,
		},
	]);
});

//_stringable
describe("_stringable: (value: any) => false|string", () => {
	_expectTestDataFn('_stringable', _stringable, [
		{
			text: 'blank string',
			code: `''`,
			args: [''],
			expected: ``,
		},
		{
			text: 'string',
			code: `'Hello'`,
			args: ['Hello'],
			expected: `Hello`,
		},
		{
			text: 'number',
			code: `420.69`,
			args: [420.69],
			expected: `420.69`,
		},
		{
			text: 'boolean',
			code: `true`,
			args: [true],
			expected: `true`,
		},
		{
			text: 'undefined',
			code: `undefined`,
			args: [undefined],
			expected: `undefined`,
		},
		{
			text: 'null',
			code: `null`,
			args: [null],
			expected: `null`,
		},
		{
			text: 'scalar array',
			code: `[1,2,3]`,
			args: [[1,2,3]],
			expected: `1,2,3`,
		},
		{
			text: 'array with object',
			code: `[1,2,'a',{}]`,
			args: [[1,2,'a',{}]],
			expected: false,
		},
		{
			text: 'object',
			code: `{name:'John'}`,
			args: [{name:'John'}],
			expected: false,
		},
		{
			text: 'Set instance',
			code: `new Set()`,
			args: [new Set()],
			expected: false,
		},
		{
			text: 'Map instance',
			code: `new Map()`,
			args: [new Map()],
			expected: false,
		},
		{
			text: 'Date instance',
			code: `new Date(0)`,
			args: [new Date(0)],
			expected: `1970-01-01T00:00:00.000Z`,
		},
		{
			text: 'Error instance',
			code: `new TypeError('example')`,
			args: [new TypeError('example')],
			expected: `TypeError: example`,
		},
	]);
});

//_strNorm
describe("_strNorm: (value: string) => string", () => {
	_expectTestDataFn('_strNorm', _strNorm, [
		{
			text: 'normal',
			code: `'Hello'`,
			args: ['Hello'],
			expected: `Hello`,
		},
		{
			text: 'accents',
			code: `'Amélie'`,
			args: ['Amélie'],
			expected: `Amelie`,
		},
	]);
});

//_str
describe("_str: (value: any, trim: boolean = false, stringify: boolean = false) => string", () => {
	_expectTestDataFn('_str', _str, [
		{
			text: 'string',
			code: `' Hello '`,
			args: [' Hello '],
			expected: ` Hello `,
		},
		{
			text: 'string (trim)',
			code: `' Hello ', true`,
			args: [' Hello ', true],
			expected: `Hello`,
		},
		{
			text: 'number',
			code: `420.69`,
			args: [420.69],
			expected: `420.69`,
		},
		{
			text: 'boolean',
			code: `true`,
			args: [true],
			expected: `true`,
		},
		{
			text: 'undefined',
			code: `undefined`,
			args: [undefined],
			expected: ``,
		},
		{
			text: 'undefined (stringify ignored)',
			code: `undefined, false, true`,
			args: [undefined, false, true],
			expected: ``,
		},
		{
			text: 'null',
			code: `null`,
			args: [null],
			expected: ``,
		},
		{
			text: 'null (stringify ignored)',
			code: `null, false, true`,
			args: [null, false, true],
			expected: ``,
		},
		{
			text: 'scalar array',
			code: `[1,2,3]`,
			args: [[1,2,3]],
			expected: ``,
		},
		{
			text: 'scalar array (stringify)',
			code: `[1,2,3], false, true`,
			args: [[1,2,3], false, true],
			expected: `[1,2,3]`,
		},
		{
			text: 'array with object',
			code: `[1,2,'a',{}]`,
			args: [[1,2,'a',{}]],
			expected: ``,
		},
		{
			text: 'array with object (stringify)',
			code: `[1,2,'a',{}], false, true`,
			args: [[1,2,'a',{}], false, true],
			expected: `[1,2,"a",{}]`,
		},
		{
			text: 'object',
			code: `{name:'John'}`,
			args: [{name:'John'}],
			expected: ``,
		},
		{
			text: 'object (stringify)',
			code: `{name:'John'}, false, true`,
			args: [{name:'John'}, false, true],
			expected: `{"name":"John"}`,
		},
		{
			text: 'Set instance',
			code: `new Set<number>([1,1,2])`,
			args: [new Set<number>([1,1,2])],
			expected: ``,
		},
		{
			text: 'Set instance (stringify)',
			code: `new Set<number>([1,1,2]), false, true`,
			args: [new Set<number>([1,1,2]), false, true],
			expected: `{"[Set]":[1,2]}`,
		},
		// {
		// 	text: 'Map instance',
		// 	code: `new Map<string,string|number>([['one',1],['two','ii']])`,
		// 	args: [new Map<string,string|number>([['one',1],['two','ii']])],
		// 	expected: `{"[Map]":[["one",1],["two","ii"]]}`,
		// },
		// {
		// 	text: 'Set instance',
		// 	code: `new Set(1,2)`,
		// 	args: [new Set()],
		// 	expected: `[object Set]`,
		// },
		// {
		// 	text: 'Map instance',
		// 	code: `new Map()`,
		// 	args: [new Map()],
		// 	expected: `[object Map]`,
		// },
		// {
		// 	text: 'Date instance',
		// 	code: `new Date(0)`,
		// 	args: [new Date(0)],
		// 	expected: `1970-01-01T00:00:00.000Z`,
		// },
		// {
		// 	text: 'Error instance',
		// 	code: `new TypeError('example')`,
		// 	args: [new TypeError('example')],
		// 	expected: `TypeError: example`,
		// },
	]);
});