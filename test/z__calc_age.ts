// z__calc_age.ts

interface IAge {
	start: Date;
	end: Date;
	total_days: number;
	total_time: number;
	years: number;
	months: number;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	milliseconds: number;
}

/**
 * Calculate time difference
 * 
 * @param time_start 
 * @param time_end 
 * @returns 
 */
export function calc_age(start: any, end: any): IAge
{
	// helper function to parse value to date
	const _parse_date = (val: any): Date|undefined => {
		if (val instanceof Date) return !isNaN(val = val.getTime()) ? new Date(val) : undefined;
		else if ('string' === typeof val) return !isNaN(val = Date.parse(val)) ? new Date(val) : undefined;
		return Number.isInteger(val) ? new Date(val) : undefined;
	};

	// parse start and end dates
	start = _parse_date(start);
	end = _parse_date(end);
	if (!start) throw new Error('Invalid start date.');
	if (!end) throw new Error('Invalid end date.');

	// Ensure start date is earlier than end date
	if (start > end) [start, end] = [end, start];

	// Calculate the difference
	const DAY_MS = 24 * 60 * 60 * 1000;
	const HOUR_MS = 60 * 60 * 1000;
	const MINUTE_MS = 60 * 1000;
	const SECOND_MS = 1000;
	let years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0;
	const dates_only = start.toISOString().substring(11, 23) === '00:00:00.000' && end.toISOString().substring(11, 23) === '00:00:00.000';
	const start_year = start.getFullYear(), start_time = start.getTime(), end_time = end.getTime();
	const total_time = end_time - start_time;
	const total_days = Math.floor(total_time / DAY_MS);
	const start_year_start_time = new Date(start_year, 0, 1, 0, 0, 0, 0).getTime();
	const end_year_end_time = new Date(end.getFullYear() + 1, 0, 0, 23, 59, 59, 999).getTime();
	let m = start.getMonth();
	if (end.getFullYear() > start_year){
		years = end.getFullYear() - start_year;
		if (start_time > start_year_start_time){
			const start_month_start_time = new Date(start_year, m, 1, 0, 0, 0, 0).getTime();
			if (start_time > start_month_start_time){
				const start_month_end_time = new Date(start_year, m + 1, 0, 23, 59, 59, 999).getTime();
				let ms = start_month_end_time - start_time;
				const dd = Math.floor(ms / DAY_MS);
				ms -= dd * DAY_MS;
				const hh = Math.floor(ms / HOUR_MS);
				ms -= hh * HOUR_MS;
    		const mm = Math.floor(ms / MINUTE_MS);
				ms -= mm * MINUTE_MS;
    		const ss = Math.floor(ms / SECOND_MS);
				ms -= ss * SECOND_MS;
				days += dd;
				hours += hh;
				minutes += mm;
				seconds += ss;
				milliseconds += ms;
				//..
				m ++;
			}
			months += 12 - (m + 1);
			years --;
		}
		const end_time = end.getTime();
		if (end_time < end_year_end_time){
			months += end.getMonth();
			days += end.getDate();
			hours += end.getHours();
			minutes += end.getMinutes();
			seconds += end.getSeconds();
			milliseconds += end.getMilliseconds();
			const d2 = new Date(start_year + years, months, days, hours, minutes, seconds, milliseconds);
			years += d2.getFullYear() - end.getFullYear();
			months = d2.getMonth();
			days = d2.getDate();
			hours = d2.getHours();
			minutes = d2.getMinutes();
			seconds = d2.getSeconds();
			milliseconds = d2.getMilliseconds();
		}
		else years ++;
	}
	else {
		if (end.getMonth() > m){
			months = end.getMonth() - m;
			const start_month_start_time = new Date(start_year, m, 1, 0, 0, 0, 0).getTime();
			if (start_time > start_month_start_time){
				const start_month_end_time = new Date(start_year, m + 1, 0, 23, 59, 59, 999).getTime();
				let ms = start_month_end_time - start_time;
				const dd = Math.floor(ms / DAY_MS);
				ms -= dd * DAY_MS;
				const hh = Math.floor(ms / HOUR_MS);
				ms -= hh * HOUR_MS;
    		const mm = Math.floor(ms / MINUTE_MS);
				ms -= mm * MINUTE_MS;
    		const ss = Math.floor(ms / SECOND_MS);
				ms -= ss * SECOND_MS;
				days += dd;
				hours += hh;
				minutes += mm;
				seconds += ss;
				milliseconds += ms;
				months --;
				m ++;
			}
			days += end.getDate();
			hours += end.getHours();
			minutes += end.getMinutes();
			seconds += end.getSeconds();
			milliseconds += end.getMilliseconds();
			const d2 = new Date(start_year, m + months, days, hours, minutes, seconds, milliseconds);
			months = d2.getMonth();
			days = d2.getDate();
			hours = d2.getHours();
			minutes = d2.getMinutes();
			seconds = d2.getSeconds();
			milliseconds = d2.getMilliseconds();
		}
		else {
			let ms = end.getTime() - start_time;
			const dd = Math.floor(ms / DAY_MS);
			ms -= dd * DAY_MS;
			const hh = Math.floor(ms / HOUR_MS);
			ms -= hh * HOUR_MS;
			const mm = Math.floor(ms / MINUTE_MS);
			ms -= mm * MINUTE_MS;
			const ss = Math.floor(ms / SECOND_MS);
			ms -= ss * SECOND_MS;
			days += dd;
			hours += hh;
			minutes += mm;
			seconds += ss;
			milliseconds += ms;
			months --;
			m ++;
		}
	}
	return {
		start,
		end,
		total_days,
		total_time,
		years,
		months,
		days,
		hours,
		minutes,
		seconds,
		milliseconds
	}
}

const tests = [
	{
		start: '1998-02-22',
		end: '2008-05-19',
		expects: {
			years: 10,
			months: 2,
			days: 27,
		},
	},
	{
		start: '2004-05-31',
		end: '2005-03-01',
		expects: {
			years: 0,
			months: 9,
			days: 1,
		},
	},
	{
		start: '2000-02-29',
		end: '2001-02-28',
		expects: {
			years: 1,
			months: 0,
			days: 0,
		},
	},
	{
		start: '2003-03-23',
		end: '2000-01-30',
		expects: {
			years: 3,
			months: 1,
			days: 23,
		},
	},
	{
		start: '2004-05-28',
		end: '2005-03-01',
		expects: {
			years: 0,
			months: 9,
			days: 1,
		},
	},
	{
		start: '2004-05-29',
		end: '2005-03-01',
		expects: {
			years: 0,
			months: 9,
			days: 1,
		},
	},
	{
		start: '2004-05-30',
		end: '2005-03-01',
		expects: {
			years: 0,
			months: 9,
			days: 1,
		},
	},
	{
		start: '0005-03-01',
		end: '2004-05-31',
		expects: {
			years: 1999,
			months: 2,
			days: 30,
		},
	},
	{
		start: '0005-03-01',
		end: '8004-05-31',
		expects: {
			years: 7999,
			months: 2,
			days: 30,
		},
	},
];
let pass_count = 0;
const arr = [];
for (let i = 0; i < tests.length; i ++){
	const {start, end, expects} = tests[i];
	arr.push([start, end]);
	const result = calc_age(start, end);
	const pass = Object.entries(expects).every(([key, val]) => result[key as keyof IAge] === val);
	let failures = '';
	if (pass) pass_count ++;
	else failures = Object.entries(expects).filter(([key, val]) => result[key as keyof IAge] !== val).map(([key, val]) => `${key}: [${val}, ${result[key as keyof IAge]}]`).join('; ');
	const log = `[${i + 1}/${tests.length}] ${pass ? 'PASS' : 'FAIL'}: (start=${start}, end=${end}) ${failures}`.trim();
	console.log(log);
}
console.log(`Passed ${pass_count} out of ${tests.length} tests.`);
console.log(JSON.stringify(arr, null, 2));
// npx ts-node test/z__calc_age.ts