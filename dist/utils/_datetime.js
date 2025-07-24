"use strict";
//===================================================================================
// simple date helpers - consider useful libraries: https://momentjs.com/ 
//===================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports._duration = exports._elapsed = exports.SECOND_MS = exports.MINUTE_MS = exports.HOUR_MS = exports.DAY_MS = exports.MONTH_MS = exports.YEAR_MS = exports._timestr = exports._datestr = exports._datetime = exports._dayTime = exports._dateOnly = exports._yearEnd = exports._yearStart = exports._monthEnd = exports._monthStart = exports._dayEnd = exports._dayStart = exports._monthName = exports.MONTH_NAMES = exports._dayName = exports.DAY_NAMES = exports._time = exports._date = exports._parseIso = exports._isDate = void 0;
/**
 * Validate `Date` instance
 *
 * @param value
 * @returns `boolean`
 */
const _isDate = (value) => value instanceof Date && !isNaN(value.getTime());
exports._isDate = _isDate;
/**
 * Parse ISO formatted date value to milliseconds timestamp
 * - borrowed from https://github.com/jquense/yup/blob/1ee9b21c994b4293f3ab338119dc17ab2f4e284c/src/util/parseIsoDate.ts
 *
 * @param value - ISO date `string` (i.e. `'2022-12-19T13:12:42.000+0000'`/`'2022-12-19T13:12:42.000Z'` => `1671455562000`)
 * @returns `number` milliseconds timestamp | `undefined` when invalid
 */
const _parseIso = (value) => {
    const regex = /^(\d{4}|[+-]\d{6})(?:-?(\d{2})(?:-?(\d{2}))?)?(?:[ T]?(\d{2}):?(\d{2})(?::?(\d{2})(?:[,.](\d{1,}))?)?(?:(Z)|([+-])(\d{2})(?::?(\d{2}))?)?)?$/;
    //                1 YYYY                2 MM        3 DD              4 HH     5 mm        6 ss           7 msec         8 Z 9 ±   10 tzHH    11 tzmm
    let struct, timestamp = NaN;
    try {
        value = String(value);
    }
    catch (e) {
        value = '';
    }
    if (struct = regex.exec(value)) {
        for (const k of [1, 4, 5, 6, 7, 10, 11])
            struct[k] = +struct[k] || 0; //allow undefined days and months
        struct[2] = (+struct[2] || 1) - 1;
        struct[3] = +struct[3] || 1; //allow arbitrary sub-second precision beyond milliseconds
        struct[7] = struct[7] ? String(struct[7]).substring(0, 3) : 0; //timestamps without timezone identifiers should be considered local time
        if ((struct[8] === undefined || struct[8] === '') && (struct[9] === undefined || struct[9] === '')) {
            timestamp = +new Date(struct[1], struct[2], struct[3], struct[4], struct[5], struct[6], struct[7]);
        }
        else {
            let min_offset = 0;
            if (struct[8] !== 'Z' && struct[9] !== undefined) {
                min_offset = struct[10] * 60 + struct[11];
                if (struct[9] === '+')
                    min_offset = 0 - min_offset;
            }
            timestamp = Date.UTC(struct[1], struct[2], struct[3], struct[4], struct[5] + min_offset, struct[6], struct[7]);
        }
    }
    else
        timestamp = Date.parse ? Date.parse(value) : NaN;
    return !isNaN(timestamp) ? timestamp : undefined;
};
exports._parseIso = _parseIso;
/**
 * Parse `Date` value ~ accepts valid `Date` instance, timestamp integer, datetime string (see `_strict` param docs)
 * - when `_strict === false`: `undefined` value returns `new Date()` and `null|false|true|0` = `new Date(null|false|true|0)`
 * - when `_strict === false`: `null|false|true|0` returns `new Date(value)`
 * - when `_strict === false`: `'now'|'today'|'tomorrow'|'yesterday'` return date equivalent
 *
 * - supports valid `Date` instance, `integer|string` timestamp in milliseconds and other `string` date texts
 * - when strict parsing, value must be a valid date value with more than `1` timestamp milliseconds
 * - when strict parsing is disabled, result for `undefined` = `new Date()` and `null|false|true|0` = `new Date(null|false|true|0)`
 *
 * @param value - parse date value (accepts `'now'|'today'|'tomorrow'|'yesterday'` as special values)
 * @param _strict - enable strict parsing (default: `true`)
 * @returns `Date` instance | `undefined` when invalid
 */
const _date = (value, _strict = true) => {
    if (value === undefined)
        return _strict ? undefined : new Date();
    const _parse = (val) => !isNaN(val) && (val || !_strict) ? new Date(val) : undefined;
    if ([null, false, true, 0].includes(value))
        return _parse(value);
    if (value instanceof Date)
        return _parse(value.getTime());
    if ('number' === typeof value)
        return _parse(new Date(value).getTime());
    try {
        let text = String(value).trim();
        if (!text || /\[object \w+\]/.test(text))
            return undefined;
        if (/^[+-]?\d+$/.test(text))
            return _parse(parseInt(text));
        // return _parse(Date.parse(text));
        let date = _parse(Date.parse(text));
        if (!date) {
            if (!_strict && /^(now|today|tomorrow|yesterday)$/i.test(text)) {
                const date = new Date();
                if (text.toLowerCase() === 'now')
                    return date;
                if (text.toLowerCase() === 'today')
                    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
                if (text.toLowerCase() === 'tomorrow')
                    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
                if (text.toLowerCase() === 'yesterday')
                    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
            }
            return undefined;
        }
        if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
            const date2 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            if (date2.getFullYear() !== date.getFullYear())
                date2.setFullYear(date.getFullYear());
            return date2;
        }
        return date;
    }
    catch (e) {
        console.warn('[_date] exception:', e);
        return undefined;
    }
};
exports._date = _date;
/**
 * Parsed `Date` timestamp value (i.e. `date.getTime()`)
 * - see `_date()` parsing docs
 *
 * @param value - parse date value
 * @param min - set `min` timestamp limit ~ enabled when `min` is a valid timestamp integer
 * @param max - set `max` timestamp limit ~ enabled when `max` is a valid timestamp integer
 * @param _strict - enable strict parsing (default: `true`)
 * @returns `number` timestamp in milliseconds | `undefined` when invalid
 */
const _time = (value, min, max, _strict = true) => {
    const date = (0, exports._date)(value, _strict);
    if (!date)
        return undefined;
    const time = date.getTime();
    if (!isNaN(min = parseFloat(min)) && time < min)
        return undefined;
    if (!isNaN(max = parseFloat(max)) && time > max)
        return undefined;
    return time;
};
exports._time = _time;
/**
 * Day names
 * - `('Sunday'|'Monday'|'Tuesday'|'Wednesday'|'Thursday'|'Friday'|'Saturday')[]`
 */
exports.DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
/**
 * Get day name
 *
 * @param index - (default: `0`) day index `0-6` ~ `DAY_NAMES[Math.abs(index % DAY_NAMES.length)]`
 * @returns `string` ~ `'Sunday'|'Monday'|'Tuesday'|'Wednesday'|'Thursday'|'Friday'|'Saturday'`
 */
const _dayName = (index) => {
    index = !isNaN(index = parseInt(index)) ? index : 0;
    if (index < 0)
        index = 7 - (Math.abs(index) % exports.DAY_NAMES.length);
    return exports.DAY_NAMES[Math.abs(index % exports.DAY_NAMES.length)];
};
exports._dayName = _dayName;
/**
 * Month names
 * - `('January'|'February'|'March'|'April'|'May'|'June'|'July'|'August'|'September'|'October'|'November'|'December')[]`
 */
exports.MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/**
 * Get month name
 *
 * @param index - (default: `0`) day index `0-11` ~ `MONTH_NAMES[Math.abs(index % DAY_NAMES.length)]`
 * @returns `string` ~ `'January'|'February'|'March'|'April'|'May'|'June'|'July'|'August'|'September'|'October'|'November'|'December'`
 */
const _monthName = (index) => {
    index = !isNaN(index = parseInt(index)) ? index : 0;
    if (index < 0)
        index = 12 - (Math.abs(index) % exports.MONTH_NAMES.length);
    return exports.MONTH_NAMES[Math.abs(index % exports.MONTH_NAMES.length)];
};
exports._monthName = _monthName;
/**
 * Parse `Date` day start ~ at `00:00:00 0`
 * - see `_date()` parsing docs
 *
 * @param value - parse date value ~ **_(defaults to `new Date()` when invalid)_**
 * @param _strict - enable strict datetime parsing (default: `false`)
 * @returns `Date`
 */
const _dayStart = (value, _strict = false) => {
    const date = (0, exports._date)(value, _strict) ?? new Date();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
};
exports._dayStart = _dayStart;
/**
 * Parse `Date` day end ~ at `23:59:59 999`
 * - see `_date()` parsing docs
 *
 * @param value - parse date value ~ **_(defaults to `new Date()` when invalid)_**
 * @param _strict - enable strict datetime parsing (default: `false`)
 * @returns `Date`
 */
const _dayEnd = (value, _strict = false) => {
    const date = (0, exports._date)(value, _strict) ?? new Date();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
};
exports._dayEnd = _dayEnd;
/**
 * Parse `Date` month's start day ~ at `00:00:00 0`
 * - see `_date()` parsing docs
 *
 * @param value - parse date value ~ **_(defaults to `new Date()` when invalid)_**
 * @param _strict - enable strict datetime parsing (default: `false`) ~ see `_date()`
 * @returns `Date`
 */
const _monthStart = (value, _strict = false) => {
    const date = (0, exports._date)(value, _strict) ?? new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
};
exports._monthStart = _monthStart;
/**
 * Parse `Date` month's end day ~ at `23:59:59 999`
 * - see `_date()` parsing docs
 *
 * @param value - parse date value ~ **_(defaults to `new Date()` when invalid)_**
 * @param _strict - enable strict datetime parsing (default: `false`) ~ see `_date()`
 * @returns `Date`
 */
const _monthEnd = (value, _strict = false) => {
    const date = (0, exports._date)(value, _strict) ?? new Date();
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
};
exports._monthEnd = _monthEnd;
/**
 * Parse `Date` year's start day ~ at `YYYY-01-01 00:00:00 0`
 * - see `_date()` parsing docs
 *
 * @param value - parse date value ~ **_(defaults to `new Date()` when invalid)_**
 * @param _strict - enable strict datetime parsing (default: `false`) ~ see `_date()`
 * @returns `Date`
 */
const _yearStart = (value, _strict = false) => {
    const date = (0, exports._date)(value, _strict) ?? new Date();
    return new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0);
};
exports._yearStart = _yearStart;
/**
 * Parse `Date` year's end day ~ at `YYYY-12-31 23:59:59 999`
 * - see `_date()` parsing docs
 *
 * @param value - parse date value ~ **_(defaults to `new Date()` when invalid)_**
 * @param _strict - enable strict datetime parsing (default: `false`) ~ see `_date()`
 * @returns `Date`
 */
const _yearEnd = (value, _strict = false) => {
    const date = (0, exports._date)(value, _strict) ?? new Date();
    return new Date(date.getFullYear(), 12, 0, 23, 59, 59, 999);
};
exports._yearEnd = _yearEnd;
/**
 * Parse `Date` value where only date part is considered (e.g. `'2023-05-27 22:11:57' => '1970-01-01 00:00:00'`)
 * - see `_date()` parsing docs
 *
 * @param value - parse date value ~ **_(defaults to `new Date()` when invalid)_**
 * @param _strict - enable strict datetime parsing (default: `false`) ~ see `_date()`
 * @returns `Date`
 */
const _dateOnly = (value, _strict = false) => {
    const date = (0, exports._date)(value, _strict) ?? new Date();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};
exports._dateOnly = _dateOnly;
/**
 * Parse `Date` value to day's time in milliseconds since midnight (e.g. `'2023-05-27 22:11:57' => 79917000`)
 * - see `_date()` parsing docs
 *
 * @param value - parse date value ~ **_(defaults to `new Date()` when invalid)_**
 * @param _strict - enable strict datetime parsing (default: `false`) ~ see `_date()`
 * @returns `number`
 */
const _dayTime = (value, _strict = false) => {
    const date = (0, exports._date)(value, _strict) ?? new Date();
    return date.getTime() - new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
};
exports._dayTime = _dayTime;
/**
 * Parse `Date` value to `YYYY-MM-DD HH:mm:ss` format (e.g. `'2023-05-27 22:11:57'`)
 * - see `_date()` parsing docs
 *
 * @param value - parse date value
 * @param _strict - enable strict datetime parsing (default: `false`) ~ see `_date()`
 * @returns `string` ~ `'YYYY-MM-DD HH:mm:ss'` | empty `''` when invalid
 */
const _datetime = (value, _strict = false) => {
    const date = (0, exports._date)(value, _strict);
    if (!date)
        return '';
    return String(date.getFullYear()).padStart(4, '0')
        + '-'
        + [date.getMonth() + 1, date.getDate()].map(v => String(v).padStart(2, '0')).join('-')
        + ' '
        + [date.getHours(), date.getMinutes(), date.getSeconds()].map(v => String(v).padStart(2, '0')).join(':');
};
exports._datetime = _datetime;
/**
 * Parse `Date` value to `YYYY-MM-DD` format `string` (e.g. `'2023-05-27'`)
 * - see `_date()` parsing docs
 *
 * @param value - parse date value
 * @param _strict - enable strict datetime parsing (default: `false`) ~ see `_date()`
 * @returns `string` ~ `'YYYY-MM-DD'` | empty `''` when invalid
 */
const _datestr = (value, _strict = false) => (0, exports._datetime)(value, _strict).substring(0, 10);
exports._datestr = _datestr;
/**
 * Parse `Date` value to `HH:mm:ss` format `string` (e.g. `'22:11:57'`)
 * - see `_date()` parsing docs
 *
 * @param value - parse date value
 * @param _strict - enable strict datetime parsing (default: `false`) ~ see `_date()`
 * @returns `string` ~ `'HH:mm:ss'` | empty `''` when invalid
 */
const _timestr = (value, _strict = false) => (0, exports._datetime)(value, _strict).substring(11, 19);
exports._timestr = _timestr;
/**
 * Year unit milliseconds ~ close estimate `365.25` days
 * - `365.25 * 24 * 60 * 60 * 1000` = `31557600000` ms
 */
exports.YEAR_MS = 365.25 * 24 * 60 * 60 * 1000;
/**
 * Month unit milliseconds ~ close estimate `30.44` days
 * - `30.44 * 24 * 60 * 60 * 1000` = `2630016000.0000005` ms
 */
exports.MONTH_MS = 30.44 * 24 * 60 * 60 * 1000;
/**
 * Day unit milliseconds
 * - `24 * 60 * 60 * 1000` = `86400000` ms
 */
exports.DAY_MS = 24 * 60 * 60 * 1000;
/**
 * Hour unit milliseconds
 * - `60 * 60 * 1000` = `3600000` ms
 */
exports.HOUR_MS = 60 * 60 * 1000;
/**
 * Minute unit milliseconds
 * - `60 * 1000` = `60000` ms
 */
exports.MINUTE_MS = 60 * 1000;
/**
 * Second unit milliseconds
 * - `1000` ms
 */
exports.SECOND_MS = 1000;
/**
 * **[internal]** Create `IDuration` object
 *
 * @param years - elapsed years
 * @param months - elapsed months
 * @param days - elapsed days
 * @param hours - elapsed hours
 * @param minutes - elapsed minutes
 * @param seconds - elapsed seconds
 * @param milliseconds - elapsed milliseconds
 * @param total_days - elapsed total days
 * @param total_time - elapsed total time
 * @param start_time - start timestamp
 * @param end_time - end timestamp
 * @returns `IDuration`
 */
const create_duration = (years, months, days, hours, minutes, seconds, milliseconds, total_days, total_time, start_time, end_time) => ({
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    total_days,
    total_time,
    start_time,
    end_time,
    toString: function (mode = 0) {
        mode = [0, 1].includes(mode = parseInt(mode)) ? mode : 0;
        const buffer_text = [], buffer_time = [];
        const _add = (val, name) => {
            if (mode === 0 && ['hour', 'minute', 'second', 'millisecond'].includes(name)) {
                if (name === 'millisecond')
                    return;
                buffer_time.push(String(val).padStart(2, '0'));
            }
            else if (val)
                buffer_text.push(val + ' ' + name + (val > 1 ? 's' : ''));
        };
        _add(years, 'year');
        _add(months, 'month');
        _add(days, 'day');
        _add(hours, 'hour');
        _add(minutes, 'minute');
        _add(seconds, 'second');
        _add(milliseconds, 'millisecond');
        if (mode === 0)
            return (buffer_text.length ? buffer_text.join(', ') + ' ' : '') + buffer_time.join(':');
        if (!buffer_text.length)
            buffer_text.push('0 milliseconds');
        return buffer_text.join(', ').replace(/,([^,]*)$/, ' and$1');
        // return buffer_text.length > 1 ? buffer_text.slice(0, -1).join(', ') + ' and ' + buffer_text[buffer_text.length - 1] : buffer_text.join('');
    },
});
/**
 * Get elapsed duration between two dates/timestamps ~ extra accuracy considering leap years
 * - start and end values are reordered automatically (i.e. `start <= end`)
 *
 * @param start - start date/timestamp
 * @param end - end date/timestamp (default: `undefined`)
 * @param _strict - enable strict datetime parsing (default: `false`) ~ see `_date()`
 * @throws `TypeError` on invalid start/end time value
 * @returns `IDuration`
 */
const _elapsed = (start, end = undefined, _strict = false) => {
    // FIXME: improve '_elapsed' accuracy (not urgent)
    // parse date arguments
    if (!(start = (0, exports._date)(start, _strict)))
        throw new TypeError('Invalid elapsed start date value.');
    if (!(end = (0, exports._date)(end, _strict)))
        throw new TypeError('Invalid elapsed end date value.');
    // ensure start date is earlier than end date
    if (start > end)
        [start, end] = [end, start];
    // calc time difference
    const DAY_MS = 24 * 60 * 60 * 1000;
    const HOUR_MS = 60 * 60 * 1000;
    const MINUTE_MS = 60 * 1000;
    const SECOND_MS = 1000;
    let years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0;
    const total_time = end.getTime() - start.getTime();
    const total_days = Math.floor(total_time / DAY_MS);
    if (end > start) {
        const d1 = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        if (d1.getFullYear() !== start.getFullYear())
            d1.setFullYear(start.getFullYear());
        const d2 = new Date(end.getFullYear(), end.getMonth(), end.getDate());
        if (d2.getFullYear() !== end.getFullYear())
            d2.setFullYear(end.getFullYear());
        // difference: hours, minutes, seconds, milliseconds
        let ms = (end.getTime() - start.getTime()) - (d2.getTime() - d1.getTime());
        if (ms) {
            if (ms < 0) {
                ms = Math.abs(ms);
                d2.setDate(d2.getDate() - 1);
            }
            hours = Math.floor(ms / HOUR_MS);
            ms -= hours * HOUR_MS;
            minutes = Math.floor(ms / MINUTE_MS);
            ms -= minutes * MINUTE_MS;
            seconds = Math.floor(ms / SECOND_MS);
            milliseconds = ms - seconds * SECOND_MS;
        }
        // difference: years, months, days
        let y1 = d1.getFullYear(), m1 = d1.getMonth(), dd1 = d1.getDate();
        let y2 = d2.getFullYear(), m2 = d2.getMonth(), dd2 = d2.getDate();
        if (m1 === m2 && m1 === 1 && dd1 === 29 && dd2 === 28 && dd2 === new Date(y2, 2, 0).getDate())
            dd1 = 28; //Feb end adjust
        if (y2 > y1) {
            if (m2 > m1) {
                if (dd1 === 1) {
                    days = dd2 - 1;
                    months = m2 - m1;
                    years = y2 - y1;
                }
                else if (dd2 > dd1) {
                    days = dd2 - dd1;
                    months = m2 - m1;
                    years = y2 - y1;
                }
                else if (dd2 < dd1) {
                    let d = 0;
                    const end1 = new Date(y1, m1, 0).getDate();
                    const end2 = new Date(y2, m2, 0).getDate();
                    if (dd1 > end1 && dd1 > end2)
                        d = 1;
                    else if (dd1 <= end1)
                        d = (end1 - dd1) || 1;
                    else
                        d = (end2 - dd1) || 1;
                    days = d + (dd2 > 1 ? dd2 - 1 : 0);
                    if ((months = m2 - new Date(y1, m1 + 1, 1).getMonth()) < 0) {
                        months += 12;
                        y2--;
                    }
                    years = y2 - y1;
                }
                else {
                    days = 0;
                    months = m2 - m1;
                    years = y2 - y1;
                }
            }
            else if (m2 < m1) {
                if (dd1 === 1) {
                    days = dd2 - 1;
                    months = 12 - m1 + m2;
                    years = y2 - (y1 + 1);
                }
                else if (dd2 > dd1) {
                    days = dd2 - dd1;
                    months = 12 - m1 + m2;
                    years = y2 - (y1 + 1);
                }
                else if (dd2 < dd1) {
                    let d = 0;
                    const end1 = new Date(y1, m1, 0).getDate();
                    const end2 = new Date(y2, m2, 0).getDate();
                    if (dd1 > end1 && dd1 > end2)
                        d = 1;
                    else if (dd1 > end2)
                        d = (end1 - dd1) || 1;
                    else
                        d = (end2 - dd1) || 1;
                    days = d + (dd2 > 1 ? dd2 - 1 : 0);
                    if ((months = m2 - new Date(y1, m1 + 1, 1).getMonth()) < 0) {
                        y2--;
                        months += 12;
                    }
                    years = y2 - y1;
                }
                else {
                    months = 12 - m1 + m2;
                    years = y2 - (y1 + 1);
                }
            }
            else if (dd2 >= dd1) {
                days = dd2 - dd1;
                years = y2 - y1;
            }
            else {
                days = (new Date(y1, m1 + 1, 0).getDate() - dd1) + dd2;
                months = 12 - new Date(y1, m1 + 1, 1).getMonth() + m2;
                years = y2 - (y1 + 1);
            }
        }
        else {
            days = dd2 - dd1;
            months = m2 - m1;
        }
    }
    return create_duration(years, months, days, hours, minutes, seconds, milliseconds, total_days, total_time, start.getTime(), end.getTime());
};
exports._elapsed = _elapsed;
/**
 * Get elapsed duration between two dates/timestamps ~ closest estimation
 * - start and end values are reordered automatically (start = min, end = max)
 *
 * @param start - start date/ms timestamp
 * @param end - end date/ms timestamp (default: `0`)
 * @param _strict - enable strict datetime parsing (default: `false`) ~ see `_date()`
 * @throws `TypeError` on invalid start/end time value
 * @returns `IDuration`
 */
const _duration = (start, end = 0, _strict = false) => {
    if (!(start = (0, exports._date)(start, _strict)))
        throw new TypeError('Invalid duration start date value! Pass a valid Date instance, integer timestamp or date string value.');
    if (!(end = (0, exports._date)(end, _strict)))
        throw new TypeError('Invalid duration end date value! Pass a valid Date instance, integer timestamp or date string value.');
    if (start > end) {
        const swap = start;
        start = end;
        end = swap;
    }
    let diff = 0;
    const end_time = end.getTime();
    const start_time = start.getTime();
    const total_time = diff = Math.abs(end_time - start_time);
    const total_days = Math.floor(total_time / exports.DAY_MS);
    const years = Math.floor(total_time / exports.YEAR_MS);
    diff %= exports.YEAR_MS;
    const months = Math.floor(diff / exports.MONTH_MS);
    diff %= exports.MONTH_MS;
    const days = Math.floor(diff / exports.DAY_MS);
    diff %= exports.DAY_MS;
    const hours = Math.floor(diff / exports.HOUR_MS);
    diff %= exports.HOUR_MS;
    const minutes = Math.floor(diff / exports.MINUTE_MS);
    diff %= exports.MINUTE_MS;
    const seconds = Math.floor(diff / exports.SECOND_MS);
    const milliseconds = diff % exports.SECOND_MS;
    return create_duration(years, months, days, hours, minutes, seconds, milliseconds, total_days, total_time, start_time, end_time);
};
exports._duration = _duration;
//# sourceMappingURL=_datetime.js.map