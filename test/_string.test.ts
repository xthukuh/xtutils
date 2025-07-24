import {
	_uid,
	_uuid,
	_string,
	_stringable,
	_str,
	_strNorm,
	_regEscape,
	_strEscape,
	_trim,
	_ltrim,
	_rtrim,
	_toTitleCase,
	_toSentenceCase,
	_toSnakeCase,
  _toSlugCase,
  _toStudlyCase,
	_toCamelCase,
} from '../lib';
import { _expectTests } from './__helpers';

//_uuid
describe('\n  _uuid: () => string', () => {
	test('generate UUID string of length 36 (i.e. "f552c9f9-1cdb-45f7-8dff-dca0c363e0fb") ---> true', () => {
		expect(_uuid().length).toBe(36);
	});
});

//_uid
describe('\n  _uid: (length: number) => string', () => {
	test('generate random string of length 20 (e.g., "d9desfufpoykmdho6ed9") ---> true', () => {
		expect(_uid(20).length).toBe(20);
	});
});

//_string
describe('\n  _string: (value: any, _default?: string) => string', () => {
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
			expected: '[1,2]',
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
			expected: `[["one",1],["two","ii"]]`,
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

//_strNorm
describe('\n  _strNorm: (value: any) => string', () => {
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

//_toTitleCase
describe('\n  _toTitleCase: (value: any, keepCase: boolean|1|0 = false) => string', () => {
	_expectTests('_toTitleCase', _toTitleCase, [
		{
			label: 'lowercase',
			code: `'hello world'`,
			args: ['heLLo woRld'],
			expected: 'Hello World',
		},
		{
			label: 'mixed case',
			code: `'heLLo woRld'`,
			args: ['heLLo woRld'],
			expected: 'Hello World',
		},
		{
			label: 'joined by "-"',
			code: `'hello-world'`,
			args: ['hello-world'],
			expected: 'Hello-world',
		},
		{
			label: 'joined by "."',
			code: `'heLLO.WORld'`,
			args: ['heLLO.WORld'],
			expected: 'Hello.world',
		},
		{
			label: 'mixed case (keepCase)',
			code: `'heLLo WorLD', true`,
			args: ['heLLo WorLD', true],
			expected: 'HeLLo WorLD',
		},
	]);
});

//_toSentenceCase
describe('\n  _toSentenceCase: (value: any, keepCase: boolean|1|0 = false) => string', () => {
	_expectTests('_toSentenceCase', _toSentenceCase, [
		{
			label: 'lowercase',
			code: `'hello world. this is a test.'`,
			args: ['hello world. this is a test.'],
			expected: 'Hello world. This is a test.',
		},
		{
			label: 'mixed case',
			code: `'hello world. This IS A test.'`,
			args: ['hello world. This IS A test.'],
			expected: 'Hello world. This is a test.',
		},
		{
			label: 'mixed case (keepCase)',
			code: `'hello world. This IS A test.', true`,
			args: ['hello world. This IS A test.', true],
			expected: 'Hello world. This IS A test.',
		},
		{
			label: 'joined/comma separated',
			code: `'heLLo-WORld, This IS A test.'`,
			args: ['heLLo-WORld, This IS A test.'],
			expected: 'Hello-world, this is a test.',
		},
		{
			label: 'line separated',
			code: `'heLLo WORld.\nthis IS A test.'`,
			args: ['heLLo WORld.\nthis IS A test.'],
			expected: 'Hello world.\nThis is a test.',
		},
		{
			label: 'comma/line separated',
			code: `'heLLo WORld,\nthis IS A test.'`,
			args: ['heLLo WORld,\nthis IS A test.'],
			expected: 'Hello world,\nthis is a test.',
		},
	]);
});

//_toSnakeCase
describe(`\n  _toSnakeCase: (value: any, trimTrailing: boolean|'l'|'left'|'r'|'right' = false) => string`, () => {
	_expectTests('_toSnakeCase', _toSnakeCase, [
		{
			label: 'special characters',
			code: `'Hello*world.'`,
			args: ['Hello*world.'],
			expected: 'hello_world_',
		},
		{
			label: 'CamelCase all caps',
			code: `'CamelCase allCAPS'`,
			args: ['CamelCase allCAPS'],
			expected: 'camel_case_all_caps',
		},
		{
			label: 'StudlyCase',
			code: `'Test StudlyCase'`,
			args: ['Test HelloWorld'],
			expected: 'test_hello_world',
		},
		{
			label: 'slug-case',
			code: `'hello-world'`,
			args: ['hello-world'],
			expected: 'hello_world',
		},
		{
			label: 'line break/whitespace',
			code: `'\t hello,\n world\t '`,
			args: ['\t hello,\n world\t '],
			expected: 'hello_world',
		},
		{
			label: 'mixed',
			code: `'hello - 123 world'`,
			args: ['hello - 123 world'],
			expected: 'hello_123_world',
		},
		{
			label: 'mixed/trim',
			code: `'__\nhello__ '`,
			args: ['__\nhello__ '],
			expected: '_hello_',
		},
		{
			label: 'spaced',
			code: `' world '`,
			args: [' world '],
			expected: 'world',
		},
		{
			label: 'mixed/accents normalized',
			code: `' -_-Hello Amélie-_- '`,
			args: [' -_-Hello Amélie-_- '],
			expected: '_hello_amelie_',
		},
		{
			label: 'boolean',
			code: `true`,
			args: [true],
			expected: 'true',
		},
		{
			label: 'float',
			code: `420.69`,
			args: [420.69],
			expected: '420_69',
		},
		{
			label: 'dash',
			code: `'---'`,
			args: ['---'],
			expected: '',
		},
		{
			label: 'underscore',
			code: `'___'`,
			args: ['___'],
			expected: '',
		},
		{
			label: 'whitespace',
			code: `' \t\r\n\t  '`,
			args: [' \t\r\n\t  '],
			expected: '',
		},
		{
			label: 'null',
			code: `null`,
			args: [null],
			expected: '',
		},
		{
			label: 'undefined',
			code: `undefined`,
			args: [undefined],
			expected: '',
		},
		{
			label: 'mixed/trim (trimTrailing=true)',
			code: `'__\nhello__ ', true`,
			args: ['__\nhello__ ', true],
			expected: 'hello',
		},
		{
			label: 'mixed/accents normalized (trimTrailing=true)',
			code: `' -_-Hello Amélie-_- ', true`,
			args: [' -_-Hello Amélie-_- ', true],
			expected: 'hello_amelie',
		},
		{
			label: 'mixed/trim (trimTrailing="right")',
			code: `'__\nhello__ ', 'right'`,
			args: ['__\nhello__ ', 'right'],
			expected: '_hello',
		},
		{
			label: 'mixed/accents normalized (trimTrailing="right")',
			code: `' -_-Hello Amélie-_- ', 'right'`,
			args: [' -_-Hello Amélie-_- ', 'right'],
			expected: '_hello_amelie',
		},
		{
			label: 'mixed/trim (trimTrailing="left")',
			code: `'__\nhello__ ', 'left'`,
			args: ['__\nhello__ ', 'left'],
			expected: 'hello_',
		},
		{
			label: 'mixed/accents normalized (trimTrailing="left")',
			code: `' -_-Hello Amélie-_- ', 'left'`,
			args: [' -_-Hello Amélie-_- ', 'left'],
			expected: 'hello_amelie_',
		},
	]);
});

//_toSlugCase
describe(`\n  _toSlugCase: (value: any, trimTrailing: boolean|'l'|'left'|'r'|'right' = false) => string`, () => {
	_expectTests('_toSlugCase', _toSlugCase, [
		{
			label: 'special characters',
			code: `'Hello*world.'`,
			args: ['Hello*world.'],
			expected: 'hello-world-',
		},
		{
			label: 'CamelCase all caps',
			code: `'CamelCase allCAPS'`,
			args: ['CamelCase allCAPS'],
			expected: 'camel-case-all-caps',
		},
		{
			label: 'StudlyCase',
			code: `'Test StudlyCase'`,
			args: ['Test HelloWorld'],
			expected: 'test-hello-world',
		},
		{
			label: 'snake-case',
			code: `'hello_world'`,
			args: ['hello_world'],
			expected: 'hello-world',
		},
		{
			label: 'line break/whitespace',
			code: `'\t hello,\n world\t '`,
			args: ['\t hello,\n world\t '],
			expected: 'hello-world',
		},
		{
			label: 'mixed',
			code: `'hello - 123 world'`,
			args: ['hello - 123 world'],
			expected: 'hello-123-world',
		},
		{
			label: 'mixed/trim',
			code: `'--\nhello-- '`,
			args: ['--\nhello-- '],
			expected: '-hello-',
		},
		{
			label: 'spaced',
			code: `' world '`,
			args: [' world '],
			expected: 'world',
		},
		{
			label: 'mixed/accents normalized',
			code: `' -_-Hello Amélie-_- '`,
			args: [' -_-Hello Amélie-_- '],
			expected: '-hello-amelie-',
		},
		{
			label: 'boolean',
			code: `true`,
			args: [true],
			expected: 'true',
		},
		{
			label: 'float',
			code: `420.69`,
			args: [420.69],
			expected: '420-69',
		},
		{
			label: 'dash',
			code: `'---'`,
			args: ['---'],
			expected: '',
		},
		{
			label: 'underscore',
			code: `'___'`,
			args: ['___'],
			expected: '',
		},
		{
			label: 'whitespace',
			code: `' \t\r\n\t  '`,
			args: [' \t\r\n\t  '],
			expected: '',
		},
		{
			label: 'null',
			code: `null`,
			args: [null],
			expected: '',
		},
		{
			label: 'undefined',
			code: `undefined`,
			args: [undefined],
			expected: '',
		},
		{
			label: 'mixed/trim (trimTrailing=true)',
			code: `'--\nhello-- ', true`,
			args: ['--\nhello-- ', true],
			expected: 'hello',
		},
		{
			label: 'mixed/accents normalized (trimTrailing=true)',
			code: `' -_-Hello Amélie-_- ', true`,
			args: [' -_-Hello Amélie-_- ', true],
			expected: 'hello-amelie',
		},
		{
			label: 'mixed/trim (trimTrailing="right")',
			code: `'--\nhello-- ', 'right'`,
			args: ['--\nhello-- ', 'right'],
			expected: '-hello',
		},
		{
			label: 'mixed/accents normalized (trimTrailing="right")',
			code: `' -_-Hello Amélie-_- ', 'right'`,
			args: [' -_-Hello Amélie-_- ', 'right'],
			expected: '-hello-amelie',
		},
		{
			label: 'mixed/trim (trimTrailing="left")',
			code: `'--\nhello-- ', 'left'`,
			args: ['--\nhello-- ', 'left'],
			expected: 'hello-',
		},
		{
			label: 'mixed/accents normalized (trimTrailing="left")',
			code: `' -_-Hello Amélie-_- ', 'left'`,
			args: [' -_-Hello Amélie-_- ', 'left'],
			expected: 'hello-amelie-',
		},
	]);
});

//_toStudlyCase
describe('\n  _toStudlyCase: (value: any) => string', () => {
	_expectTests('_toStudlyCase', _toStudlyCase, [
		{
			label: 'special characters',
			code: `'Hello*world.'`,
			args: ['Hello*world.'],
			expected: 'HelloWorld',
		},
		{
			label: 'CamelCase all caps',
			code: `'CamelCase allCAPS'`,
			args: ['CamelCase allCAPS'],
			expected: 'CamelCaseAllCaps',
		},
		{
			label: 'StudlyCase',
			code: `'Test StudlyCase'`,
			args: ['Test HelloWorld'],
			expected: 'TestHelloWorld',
		},
		{
			label: 'snake-case',
			code: `'hello_world'`,
			args: ['hello_world'],
			expected: 'HelloWorld',
		},
		{
			label: 'line break/whitespace',
			code: `'\t hello,\n world\t '`,
			args: ['\t hello,\n world\t '],
			expected: 'HelloWorld',
		},
		{
			label: 'mixed',
			code: `'hello - 123 world'`,
			args: ['hello - 123 world'],
			expected: 'Hello123World',
		},
		{
			label: 'mixed/trim',
			code: `'--\nhello-- '`,
			args: ['--\nhello-- '],
			expected: 'Hello',
		},
		{
			label: 'spaced',
			code: `' world '`,
			args: [' world '],
			expected: 'World',
		},
		{
			label: 'mixed/accents normalized',
			code: `' -_-Hello Amélie-_- '`,
			args: [' -_-Hello Amélie-_- '],
			expected: 'HelloAmelie',
		},
		{
			label: 'boolean',
			code: `true`,
			args: [true],
			expected: 'True',
		},
		{
			label: 'float',
			code: `420.69`,
			args: [420.69],
			expected: '42069',
		},
		{
			label: 'dash',
			code: `'---'`,
			args: ['---'],
			expected: '',
		},
		{
			label: 'underscore',
			code: `'___'`,
			args: ['___'],
			expected: '',
		},
		{
			label: 'whitespace',
			code: `' \t\r\n\t  '`,
			args: [' \t\r\n\t  '],
			expected: '',
		},
		{
			label: 'null',
			code: `null`,
			args: [null],
			expected: '',
		},
		{
			label: 'undefined',
			code: `undefined`,
			args: [undefined],
			expected: '',
		},
	]);
});

//_toCamelCase
describe('\n  _toCamelCase: (value: any) => string', () => {
	_expectTests('_toCamelCase', _toCamelCase, [
		{
			label: 'special characters',
			code: `'Hello*world.'`,
			args: ['Hello*world.'],
			expected: 'helloWorld',
		},
		{
			label: 'CamelCase all caps',
			code: `'CamelCase allCAPS'`,
			args: ['CamelCase allCAPS'],
			expected: 'camelCaseAllCaps',
		},
		{
			label: 'StudlyCase',
			code: `'Test StudlyCase'`,
			args: ['Test HelloWorld'],
			expected: 'testHelloWorld',
		},
		{
			label: 'snake-case',
			code: `'hello_world'`,
			args: ['hello_world'],
			expected: 'helloWorld',
		},
		{
			label: 'line break/whitespace',
			code: `'\t hello,\n world\t '`,
			args: ['\t hello,\n world\t '],
			expected: 'helloWorld',
		},
		{
			label: 'mixed',
			code: `'hello - 123 world'`,
			args: ['hello - 123 world'],
			expected: 'hello123World',
		},
		{
			label: 'mixed/trim',
			code: `'--\nhello-- '`,
			args: ['--\nhello-- '],
			expected: 'hello',
		},
		{
			label: 'spaced',
			code: `' world '`,
			args: [' world '],
			expected: 'world',
		},
		{
			label: 'mixed/accents normalized',
			code: `' -_-Hello Amélie-_- '`,
			args: [' -_-Hello Amélie-_- '],
			expected: 'helloAmelie',
		},
		{
			label: 'boolean',
			code: `true`,
			args: [true],
			expected: 'true',
		},
		{
			label: 'float',
			code: `420.69`,
			args: [420.69],
			expected: '42069',
		},
		{
			label: 'dash',
			code: `'---'`,
			args: ['---'],
			expected: '',
		},
		{
			label: 'underscore',
			code: `'___'`,
			args: ['___'],
			expected: '',
		},
		{
			label: 'whitespace',
			code: `' \t\r\n\t  '`,
			args: [' \t\r\n\t  '],
			expected: '',
		},
		{
			label: 'null',
			code: `null`,
			args: [null],
			expected: '',
		},
		{
			label: 'undefined',
			code: `undefined`,
			args: [undefined],
			expected: '',
		},
	]);
});