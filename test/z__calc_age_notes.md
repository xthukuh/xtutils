misc

```log
Age calculator instructions
- the function receives `start` and `end` date arguments and outputs `{years:number,months:number,days:number,hours:number,minutes:number,seconds:number,milliseconds:number}`
- the function parses the arguments to date. throws error when one is invalid
- swap values so `start` date is less than `end` date
- if both dates have different months
-- calculate days and time to end of `start`'s month, then add months to end of `start`'s year, then add years to 


# J F M A M J J A S O  N  D
# 1 2 3 4 5 6 7 8 9 10 11 12
# 0 1 2 3 4 5 6 7 8 9  10 11

# 2000-02-29 - 2005-05-10
# 2000-05-10 - 2005-02-29

```


stackoverflow

```js
/**
 * Get elapsed time ~ difference between two date/time values (ordered automatically)
 * 
 * @param {*} start - start time
 * @param {*} end - end time
 * @throws {TypeError} on invalid start/end time value
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
 * }} `{[key: string]: any}`
 */
function elapsedTime(start, end){

    /**
     * Parse date value ~ accepts valid Date instance, integer timestamp or date string
     *  
     * @param {*} val 
     * @returns {Date|undefined}
     */
    const _parse_date = val => {
        if (val instanceof Date) return !isNaN(val = val.getTime()) ? new Date(val) : undefined;
        else if ('string' === typeof val) return !isNaN(val = Date.parse(val)) ? new Date(val) : undefined;
        return Number.isInteger(val) ? new Date(val) : undefined;
    };

    //-- parse arguments
    if (!(start = _parse_date(start))) throw new TypeError('Invalid elapsed start time value! Pass a valid Date instance, integer timestamp or date string value.');
    if (!(end = _parse_date(end))) throw new TypeError('Invalid elapsed end time value! Pass a valid Date instance, integer timestamp or date string value.');

    // -- parse elapsed time
    if (start > end) [start, end] = [end, start];
    const DAY_MS = 24 * 60 * 60 * 1000;
    const HOUR_MS = 60 * 60 * 1000;
    const MINUTE_MS = 60 * 1000;
    const SECOND_MS = 1000;
    const d1 = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0);
    let d2 = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 0, 0, 0, 0);
    const t1 = start.getHours() * HOUR_MS + start.getMinutes() * MINUTE_MS + start.getSeconds() * SECOND_MS + start.getMilliseconds();
    let t2 = end.getHours() * HOUR_MS + end.getMinutes() * MINUTE_MS + end.getSeconds() * SECOND_MS + end.getMilliseconds();
    if (t2 < t1){
        d2.setDate(d2.getDate() - 1);
        t2 += DAY_MS;
    }
    const hours = Math.floor((t2 - t1) / HOUR_MS);
    const minutes = Math.floor((t2 - t1 - hours * HOUR_MS) / MINUTE_MS);
    const seconds = Math.floor((t2 - t1 - hours * HOUR_MS - minutes * MINUTE_MS) / SECOND_MS);
    const milliseconds = t2 - t1 - hours * HOUR_MS - minutes * MINUTE_MS - seconds * SECOND_MS;
    if (d1.getMonth() === 1 && d2.getMonth() === 1){
        const last1 = new Date(d1.getFullYear(), d1.getMonth() + 1, 0).getDate();
        const last2 = new Date(d2.getFullYear(), d2.getMonth() + 1, 0).getDate();
        if (last1 > last2 && d1.getDate() === last1) d1.setDate(28);
    }
    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();
    if (days < 0){
        months --;
        if (d2.getMonth() > d1.getMonth()) days += new Date(d2.getFullYear(), d2.getMonth(), 0).getDate();
        else {
            let n1 = new Date(d1.getFullYear(), d1.getMonth() + 1, 0).getDate() - d1.getDate();
            days = n1 + d2.getDate();
        }
    }
    if (months < 0) {
        years--;
        d2 = new Date(d2.getFullYear()-1, d2.getMonth(), d2.getDate());
        months += 12;
    }
    const start_time = start.getTime();
    const end_time = end.getTime();
    const total_time = end_time - start_time;
    const total_days = Math.floor(total_time / DAY_MS);
    //<< result
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
            const _add = (val, singular) => void (val ? values.push(val + ' ' + (val === 1 ? singular : singular + 's')) : null);
            _add(years, 'year');
            _add(months, 'month');
            _add(days, 'day');
            _add(hours, 'hour');
            _add(minutes, 'minute');
            _add(seconds, 'second');
            _add(milliseconds, 'millisecond');
            if (!values.length) values.push('0 milliseconds');
            return values.length > 1 ? values.slice(0, -1).join(', ') + ' and ' + values[values.length - 1] : values.join('');
        },
    }
}

//============================ example usage ================================

const result = elapsedTime("1998-02-22", "2008-05-19");
console.log(result.toString()); // 10 years, 2 months and 27 days
console.log(JSON.stringify(result, undefined, 2));
// {
//     "start": "1998-02-22T00:00:00.000Z",
//     "end": "2008-05-19T00:00:00.000Z",
//     "years": 10,
//     "months": 2,
//     "days": 27,
//     "hours": 0,
//     "minutes": 0,
//     "seconds": 0,
//     "milliseconds": 0,
//     "total_days": 3739,
//     "total_time": 323049600000
// }
const _res = ({years,months,days})=>({years, months, days});
console.log(_res(elapsedTime('1998-02-22','2008-05-19'))); // { years: 10, months: 2, days: 27 }
console.log(_res(elapsedTime('2004-05-31','2005-03-01'))); // { years: 0, months: 9, days: 1 }
console.log(_res(elapsedTime('2000-02-29','2001-02-28'))); // { years: 1, months: 0, days: 0 }
console.log(_res(elapsedTime("2003-03-23","2000-01-30"))); // { years: 3, months: 1, days: 23 }
console.log(_res(elapsedTime("2004-05-28","2005-03-01"))); // { years: 0, months: 9, days: 1 }
console.log(_res(elapsedTime("2004-05-29","2005-03-01"))); // { years: 0, months: 9, days: 1 }
console.log(_res(elapsedTime("2004-05-30","2005-03-01"))); // { years: 0, months: 9, days: 1 }
console.log(_res(elapsedTime("0005-03-01","2004-05-31"))); // { years: 1999, months: 2, days: 30 }
console.log(_res(elapsedTime("0005-03-01","8004-05-31"))); // { years: 7999, months: 2, days: 30 }

```