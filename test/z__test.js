(() => {
    /**
     * Get time difference between two dates in units `{years, months, days, hours, minutes, seconds, milliseconds, total_days, total_time}`
     * 
     * @param {Date} start - date time
     * @param {Date} end - date time
     * @param {Boolean} calc_time - calculate time difference (hours, minutes, seconds, milliseconds)
     * @throws {TypeError} on invalid date argument
     * @returns {{
     *   start: Date,
     *   end: Date,
     *   years: number,
     *   months: number,
     *   days: number,
     *   hours: number,
     *   minutes: number,
     *   seconds: number,
     *   milliseconds: number,
     *   total_days: number,
     *   total_time: number,
     *   toString: (()=>string),
     * }}
     */
    function elapsedTime(start, end, calc_time=false){
        
        // parse arguments
        const _parse_date = val => { // {Date|undefined}
            if (val instanceof Date) return !isNaN(val = val.getTime()) ? new Date(val) : undefined;
            else if ('string' === typeof val) return !isNaN(val = Date.parse(val = val.trim())) ? new Date(val) : undefined;
            return Number.isInteger(val) ? new Date(val) : undefined;
        };
        if (!(start = _parse_date(start))) throw new TypeError('Invalid start date argument value.');
        if (!(end = _parse_date(end))) throw new TypeError('Invalid end date argument value.');

        // ensure start date is earlier than end date
        if (start > end) [start, end] = [end, start];

        // calc time difference
        const DAY_MS = 24 * 60 * 60 * 1000;
        const HOUR_MS = 60 * 60 * 1000;
        const MINUTE_MS = 60 * 1000;
        const SECOND_MS = 1000;
        let years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0;
        const total_time = end.getTime() - start.getTime();
        const total_days = Math.floor(total_time / DAY_MS);
        if (end > start){
            const d1 = !calc_time ? start : new Date(start.getFullYear(), start.getMonth(), start.getDate());
	        const d2 = !calc_time ? end : new Date(end.getFullYear(), end.getMonth(), end.getDate());

            // difference: hours, minutes, seconds, milliseconds
            let ms = !calc_time ? 0 : (end.getTime() - start.getTime()) - (d2.getTime() - d1.getTime());
            if (ms < 0){
                ms += DAY_MS;
                d2.setDate(d2.getDate() - 1);
            }
            hours = Math.floor(ms / HOUR_MS);
            ms -= hours * HOUR_MS;
            minutes = Math.floor(ms / MINUTE_MS);
            ms -= minutes * MINUTE_MS;
            seconds = Math.floor(ms / SECOND_MS);
            milliseconds = ms - seconds * SECOND_MS;

            // difference: years, months, days
            let y1 = start.getFullYear(), m1 = d1.getMonth(), dd1 = d1.getDate();
	        let y2 = end.getFullYear(), m2 = d2.getMonth(), dd2 = d2.getDate();
            if (m1 === m2 && m1 === 1 && dd1 === 29 && dd2 === 28 && dd2 === new Date(y2, 2, 0).getDate()) dd1 = 28; //Feb end adjust
            if (y2 > y1){
                if (m2 > m1){
                    if (dd1 === 1){
                        days = dd2 - 1;
                        months = m2 - m1;
                        years = y2 - y1;
                    }
                    else if (dd2 > dd1){
                        days = dd2 - dd1;
                        months = m2 - m1;
                        years = y2 - y1;
                    }
                    else if (dd2 < dd1){
                        let d = 0;
                        const end1 = new Date(y1, m1, 0).getDate();
                        const end2 = new Date(y2, m2, 0).getDate();
                        if (dd1 > end1 && dd1 > end2) d = 1;
                        else if (dd1 <= end1) d = (end1 - dd1) || 1;
                        else d = (end2 - dd1) || 1;
                        days = d + (dd2 > 1 ? dd2 - 1 : 0);
                        if ((months = m2 - new Date(y1, m1 + 1, 1).getMonth()) < 0){
                            months += 12;
                            y2 --;
                        }
                        years = y2 - y1;
                    }
                    else {
                        days = 0;
                        months = m2 - m1;
                        years = y2 - y1;
                    }
                }
                else if (m2 < m1){
                    if (dd1 === 1){
                        days = dd2 - 1;
                        months = 12 - m1 + m2;
                        years = y2 - (y1 + 1);
                    }
                    else if (dd2 > dd1){
                        days = dd2 - dd1;
                        months = 12 - m1 + m2;
                        years = y2 - (y1 + 1);
                    }
                    else if (dd2 < dd1){
                        let d = 0;
                        const end1 = new Date(y1, m1, 0).getDate();
                        const end2 = new Date(y2, m2, 0).getDate();
                        if (dd1 > end1 && dd1 > end2) d = 1;
                        else if (dd1 > end2) d = (end1 - dd1) || 1;
                        else d = (end2 - dd1) || 1;
                        days = d + (dd2 > 1 ? dd2 - 1 : 0);
                        if ((months = m2 - new Date(y1, m1 + 1, 1).getMonth()) < 0){
                            y2 --;
                            months += 12;
                        }
                        years = y2 - y1;
                    }
                    else {
                        months = 12 - m1 + m2;
                        years = y2 - (y1 + 1);
                    }
                }
                else if (dd2 >= dd1){
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
        return {
            start,
            end,
            years,
            months,
            days,
            hours,
            minutes,
            seconds,
            milliseconds,
            total_days,
            total_time,
            toString: function(){
                const values = [];
                const _add = (val, singular, zero) => void ((val || zero) ? values.push(val + ' ' + (val === 1 ? singular : singular + 's')) : null);
                _add(years, 'year', true);
                _add(months, 'month', true);
                _add(days, 'day', true);
                _add(hours, 'hour');
                _add(minutes, 'minute');
                _add(seconds, 'second');
                _add(milliseconds, 'millisecond');
                if (!values.length) values.push('0 milliseconds');
                return values.length > 1 ? values.slice(0, -1).join(', ') + ' and ' + values[values.length - 1] : values.join('');
            },
        };
    }

    // function tests
    const tests = [
        { start: '1998-02-22', end: '2008-05-19', expects: { years: 10, months: 2, days: 27 } },
        { start: '2004-05-31', end: '2005-03-01', expects: { years: 0, months: 9, days: 1 } },
        { start: '2000-02-29', end: '2001-02-28', expects: { years: 1, months: 0, days: 0 } },
        { start: '2003-03-23', end: '2000-01-30', expects: { years: 3, months: 1, days: 23 } },
        { start: '2004-05-28', end: '2005-03-01', expects: { years: 0, months: 9, days: 1 } },
        { start: '2004-05-29', end: '2005-03-01', expects: { years: 0, months: 9, days: 1 } },
        { start: '2004-05-30', end: '2005-03-01', expects: { years: 0, months: 9, days: 1 } },
        { start: '0005-03-01', end: '2004-05-31', expects: { years: 1999, months: 2, days: 30 } },
        { start: '0005-03-01', end: '8004-05-31', expects: { years: 7999, months: 2, days: 30 } },
    ];
    for (const {start, end, expects} of tests){
        const result = elapsedTime(start, end);
        const pass = expects.years === result.years && expects.months === result.months && expects.days === result.days;
        console.log(`[${pass ? 'pass' : 'fail'}] ${result}`);
    }
    // [pass] 10 years, 2 months and 27 days
    // [pass] 0 years, 9 months and 1 day
    // [pass] 1 year, 0 months and 0 days
    // [pass] 3 years, 1 month and 23 days
    // [pass] 0 years, 9 months and 1 day
    // [pass] 0 years, 9 months and 1 day
    // [pass] 0 years, 9 months and 1 day
    // [pass] 1999 years, 2 months and 30 days
    // [pass] 7999 years, 2 months and 30 days
})(); //node test/z__test2.xx.js