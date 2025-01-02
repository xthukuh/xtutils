import {
	Buffer,
	_isBuffer,
	_isBufferType,
	_isBufferEncoding,
	_base64Encode,
	_base64Decode,
} from '../lib';

// lib/Buffer/_Buffer.ts
describe('\n _isBuffer', () => {
	it('should return `true` when argument value is a `Buffer` instance.', () => {
		const buffer = Buffer.from('Hello world!');
		expect(_isBuffer(buffer)).toBe(true);
	});

	it('should return `false` when argument value is not a `Buffer` instance', () => {
		const value = 'Hello world!';
		expect(_isBuffer(value)).toBe(false);
	});
});

describe('\n _isBufferType', () => {
	
	// suppress console.error
	let orig_console_error: typeof console.error;
	beforeEach(() => {
		orig_console_error = console.error;
		console.error = jest.fn();
	});
	afterEach(() => {
		console.error = orig_console_error;
	});

	// tests
	it('should return `true` when value can be parsed to `Buffer`', () => {
		expect(_isBufferType('Hello world!')).toBe(true);
		expect(_isBufferType(Buffer.from('Hello world!'))).toBe(true);
		expect(_isBufferType(Buffer.alloc(10))).toBe(true);
		expect(_isBufferType([0, 1, 'x'])).toBe(true);
		expect(_isBufferType(new Uint8Array([0, 1, 2]))).toBe(true);
	});

	it('should return `false` when value cannot be parsed to `Buffer`', () => {
		expect(_isBufferType(null)).toBe(false);
		expect(_isBufferType(undefined)).toBe(false);
		expect(_isBufferType({})).toBe(false);
		expect(_isBufferType(new Set())).toBe(false);
	});
});

describe('\n _isBufferType', () => {
	it('should return `true` when value is a valid `Buffer` encoding', () => {
		expect(_isBufferEncoding('utf8')).toBe(true);
		expect(_isBufferEncoding('utf-8')).toBe(true);
		expect(_isBufferEncoding('ascii')).toBe(true);
		expect(_isBufferEncoding('latin1')).toBe(true);
		expect(_isBufferEncoding('binary')).toBe(true);
		expect(_isBufferEncoding('base64')).toBe(true);
		expect(_isBufferEncoding('hex')).toBe(true);
		expect(_isBufferEncoding('utf16le')).toBe(true);
	});

	it('should return `false` when value is not a valid `Buffer` encoding', () => {
		expect(_isBufferEncoding('')).toBe(false);
		expect(_isBufferEncoding('utf16')).toBe(false);
		expect(_isBufferEncoding('unknown')).toBe(false);
		expect(_isBufferEncoding('invalid')).toBe(false);
	});
});

describe('\n _base64Encode', () => {
	
	it('should return base64 encoded string', () => {
		expect(_base64Encode('')).toBe('');
		expect(_base64Encode('Hello world!')).toBe('SGVsbG8gd29ybGQh');
		expect(_base64Encode(Buffer.from('Hello world!'))).toBe('SGVsbG8gd29ybGQh');
	});

	it('should return empty string if buffer argument is not a Buffer', () => {
		console.error = jest.fn();
		expect(_base64Encode(null)).toBe('');
		expect(_base64Encode(new Set())).toBe('');
		expect(console.error).toHaveBeenCalled();
	});
});

describe('\n _base64Decode', () => {
	
	// tests
	it('should return base64 decoded string', () => {
		expect(_base64Decode('')).toBe('');
		expect(_base64Decode('SGVsbG8gd29ybGQh')).toBe('Hello world!');
		expect(_base64Decode(Buffer.from('SGVsbG8gd29ybGQh'))).toBe('Hello world!');
	});

	it('should return empty string when value argument is invalid `Buffer`', () => {
		console.error = jest.fn();
		expect(_base64Decode(null)).toBe('');
		expect(_base64Decode(new Set())).toBe('');
		expect(console.error).toHaveBeenCalled();
	});
});