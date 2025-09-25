"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Term = void 0;
const utils_1 = require("../utils");
/**
 * Term log method ~ static read/write cache
 */
let TERM_FORMAT_DISABLED = false;
/**
 * Term log method ~ static read/write cache
 */
let TERM_LOG_METHOD = undefined;
/**
 * Term `console.*` logger
 */
class Term {
    /**
     * Format disabled
     */
    static get FORMAT_DISABLED() {
        return TERM_FORMAT_DISABLED;
    }
    static set FORMAT_DISABLED(value) {
        TERM_FORMAT_DISABLED = (0, utils_1._bool)(value, true) ?? false;
    }
    /**
     * Console log methods
     */
    static get LOG_METHODS() {
        return ['log', 'debug', 'warn', 'error', 'info'];
    }
    /**
     * Preferred console log method
     */
    static get LOG_METHOD() {
        return TERM_LOG_METHOD;
    }
    static set LOG_METHOD(value) {
        TERM_LOG_METHOD = this.LOG_METHODS.includes(value) ? value : undefined;
    }
    /**
     * Text formats
     */
    static get FORMATS() {
        return {
            reset: '\x1b[0m',
            bright: '\x1b[1m',
            dim: '\x1b[2m',
            underscore: '\x1b[4m',
            blink: '\x1b[5m',
            reverse: '\x1b[7m',
            hidden: '\x1b[8m',
            fg_black: '\x1b[30m',
            fg_red: '\x1b[31m',
            fg_green: '\x1b[32m',
            fg_yellow: '\x1b[33m',
            fg_blue: '\x1b[34m',
            fg_magenta: '\x1b[35m',
            fg_cyan: '\x1b[36m',
            fg_white: '\x1b[37m',
            fg_gray: '\x1b[90m',
            bg_black: '\x1b[40m',
            bg_red: '\x1b[41m',
            bg_green: '\x1b[42m',
            bg_yellow: '\x1b[43m',
            bg_blue: '\x1b[44m',
            bg_magenta: '\x1b[45m',
            bg_cyan: '\x1b[46m',
            bg_white: '\x1b[47m',
            bg_gray: '\x1b[100m',
        };
    }
    /**
     * Predefined text formats
     */
    static get PREDEFINED_FORMATS() {
        return {
            log: 'fg_white',
            dump: ['fg_white', 'bright'],
            debug: 'fg_gray',
            error: 'fg_red',
            warn: 'fg_yellow',
            info: ['fg_cyan', 'bright'],
            success: 'fg_green',
            bg_log: ['bg_blue', 'fg_white'],
            bg_debug: ['bg_gray', 'fg_black'],
            bg_error: ['bg_red', 'fg_white'],
            bg_warn: ['bg_yellow', 'fg_black'],
            bg_info: ['bg_cyan', 'fg_black'],
            bg_success: ['bg_green', 'fg_white'],
        };
    }
    /**
     * Parse standard text formats
     *
     * @param formats - text formats
     * @returns `string[]`
     */
    static getFormats(formats) {
        const FM = this.FORMATS;
        const PF = this.PREDEFINED_FORMATS;
        const _formats = Array.isArray(formats) ? formats : 'string' === typeof formats ? [formats] : [];
        return _formats.reduce((prev, val) => {
            if ((val = val.trim().toLowerCase()) && val !== 'reset') {
                let tmp = val = val.replace(/[^a-z0-9]/ig, '_').replace('grey', 'gray');
                const _addPF = (k) => {
                    const v = PF[k];
                    if (Array.isArray(v))
                        prev.push(...v);
                    else if ('string' === typeof v)
                        prev.push(v);
                };
                if (FM.hasOwnProperty(val))
                    prev.push(val);
                else if (FM.hasOwnProperty(tmp = `fg_${val}`))
                    prev.push(tmp);
                else if (PF.hasOwnProperty(val))
                    _addPF(val);
                else if (PF.hasOwnProperty(tmp = `bg_${val}`))
                    _addPF(tmp);
            }
            return prev;
        }, []);
    }
    /**
     * Format text items
     *
     * @param formats - text formats
     * @param args - parse items (arguments)
     * @returns `ITermFormat`
     */
    static format(formats, ...args) {
        //-- fn => format helpers
        let tmp;
        const _formats = this.getFormats(formats);
        const _format = (val) => {
            if (this.FORMAT_DISABLED || !formats.length)
                return val;
            if ('object' === typeof val && val) {
                if (Array.isArray(val))
                    return val;
                if (new RegExp('\\[object \\w+\\\]').test(tmp = (0, utils_1._string)(val)))
                    return val;
                else
                    val = tmp;
            }
            if (!('string' === typeof val && val.length))
                return val;
            return _formats.reduce((v, f) => this.FORMATS[f] + v + this.FORMATS.reset, val);
        };
        const that = this, values = [];
        for (const val of (Array.isArray(args) ? args : []))
            values.push(_format(val));
        let log_method = that.LOG_METHOD;
        const _method = (name) => {
            if (log_method)
                return log_method;
            return that.LOG_METHODS.includes(name) ? name : 'log';
        };
        //<< result -  ITermFormat
        return {
            /**
             * Set preferred log method
             */
            method(value) {
                log_method = that.LOG_METHODS.includes(value) ? value : that.LOG_METHOD;
                return this;
            },
            /**
             * Add formatted values
             *
             * @param formats
             * @param args
             */
            format(formats, ...args) {
                values.push(...that.format(formats, ...args).values());
                return this;
            },
            /**
             * Get formatted values
             *
             * @param args
             */
            values(...args) {
                const items = [];
                if (Array.isArray(args) && args.length) {
                    for (const val of args)
                        items.push(_format(val));
                }
                return [...values, ...items];
            },
            /**
             * Get values without formatting
             *
             * @param args
             */
            clean(...args) {
                return that.clean(...[...values, ...args]);
            },
            /**
             * `console.log` formatted values
             *
             * @param args
             */
            log(...args) {
                const items = [];
                if (Array.isArray(args) && args.length) {
                    for (const val of args)
                        items.push(_format(val));
                }
                console[_method('log')](...[...values, ...items]);
            },
            /**
             * `console.debug` formatted values
             *
             * @param args
             */
            debug(...args) {
                const items = [];
                if (Array.isArray(args) && args.length) {
                    for (const val of args)
                        items.push(_format(val));
                }
                console[_method('debug')](...[...values, ...items]);
            },
            /**
             * `console.warn` formatted values
             *
             * @param args
             */
            warn(...args) {
                const items = [];
                if (Array.isArray(args) && args.length) {
                    for (const val of args)
                        items.push(_format(val));
                }
                console[_method('warn')](...[...values, ...items]);
            },
            /**
             * `console.error` formatted values
             *
             * @param args
             */
            error(...args) {
                const items = [];
                if (Array.isArray(args) && args.length) {
                    for (const val of args)
                        items.push(_format(val));
                }
                console[_method('error')](...[...values, ...items]);
            },
            /**
             * `console.info` formatted values
             *
             * @param args
             */
            info(...args) {
                const items = [];
                if (Array.isArray(args) && args.length) {
                    for (const val of args)
                        items.push(_format(val));
                }
                console[_method('info')](...[...values, ...items]);
            },
        };
    }
    /**
     * Clean/remove text formatting
     *
     * @param args - parse items (arguments)
     * @returns `any[]`
     */
    static clean(...args) {
        const _clean = (val) => Object.values(this.FORMATS).reduce((p, v) => p.replace(new RegExp(String(v).replace(/\x1B/, '\\x1B').replace(/\[/, '\\['), 'g'), ''), val);
        const values = [];
        for (const val of args)
            values.push('string' === typeof val && val.trim().length ? _clean(val) : val);
        return values;
    }
    /**
     * Format text
     *
     * @param value - format text
     * @param formats - text formats
     * @returns `string`
     */
    static text(value, formats) {
        const _val = (0, utils_1._string)(value);
        const _formats = [], _formats_list = (Array.isArray(formats) ? formats : 'string' === typeof formats ? [formats] : []);
        for (const v of _formats_list) {
            if ('string' === typeof v && !!v.trim())
                _formats.push(v);
        }
        if (!(_formats.length && _val.trim().length))
            return _val;
        return this.format(_formats, _val).values()[0];
    }
    /**
     * Print line ~ `console.log(' ')`
     */
    static br() {
        console.log(' ');
    }
    /**
     * Print log ~ `console.log(..)`
     *
     * @param args - log arguments
     */
    static log(...args) {
        this.format('log', ...args).log();
    }
    /**
     * Print debug ~ `console.debug(..)`
     *
     * @param args - log arguments
     */
    static debug(...args) {
        this.format('debug', ...args).debug();
    }
    /**
     * Print error ~ `console.error(..)`
     *
     * @param args - log arguments
     */
    static error(...args) {
        this.format('error', ...args).error();
    }
    /**
     * Print warning ~ `console.warn(..)`
     *
     * @param args - log arguments
     */
    static warn(...args) {
        this.format('warn', ...args).warn();
    }
    /**
     * Print info ~ `console.info(..)`
     *
     * @param args - log arguments
     */
    static info(...args) {
        this.format('info', ...args).info();
    }
    /**
     * Print success ~ `console.log('..')`
     *
     * @param args - log arguments
     */
    static success(...args) {
        this.format('success', ...args).log();
    }
    /**
     * Parse list items
     *
     * @param value - parse value
     * @param _entries - (default: `false`) whether to parse entries ~ `Object.entries(value)`
     * @returns `[list: any[], type:'values'|'entries']`
     */
    static list(value, _entries = false) {
        let items = [value = (0, utils_1._clone)(value)], type = 'values';
        if ('object' === typeof value && value) {
            if (!(type = value[Symbol.iterator]?.name)) {
                type = 'values';
                items = [value];
                if (_entries && (0, utils_1._stringable)(value) === false) {
                    let tmp = Object.fromEntries(Object.entries(value));
                    let tmp_entries = [];
                    if (!('object' === typeof tmp && tmp && (tmp_entries = Object.entries(tmp)).length))
                        tmp_entries = Object.entries(value);
                    if (tmp_entries.length) {
                        type = 'entries';
                        items = tmp_entries;
                    }
                }
            }
            else if (type === 'entries')
                items = _entries ? [...value] : [value];
            else
                items = [...value];
        }
        return [items, type];
    }
    /**
     * ### Print table ~ `console.table`
     *
     * _uses process argument options as default values for params:_
     * - `cellMaxLength` = `--cellMaxLength=##` (where `##` is positive integer)
     * - `divider` = `--divider` | `--divider=false`
     * - `noIndex` = `--noIndex` | `--noIndex=false`
     * - `numIndex` = `--numIndex` | `--numIndex=false`
     *
     * @param data - log data
     * @param cellMaxLength - `--cellMaxLength=250` table max cell length (width)  (default: `250`)
     * @param divider - `--divider` whether to add row divider (default: `false`)
     * @param noIndex - `--noIndex` whether to remove index column ([#]) (default: `false`)
     * @param numIndex - `--numIndex` whether index column starts from `1` (default: `false`)
     * @param rows2cols - `--rows2cols` whether to display rows as columns (default: `false`)
     */
    static table(data, cellMaxLength, divider, noIndex, numIndex, rows2cols) {
        // args
        let args_cellMaxLength = undefined;
        let args_divider = undefined;
        let args_noIndex = undefined;
        let args_numIndex = undefined;
        let args_rows2cols = undefined;
        const args_text = typeof process !== 'undefined' && Array.isArray(process?.argv) ? process.argv.slice(2).join('|') : '';
        let args_match = args_text.match(/--cellMaxLength=(\d+)(\||$)/);
        if (args_match)
            args_cellMaxLength = (0, utils_1._posInt)(args_match[1], 0);
        if (!!(args_match = args_text.match(/--divider(\||$)/)))
            args_divider = true;
        else if (!!(args_match = args_text.match(/--divider=false(\||$)/)))
            args_divider = false;
        if (!!(args_match = args_text.match(/--noIndex(\||$)/)))
            args_noIndex = true;
        else if (!!(args_match = args_text.match(/--noIndex=false(\||$)/)))
            args_noIndex = false;
        if (!!(args_match = args_text.match(/--numIndex(\||$)/)))
            args_numIndex = true;
        else if (!!(args_match = args_text.match(/--numIndex=false(\||$)/)))
            args_numIndex = false;
        if (!!(args_match = args_text.match(/--rows2cols(\||$)/)))
            args_rows2cols = true;
        else if (!!(args_match = args_text.match(/--rows2cols=false(\||$)/)))
            args_rows2cols = false;
        cellMaxLength = args_cellMaxLength ?? (0, utils_1._posInt)(cellMaxLength, 0) ?? 250;
        divider = args_divider ?? divider ?? false;
        noIndex = args_noIndex ?? noIndex ?? false;
        numIndex = args_numIndex ?? numIndex ?? false;
        rows2cols = args_rows2cols ?? rows2cols ?? false;
        // vars
        const that = this;
        if (Object(data) === data && !(0, utils_1._isArray)(data))
            data = [data];
        const [data_items, data_type] = that.list(data, 'object' === typeof data && data && !(0, utils_1._stringable)(data));
        // fn => str value
        const strVal = (val) => {
            let color, tmp;
            if (!Array.isArray(val) && (tmp = (0, utils_1._stringable)(val)) !== false) {
                color = 'green';
                if ('number' === typeof val)
                    color = 'yellow';
                else if (val === undefined || val === null)
                    color = 'gray';
                else if (val === true)
                    color = 'cyan';
                else if (val === false)
                    color = 'red';
                else if (/^\d{4}-(?:0[1-9]|1[0-2])-(?:[0-2][1-9]|[1-3]0|3[01])T(?:[0-1][0-9]|2[0-3])(?::[0-6]\d)(?::[0-6]\d)?(?:\.\d{3})?(?:[+-][0-2]\d:[0-5]\d|Z)?$/.test(tmp))
                    color = 'magenta'; //match ISO timestamp (i.e. 2023-06-09T18:18:57.070Z)
                val = tmp;
            }
            else {
                if ('object' === typeof val && val) {
                    const _type = val[Symbol.iterator];
                    if (!!_type) {
                        val = [...val];
                        if (_type === 'entries')
                            val = Object.fromEntries(val);
                    }
                    else
                        val = Object.fromEntries(Object.entries(val));
                }
                val = (0, utils_1._jsonStringify)(val);
                color = 'magenta';
            }
            val = val.replace(/\t/g, '  ');
            const _val = (0, utils_1._strEscape)(val)
                .replace(/(\\n)+/g, '\n').trim(); //++ multiline support
            return [_val, color];
        };
        // table items
        let mode = undefined;
        const table_items = [];
        if (data_type === 'entries') {
            if (!noIndex)
                data_items.unshift(['[#]', 'Values']);
            table_items.push(...data_items);
        }
        else {
            let map_keys = [], map_items = [];
            for (let r = 0; r < data_items.length; r++) {
                const data_item = data_items[r];
                let [list_items, list_type] = that.list(data_item, !r || mode === 'entries');
                if (!r)
                    mode = list_type;
                const map_item = {};
                for (let i = 0; i < list_items.length; i++) {
                    const item = list_items[i];
                    let k, v;
                    if (list_type === 'entries') {
                        k = (0, utils_1._str)(item[0], true, true);
                        v = item[1];
                    }
                    else {
                        k = `${i}`;
                        v = item;
                    }
                    if (!map_keys.includes(k))
                        map_keys.push(k);
                    map_item[k] = v;
                }
                map_items.push(map_item);
            }
            const has_index = !noIndex && !(map_keys.length === 1 && map_keys[0] === '0');
            if (has_index)
                table_items.push(['[#]', ...map_keys]);
            for (let r = 0; r < map_items.length; r++) {
                const table_item = [], map_item = map_items[r];
                for (const key of map_keys)
                    table_item.push(map_item[key]);
                table_items.push([...(has_index ? [r + (numIndex ? 1 : 0)] : []), ...table_item]);
            }
        }
        // rows2cols
        const table_rows = rows2cols ? (0, utils_1._rows2cols)(table_items) : table_items;
        // width
        const width_map = {};
        const str_items = [];
        for (const table_item of table_rows) {
            const str_item = [];
            for (let i = 0; i < table_item.length; i++) {
                const val = table_item[i];
                const [_value, _format] = strVal(val);
                if (!width_map.hasOwnProperty(i))
                    width_map[i] = 0;
                let width = 0; // ++ multiline support
                for (const txt of _value.split('\n')) { // ++ multiline support
                    let len = txt.length;
                    if (cellMaxLength && len > cellMaxLength)
                        len = cellMaxLength; // cellMaxLength limit
                    if (len > width)
                        width = len;
                }
                if (width > width_map[i])
                    width_map[i] = width; // ++ multiline support
                str_item.push([_value, _format]);
            }
            str_items.push(str_item);
        }
        // rows
        const rows_len = str_items.length;
        for (let r = 0; r < str_items.length; r++) {
            const str_item = str_items[r];
            let max_lines = 0;
            let str_item_lines = [];
            for (let i = 0; i < str_item.length; i++) {
                let [_value, _format] = str_item[i];
                if (!i || !r && !noIndex)
                    _format = (!i && r && mode === 'values') ? 'gray' : 'white';
                const width = width_map[i];
                const lines = [];
                for (let txt of _value.split('\n')) { //++ multiline support
                    if (txt.length > width) {
                        while (txt.length > width) {
                            const line = txt.substring(0, width).padEnd(width);
                            txt = txt.slice(width);
                            lines.push(that.text(line, _format)); //format
                        }
                        if (txt.length)
                            lines.push(that.text(txt.padEnd(width), _format)); //format
                    }
                    else
                        lines.push(that.text(txt.padEnd(width), _format)); //format
                }
                str_item_lines.push(lines);
                if (max_lines < lines.length)
                    max_lines = lines.length;
            }
            const max_str_item_lines = [];
            for (let c = 0; c < str_item_lines.length; c++) {
                const lines = str_item_lines[c];
                const width = width_map[c];
                const str_max_lines = [];
                const max_lines_array = [...Array(max_lines)];
                for (let i = 0; i < max_lines_array.length; i++)
                    str_max_lines.push(i < lines.length ? lines[i] : ''.padEnd(width));
                max_str_item_lines.push(str_max_lines);
            }
            str_item_lines = max_str_item_lines;
            const line_rows = [];
            for (const _ of [...Array(max_lines)])
                line_rows.push([]);
            for (let c = 0; c < str_item_lines.length; c++) {
                const lines = str_item_lines[c];
                for (let i = 0; i < lines.length; i++) {
                    line_rows[i][c] = lines[i];
                }
            }
            const rows = [];
            const len = line_rows.length;
            const lines_top = [
                { line: '─', left: '┌─', mid: '─┬─', right: '─┐' },
                { line: '═', left: '╔═', mid: '═╦═', right: '═╗' },
                { line: '─', left: '╓─', mid: '═╤═', right: '─╖' },
            ];
            const lines_mid = [
                { line: '─', left: '├─', mid: '─┼─', right: '─┤' },
                { line: '═', left: '╠═', mid: '═╬═', right: '═╣' },
                { line: '─', left: '╟─', mid: '─╫─', right: '─╢' },
                { line: '─', left: '├─', mid: '─┼─', right: '─┤' },
            ];
            const lines_bottom = [
                { line: '─', left: '└─', mid: '─┴─', right: '─┘' },
                { line: '═', left: '╚═', mid: '═╩═', right: '═╝' },
            ];
            const lines_side = [
                { left: '│ ', mid: ' │ ', right: ' │' },
                { left: '║ ', mid: ' ║ ', right: ' ║' },
            ];
            //TODO: border modes
            const borderMode = 0;
            //REF: https://cboard.cprogramming.com/c-programming/151930-ascii-table-border.html
            // BOX_DLR     ═
            // BOX_DUD     ║
            // BOX_DUL     ╝
            // BOX_DUR     ╚
            // BOX_DDL     ╗
            // BOX_DDR     ╔
            // BOX_DUDL    ╣
            // BOX_DUDR    ╠
            // BOX_DULR    ╩
            // BOX_DDLR    ╦
            // BOX_DUDLR   ╬
            // BOX_DU_SL   ╜
            // BOX_DU_SR   ╙
            // BOX_DD_SL   ╖
            // BOX_DD_SR   ╓
            // BOX_DL_SU   ╛
            // BOX_DL_SD   ╕
            // BOX_DR_SU   ╘
            // BOX_DR_SD   ╒
            // BOX_DU_SLR  ╨
            // BOX_DD_SLR  ╥
            // BOX_DL_SUD  ╡
            // BOX_DR_SUD  ╞
            // BOX_DLR_SU  ╧
            // BOX_DLR_SD  ╤
            // BOX_DLR_SUD ╪
            // BOX_DUD_SL  ╢
            // BOX_DUD_SR  ╟
            // BOX_DUD_SLR ╫
            // BOX_SLR     ─
            // BOX_SUD     │
            // BOX_SUL     ┘
            // BOX_SUR     └
            // BOX_SDL     ┐
            // BOX_SDR     ┌
            // BOX_SULR    ┴
            // BOX_SDLR    ┬
            // BOX_SUDL    ┤
            // BOX_SUDR    ├
            // BOX_SUDLR   ┼
            //-- table borders
            for (let n = 0; n < line_rows.length; n++) {
                const line_row = line_rows[n];
                let b, bm = borderMode === 0 ? 0 : 1;
                //-- border top
                b = lines_top[bm];
                if (!n && !r) {
                    let border_top = b.left;
                    for (let i = 0; i < line_row.length; i++) {
                        border_top += (i ? b.mid : '') + ''.padEnd(width_map[i], b.line);
                    }
                    border_top += b.right;
                    rows.push(border_top);
                }
                //-- border side
                b = lines_side[bm];
                rows.push(b.left + line_row.join(b.mid) + b.right);
                //-- border mid
                b = lines_mid[bm];
                if ((!r && !noIndex || divider) && n + 1 === len && r + 1 < rows_len) {
                    let border_mid = b.left;
                    for (let i = 0; i < line_row.length; i++) {
                        border_mid += (i ? b.mid : '') + ''.padEnd(width_map[i], b.line);
                    }
                    border_mid += b.right;
                    rows.push(border_mid);
                }
                //-- border bottom
                b = lines_bottom[bm];
                if (n + 1 === len && r + 1 === rows_len) {
                    let border_bottom = b.left;
                    for (let i = 0; i < line_row.length; i++) {
                        border_bottom += (i ? b.mid : '') + ''.padEnd(width_map[i], b.line);
                    }
                    border_bottom += b.right;
                    rows.push(border_bottom);
                }
            }
            console.log(rows.join('\n')); //<< print table
        }
    }
    /**
     * Console clear logs
     */
    static get clear() {
        return function () {
            console.log('\x1Bc');
            console.clear();
        };
    }
}
exports.Term = Term;
// TODO: Term.table - invert, no columns, auto-resize, table-wrap, return text
// TODO: Term before-log-callback
// TODO: Term test scripts
//# sourceMappingURL=_Term.js.map