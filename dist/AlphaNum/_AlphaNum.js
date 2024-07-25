"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlphaNum = void 0;
/**
 * AlphaNum private props key
 */
const PROPS = Symbol('AlphaNum');
/**
 * Alphabetical integer
 *
 * @class AlphaNum
 */
class AlphaNum {
    /**
     * Alphabet characters
     */
    static get CHARS() {
        return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    /**
     * instance props
     */
    [PROPS] = { value: 0, sign: 1 };
    /**
     * `value` getter
     */
    get value() {
        return this[PROPS].value * this[PROPS].sign;
    }
    /**
     * `value` setter
     */
    set value(value) {
        const val = parseInt(Number(value)) || 0;
        this[PROPS].sign = val < 0 ? -1 : 1;
        this[PROPS].value = Math.abs(val);
    }
    /**
     * `indexes` getter
     */
    get indexes() {
        const chars = AlphaNum.CHARS, base = chars.length, buffer = [];
        let dec = this[PROPS].value;
        let n = 0;
        while (1) {
            buffer.unshift(Math.max((dec % base) - n, 0));
            if (!(dec = Math.floor(dec / base)))
                break;
            n = 1;
        }
        if (this[PROPS].sign === -1)
            buffer.unshift(-1);
        return buffer;
    }
    /**
     * `indexes` setter
     */
    set indexes(value) {
        const base = AlphaNum.CHARS.length;
        try {
            let arr = [...value];
            let len = arr.length, sign = 1, dec = 0;
            if (len) {
                if (arr[0] === -1) {
                    if (len === 1)
                        throw Error('The \`AlphaNum\` indexes array is incomplete.');
                    arr = arr.slice(1);
                    sign = -1;
                }
                for (let i = 0; i < arr.length; i++) {
                    const n = arr[i];
                    if (!(n >= 0 && n < base))
                        throw new TypeError(`The \`AlphaNum\` indexes must be an integer array of \`0-25\` values with optional -1 in 0 index. (e.g. \`[0,23]\` => \`'AX'\`|\`49\`; \`[-1,0,23]\` => \`'-AX'\`|\`-49\`)`);
                    dec = dec * base + n + 1;
                }
            }
            if (dec >= base)
                dec -= 1;
            this.value = dec * sign;
        }
        catch (error) {
            console.warn({ error, value });
            throw new TypeError(error);
        }
    }
    /**
     * `text` getter
     */
    get text() {
        const chars = AlphaNum.CHARS;
        let text = '';
        let arr = this.indexes;
        if (arr[0] === -1) {
            arr = arr.slice(1);
            if (arr.length)
                text = '-';
        }
        text += arr.map(v => chars[v]).join('');
        return text;
    }
    /**
     * New `AlphaNum` instance
     *
     * @param value - (default: `0`) initial value ~ _**absolute integer**_
     */
    constructor(value = 0) {
        this.value = value;
    }
    /**
     * Set `value`
     *
     * @param value - add value ~ _**absolute integer**_
     * @returns `AlphaNum` ~ instance
     */
    set(value) {
        this.value = value;
        return this;
    }
    /**
     * Add `value`
     *
     * @param value - (default: `1`) add value ~ _**absolute integer**_
     * @returns `AlphaNum` ~ instance
     */
    add(value = 1) {
        this.value += parseInt(Number(value)) || 0;
        return this;
    }
    /**
     * Get text value
     *
     * @returns `string`
     */
    toString() {
        return this.text;
    }
    /**
     * Parse value to `AlphaNum` instance
     * - accepts `number` ~ integers (e.g. `1999` => `'BXX'`; `-1999` => `'-BXX'`)
     * - accepts `text` `/-?[A-Z]+/` (e.g. `'BXX'` => `1999`; `'-BXX'` => `-1999`)
     * - accepts indexes `array` (e.g. `[1,23,23]` => `'BXX'`|`1999`; `[-1,1,23,23]` => `'-BXX'`|`-1999`)
     *
     * @param value - parse value _**(see method docs for acceptable values)**_
     * @returns `AlphaNum` instance
     * @throws `TypeError` on failure
     */
    static parse(value) {
        const instance = new AlphaNum();
        //parse scalars
        if (!('object' === typeof value && value)) {
            //text value
            let val = String(value ?? '').trim().toUpperCase();
            if (!val)
                return instance; //<< blank string
            //text to indexes ~ /-?[A-Z]+/
            if (/[A-Z]/.test(val)) {
                const chars = this.CHARS;
                const indexes = [];
                const arr = val.split('');
                let signed = false;
                for (let i = 0; i < arr.length; i++) {
                    const c = arr[i];
                    if (c === '-' && !i) {
                        indexes.push(-1);
                        signed = true;
                        continue;
                    }
                    const n = chars.indexOf(c);
                    if (n < 0)
                        throw new TypeError(`Invalid parse \`AlphaNum\` text value character "${c}" at ${i}`);
                    indexes.push(n);
                }
                if (signed && indexes.length === 1)
                    throw new TypeError(`Invalid parse \`AlphaNum\` text value "${val}".`);
                //+ set indexes
                instance.indexes = indexes;
            }
            else {
                //parse integer ~ /\d+/
                const int = parseInt(Number(value));
                if (isNaN(int))
                    throw new TypeError(`Unsupported parse \`AlphaNum\` value "${val}".`);
                //+ set value
                instance.value = int;
            }
        }
        else {
            //parse indexes ~ /[(-1,)?[0-25],[0-25],[0-25]]/
            try {
                //+ set indexes
                instance.indexes = value;
            }
            catch (e) {
                throw new TypeError(`Failed to parse \`AlphaNum\` object value; ${e}`);
            }
        }
        //<< result ~ `AlphaNum`
        return instance;
    }
    /**
     * Parse value to `AlphaNum` text ~ `/-?[A-Z]+/` (e.g. `49` => `'AX'`; `49` => `'-AX'`)
     *
     * @param value - parse value _**(see parse() docs)**_
     * @returns `string`
     * @throws `TypeError` on failure
     */
    static text(value) {
        return this.parse(value).text;
    }
}
exports.AlphaNum = AlphaNum;
//# sourceMappingURL=_AlphaNum.js.map