import {
	_rc4,
	_escape,
	_unescape
} from '../lib';
import { _expectTests } from './__helpers';

// _rc4
describe('\n _rc4(text: any, key?: string) => string', () => {
	const text: string = 'Hello world!', key: string = 'alohomora', escaped_rc4_encryption: string = 'wft%C6%09%CD%99%EDo%26t%BD';
	it('RC4 encrypts and decrypts text with same key.', () => {
		expect(_escape(_rc4(text, key))).toBe(escaped_rc4_encryption);
		expect(_rc4(_unescape(escaped_rc4_encryption), key)).toBe(text);
	});
	it('RC4 text cannot be decrypted with wrong key.', () => {
		expect(_rc4(_unescape(escaped_rc4_encryption), 'wrong-key') === text).toBeFalsy();
	});
	it('RC4 encrypts and decrypts text with blank key (i.e `""|null|undefined`).', () => {
		let key: string = '', escaped_rc4_encryption: string = '%B7%9Aokc.%60pZD%5Ce';
		expect(_escape(_rc4(text, key))).toBe(escaped_rc4_encryption);
		expect(_rc4(_unescape(escaped_rc4_encryption), key)).toBe(text);
	});
	it('RC4 returns blank string (i.e. `""`) when text argument is blank (i.e `""|null|undefined`).', () => {
		expect(_rc4('')).toBe('');
		expect(_rc4(null)).toBe('');
		expect(_rc4(undefined)).toBe('');
	});
});