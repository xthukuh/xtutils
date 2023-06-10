import { _string, _stringable, _strNorm, _str } from '../lib';
import { _expectTestDataFn } from './helpers';

//_string(...)
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
	]);
});