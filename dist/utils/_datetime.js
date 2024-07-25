"use strict";
//===================================================================================
// simple date helpers - consider useful libraries: https://momentjs.com/ 
//===================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports._duration = exports._elapsed = exports.SECOND_MS = exports.MINUTE_MS = exports.HOUR_MS = exports.DAY_MS = exports.MONTH_MS = exports.YEAR_MS = exports._parseIso = exports._timestr = exports._datestr = exports._datetime = exports._yearEnd = exports._yearStart = exports._monthEnd = exports._monthStart = exports._dayEnd = exports._dayStart = exports._monthName = exports.MONTH_NAMES = exports._dayName = exports.DAY_NAMES = exports._time = exports._date = exports._isDate = void 0;
/**
 * Validate `Date` instance
 *
 * @param value
 * @returns `boolean`
 */
const _isDate = (value) => value instanceof Date && !isNaN(value.getTime());
exports._isDate = _isDate;
/**
 * Parse `Date` value ~ accepts valid `Date` instance, timestamp integer, datetime string (see `_strict` param docs)
 * - supports valid `Date` instance, `integer|string` timestamp in milliseconds and other `string` date texts
 * - when strict parsing, value must be a valid date value with more than `1` timestamp milliseconds
 * - when strict parsing is disabled, result for `undefined` = `new Date()` and `null|false|true|0` = `new Date(null|false|true|0)`
 *
 * @param value - parse date value
 * @param _strict - enable strict parsing (default: `true`)
 * @returns `Date` instance | `undefined` when invalid
 */
const _date = (value, _strict = true) => {
    if (value === undefined)
        return _strict ? undefined : new Date();
    const _parse = (val) => !isNaN(val) && (val > 1 || !_strict) ? new Date(val) : undefined;
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
        return _parse(Date.parse(text));
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
    return new Date(date.getFullYear(), 11, 0, 23, 59, 59, 999);
};
exports._yearEnd = _yearEnd;
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
    const values = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(), //ss
    ];
    const padded = [];
    for (const val of values)
        padded.push((val + '').padStart(2, '0')); //pad ~ `'1' => '01'`
    return padded.splice(0, 3).join('-') + ' ' + padded.join(':'); //timestamp
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
 * - start and end values are reordered automatically (start = min, end = max)
 *
 * @param start - start date/timestamp
 * @param end - end date/timestamp (default: `undefined`)
 * @param _strict - enable strict datetime parsing (default: `false`) ~ see `_date()`
 * @throws `TypeError` on invalid start/end time value
 * @returns `IDuration`
 */
const _elapsed = (start, end = undefined, _strict = false) => {
    if (!(start = (0, exports._date)(start, _strict)))
        throw new TypeError('Invalid elapsed start date value! Pass a valid Date instance, integer timestamp or date string value.');
    if (!(end = (0, exports._date)(end, _strict)))
        throw new TypeError('Invalid elapsed end date value! Pass a valid Date instance, integer timestamp or date string value.');
    if (start > end) {
        const swap = start;
        start = end;
        end = swap;
    }
    let years = 0;
    let months = 0;
    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let milliseconds = 0;
    const start_time = start.getTime();
    const end_time = end.getTime();
    const total_time = end_time - start_time;
    const total_days = Math.floor(total_time / exports.DAY_MS);
    if ((milliseconds += (end.getMilliseconds() - start.getMilliseconds())) < 0) {
        seconds--;
        milliseconds += 1000;
    }
    if ((seconds += (end.getSeconds() - start.getSeconds())) < 0) {
        minutes--;
        seconds += 60;
    }
    if ((minutes += (end.getMinutes() - start.getMinutes())) < 0) {
        hours--;
        minutes += 60;
    }
    if ((hours += (end.getHours() - start.getHours())) < 0) {
        days--;
        hours += 24;
    }
    const start_year = start.getFullYear();
    let start_month = start.getMonth();
    years = end.getFullYear() - start_year;
    if ((months = end.getMonth() - start_month) < 0) {
        years--;
        months += 12;
    }
    if ((days += (end.getDate() - start.getDate())) < 0) {
        if (end.getMonth() === start.getMonth())
            start_month++;
        if (months <= 0) {
            years--;
            months = 11;
        }
        else
            months--;
        days += new Date(start_year, start_month + 1, 0).getDate();
    }
    return create_duration(years, months, days, hours, minutes, seconds, milliseconds, total_days, total_time, start_time, end_time);
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