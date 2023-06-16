import {
	_uuid,
	_string,
	_stringable,
	_strNorm,
	_str,
	_regEscape,
	_strEscape,
	_trim,
	_ltrim,
	_rtrim,
	_titleCase,
	_sentenceCase,
	// _snakeCase,
  // _slugCase,
  // _studlyCase,
} from '../lib';
import { _expectTests } from './__helpers';

//_uuid
describe('\n  _uuid: (length: number) => string', () => {
	test('generate random string of length 20 (i.e. "") ---> true', () => {
		expect(_uuid(20).length).toBe(20);
	});
});

//_string
describe('_string: (value: any, _default?: string) => string', () => {
	_expectTests('_string', _string, [
		{
			label: 'string',
			code: `'Hello'`,
			args: ['Hello'],
			expected: 'Hello',
		},
		{
			label: 'number',
			code: '420.69',
			args: [420.69],
			expected: '420.69',
		},
		{
			label: 'boolean',
			code: 'true',
			args: [true],
			expected: 'true',
		},
		{
			label: 'undefined',
			code: 'undefined',
			args: [undefined],
			expected: 'undefined',
		},
		{
			label: 'null',
			code: 'null',
			args: [null],
			expected: 'null',
		},
		{
			label: 'array',
			code: `[1,2,'a',{}]`,
			args: [[1,2,'a',{}]],
			expected: '1,2,a,[object Object]',
		},
		{
			label: 'object',
			code: `{name:'John'}`,
			args: [{name:'John'}],
			expected: '[object Object]',
		},
		{
			label: 'Set instance',
			code: 'new Set()',
			args: [new Set()],
			expected: '[object Set]',
		},
		{
			label: 'Map instance',
			code: 'new Map()',
			args: [new Map()],
			expected: '[object Map]',
		},
		{
			label: 'Date instance',
			code: 'new Date(0)',
			args: [new Date(0)],
			expected: '1970-01-01T00:00:00.000Z',
		},
		{
			label: 'Error instance',
			code: `new TypeError('example')`,
			args: [new TypeError('example')],
			expected: 'TypeError: example',
		},
	]);
});

//_stringable
describe('\n  _stringable: (value: any) => false|string', () => {
	_expectTests('_stringable', _stringable, [
		{
			label: 'blank string',
			code: `''`,
			args: [''],
			expected: '',
		},
		{
			label: 'string',
			code: `'Hello'`,
			args: ['Hello'],
			expected: 'Hello',
		},
		{
			label: 'number',
			code: '420.69',
			args: [420.69],
			expected: '420.69',
		},
		{
			label: 'boolean',
			code: 'true',
			args: [true],
			expected: 'true',
		},
		{
			label: 'undefined',
			code: 'undefined',
			args: [undefined],
			expected: 'undefined',
		},
		{
			label: 'null',
			code: 'null',
			args: [null],
			expected: 'null',
		},
		{
			label: 'scalar array',
			code: '[1,2,3]',
			args: [[1,2,3]],
			expected: '1,2,3',
		},
		{
			label: 'array with object',
			code: `[1,2,'a',{}]`,
			args: [[1,2,'a',{}]],
			expected: false,
		},
		{
			label: 'object',
			code: `{name:'John'}`,
			args: [{name:'John'}],
			expected: false,
		},
		{
			label: 'Set instance',
			code: 'new Set()',
			args: [new Set()],
			expected: false,
		},
		{
			label: 'Map instance',
			code: 'new Map()',
			args: [new Map()],
			expected: false,
		},
		{
			label: 'Date instance',
			code: 'new Date(0)',
			args: [new Date(0)],
			expected: '1970-01-01T00:00:00.000Z',
		},
		{
			label: 'Error instance',
			code: `new TypeError('example')`,
			args: [new TypeError('example')],
			expected: 'TypeError: example',
		},
	]);
});

//_strNorm
describe('\n  _strNorm: (value: string) => string', () => {
	_expectTests('_strNorm', _strNorm, [
		{
			label: 'normal',
			code: `'Hello'`,
			args: ['Hello'],
			expected: 'Hello',
		},
		{
			label: 'accents',
			code: `'Amélie'`,
			args: ['Amélie'],
			expected: 'Amelie',
		},
	]);
});

//_str
describe('\n  _str: (value: any, trim: boolean = false, stringify: boolean = false) => string', () => {
	_expectTests('_str', _str, [
		{
			label: 'string',
			code: `' Hello '`,
			args: [' Hello '],
			expected: ' Hello ',
		},
		{
			label: 'string (trim)',
			code: `' Hello ', true`,
			args: [' Hello ', true],
			expected: 'Hello',
		},
		{
			label: 'number',
			code: '420.69',
			args: [420.69],
			expected: '420.69',
		},
		{
			label: 'boolean',
			code: 'true',
			args: [true],
			expected: 'true',
		},
		{
			label: 'undefined',
			code: 'undefined',
			args: [undefined],
			expected: '',
		},
		{
			label: 'undefined (stringify ignored)',
			code: 'undefined, false, true',
			args: [undefined, false, true],
			expected: '',
		},
		{
			label: 'null',
			code: 'null',
			args: [null],
			expected: '',
		},
		{
			label: 'null (stringify ignored)',
			code: 'null, false, true',
			args: [null, false, true],
			expected: '',
		},
		{
			label: 'scalar array',
			code: '[1,2,3]',
			args: [[1,2,3]],
			expected: '',
		},
		{
			label: 'scalar array (stringify)',
			code: '[1,2,3], false, true',
			args: [[1,2,3], false, true],
			expected: '[1,2,3]',
		},
		{
			label: 'array with object',
			code: `[1,2,'a',{}]`,
			args: [[1,2,'a',{}]],
			expected: '',
		},
		{
			label: 'array with object (stringify)',
			code: `[1,2,'a',{}], false, true`,
			args: [[1,2,'a',{}], false, true],
			expected: '[1,2,"a",{}]',
		},
		{
			label: 'object',
			code: `{name:'John'}`,
			args: [{name:'John'}],
			expected: '',
		},
		{
			label: 'object (stringify)',
			code: `{name:'John'}, false, true`,
			args: [{name:'John'}, false, true],
			expected: '{"name":"John"}',
		},
		{
			label: 'Set instance',
			code: `new Set<number>([1,1,2])`,
			args: [new Set<number>([1,1,2])],
			expected: '',
		},
		{
			label: 'Set instance (stringify)',
			code: 'new Set<number>([1,1,2]), false, true',
			args: [new Set<number>([1,1,2]), false, true],
			expected: '{"[Set]":[1,2]}',
		},
		{
			label: 'Map instance',
			code: `new Map<string,string|number>([['one',1],['two','ii']])`,
			args: [new Map<string,string|number>([['one',1],['two','ii']])],
			expected: '',
		},
		{
			label: 'Map instance (stringify)',
			code: `new Map<string,string|number>([['one',1],['two','ii']]), false, true`,
			args: [new Map<string,string|number>([['one',1],['two','ii']]), false, true],
			expected: `{"[Map]":[["one",1],["two","ii"]]}`,
		},
		{
			label: 'Date instance',
			code: 'new Date(0)',
			args: [new Date(0)],
			expected: '1970-01-01T00:00:00.000Z',
		},
		{
			label: 'Date instance (invalid)',
			code: `new Date('')`,
			args: [new Date('')],
			expected: 'Invalid Date',
		},
		{
			label: 'Error instance',
			code: `new TypeError('example')`,
			args: [new TypeError('example')],
			expected: 'TypeError: example',
		},
	]);
});

//_regEscape
describe('\n  _regEscape: (value: any) => string', () => {
	_expectTests('_regEscape', _regEscape, [
		{
			label: 'regex escape special',
			code: `'\\\\s\\r\\n\\t\\f\\v\\x00~_!@#$%^&*()[]\\/,.?"\`\\':;{}|<>=+-'`,
			args: ['\\s\r\n\t\f\v\x00~_!@#$%^&*()[]\\/,.?"`\':;{}|<>=+-'],
			expected: '\\\\s\r\n\t\f\v\x00~_!@#\\$%\\^&\\*\\(\\)\\[\\]\\\\/,\\.\\?"`\':;\\{\\}\\|<>=\\+-',
		},
	]);
});

// _strEscape
describe('\n  _strEscape: (value: any) => string', () => {
	_expectTests('_strEscape', _strEscape, [
		{
			label: 'string escape special',
			code: `'\\r\\n\\t\\f\\v\\x00-\\u00f3-\\u1234-\\xb4-\\u000b-/\\\\'`,
			args: ['\r\n\t\f\v\x00-\u00f3-\u1234-\xb4-\u000b-/\\'],
			expected: '\\r\\n\\t\\f\\v\\x00-ó-ሴ-´-\\v-/\\\\',
		},
	]);
});

//_trim
describe(`\n  _trim: (value: any, chars: string = ' \\r\\n\\t\\f\\v\\x00', rl: ''|'r'|'l'|'right'|'left' = '') => string`, () => {
	_expectTests('_trim', _trim, [
		{
			label: 'default whitespace',
			code: `' \r\n\f\t -_Hello_- \t\v\x00 '`,
			args: [' \r\n\f\t -_Hello_- \t\v\x00 '],
			expected: '-_Hello_-',
		},
		{
			label: 'default whitespace ("l"|"left")',
			code: `' \r\n\f\t -_Hello_- \t\v\x00 ', undefined, 'l'`,
			args: [' \r\n\f\t -_Hello_- \t\v\x00 ', undefined, 'l'],
			expected: '-_Hello_- \t\v\x00 ',
		},
		{
			label: 'default whitespace ("r"|"right")',
			code: `' \r\n\f\t -_Hello_- \t\v\x00 ', undefined, 'r'`,
			args: [' \r\n\f\t -_Hello_- \t\v\x00 ', undefined, 'r'],
			expected: ' \r\n\f\t -_Hello_-',
		},
		{
			label: 'custom characters ({default})',
			code: `' \r\n\f\t -_Hello_- \t\v\x00 ', '-_{default}'`,
			args: [' \r\n\f\t -_Hello_- \t\v\x00 ', '-_{default}'],
			expected: 'Hello',
		},
		{
			label: 'custom characters',
			code: `' \r\n\f\t -_Hello_- \t\v\x00 ', '-_ \n\r\t\f\v\x00'`,
			args: [' \r\n\f\t -_Hello_- \t\v\x00 ', '-_ \n\r\t\f\v\x00'],
			expected: 'Hello',
		},
		{
			label: 'custom characters (left)',
			code: `' \r\n\f\t -_Hello_- \t\v\x00 ', '-_ \n\r\t\f\v\x00', 'l'`,
			args: [' \r\n\f\t -_Hello_- \t\v\x00 ', '-_ \n\r\t\f\v\x00', 'l'],
			expected: 'Hello_- \t\v\x00 ',
		},
		{
			label: 'custom characters (right)',
			code: `' \r\n\f\t -_Hello_- \t\v\x00 ', '-_ \n\r\t\f\v\x00', 'r'`,
			args: [' \r\n\f\t -_Hello_- \t\v\x00 ', '-_ \n\r\t\f\v\x00', 'r'],
			expected: ' \r\n\f\t -_Hello',
		},
	]);
});

//_ltrim
describe(`\n  _ltrim: (value: any, chars: string = ' \\r\\n\\t\\f\\v\\x00') => string`, () => {
	_expectTests('_ltrim', _ltrim, [
		{
			label: 'default whitespace',
			code: `' \r\n\f\t -_Hello_- \t\v\x00 '`,
			args: [' \r\n\f\t -_Hello_- \t\v\x00 '],
			expected: '-_Hello_- \t\v\x00 ',
		},
		{
			label: 'custom characters ({default})',
			code: `' \r\n\f\t -_Hello_- \t\v\x00 ', '-_{default}'`,
			args: [' \r\n\f\t -_Hello_- \t\v\x00 ', '-_{default}'],
			expected: 'Hello_- \t\v\x00 ',
		},
		{
			label: 'custom characters',
			code: `' \r\n\f\t -_Hello_- \t\v\x00 ', '-_ \n\r\t\f\v\x00'`,
			args: [' \r\n\f\t -_Hello_- \t\v\x00 ', '-_ \n\r\t\f\v\x00'],
			expected: 'Hello_- \t\v\x00 ',
		},
	]);
});

//_rtrim
describe(`\n  _rtrim: (value: any, chars: string = ' \\r\\n\\t\\f\\v\\x00') => string`, () => {
	_expectTests('_rtrim', _rtrim, [
		{
			label: 'default whitespace',
			code: `' \r\n\f\t -_Hello_- \t\v\x00 '`,
			args: [' \r\n\f\t -_Hello_- \t\v\x00 '],
			expected: ' \r\n\f\t -_Hello_-',
		},
		{
			label: 'custom characters ({default})',
			code: `' \r\n\f\t -_Hello_- \t\v\x00 ', '-_{default}'`,
			args: [' \r\n\f\t -_Hello_- \t\v\x00 ', '-_{default}'],
			expected: ' \r\n\f\t -_Hello',
		},
		{
			label: 'custom characters',
			code: `' \r\n\f\t -_Hello_- \t\v\x00 ', '-_ \n\r\t\f\v\x00'`,
			args: [' \r\n\f\t -_Hello_- \t\v\x00 ', '-_ \n\r\t\f\v\x00'],
			expected: ' \r\n\f\t -_Hello',
		},
	]);
});