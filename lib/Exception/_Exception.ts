/**
 * Exception error interface
 */
export interface IExceptionError {
	
	/** 
	 * Error message (default: `'Unspecified exception message.'`)
	 */
	message: string;
	
	/** 
	 * Error name (default: `'Exception'`)
	 */
	name: string;
	
	/** 
	 * Error code - finite/parsed `integer` (default: `0`)
	 */
	code: number;
	
	/**
	 * Get error string
	 * 
	 * @returns `{name}: {message}` | `{name}[{code}]: {message}`
	 */
	toString: () => string;
}

/**
 * `Symbol` private props key name
 */
const PRIVATE = Symbol(`__private_props_${Date.now()}__`);

/**
 * `Exception` extends `Error` ~ like `DOMException`
 * 
 * - message: `string`
 * - name: `string`
 * - code: `number`
 * - toString: `()=>string`
 */
export class Exception extends Error implements IExceptionError
{
	/**
	 * Private props
	 */
	[PRIVATE]: {
		message: string;
		name: string;
		code: number;
	} = {} as any;
	
	/**
	 * Error message (default: `'Unspecified exception message.'`)
	 */
	get message(): string {
		return this[PRIVATE].message;
	}

	/**
	 * Error name (default: `'Exception'`)
	 */
	get name(): string {
		return this[PRIVATE].name;
	}

	/**
	 * Error code - finite/parsed `integer` (default: `0`)
	 */
	get code(): number {
		return this[PRIVATE].code;
	}

	/**
	 * New `IExceptionError` instance
	 * 
	 * @param message  Error message (default: `'Unspecified exception message.'`)
	 * @param name  Error name (default: `'Exception'`)
	 * @param code  Error code - finite/parsed `integer` (default: `0`)
	 */
	constructor(message?: string, name?: string, code?: number){
		super(message = message && 'string' === typeof message && (message = message.trim()) ? message : 'Unspecified exception message.');
		this[PRIVATE] = {
			message,
			name: name && 'string' === typeof name && (name = name.trim()) ? name : 'Exception',
			code: code && 'number' === typeof code && !isNaN(code = parseInt(`${code}`)) && Number.isInteger(code) && Number.isFinite(code) ? code : 0,
		};
	}
	
	/**
	 * Get error `string`
	 */
	toString(): string {
		const {message, name, code} = this;
		return `${name}${code !== 0 ? `[${code}]` : ''}: ${message}`;
	}

	/**
	 * Create new `IExceptionError` instance
	 * 
	 * @param message  Error message (default: `'Unspecified exception message.'`)
	 * @param name  Error name (default: `'Exception'`)
	 * @param code  Error code - finite/parsed `integer` (default: `0`)
	 */
	static error(message?: string, name?: string, code?: number): IExceptionError {
		return new Exception(message, name, code);
	}
}