import {
	_date,
	_parseIso,
	_datetime,
	_jsonStringify,
} from '../lib';

// npm run dev
// npx ts-node ./test/index.ts
(async(): Promise<any> => {
	// const val = '0005-03-01';
	// // const val = '0005-03-01T00:00:00.000Z';
	// const parseIsoTimestamp = _parseIso(val) as number;
	// const parseIsoTimestampDate = new Date(parseIsoTimestamp);
	// const parseIsoTimestampDate_toISOString = parseIsoTimestampDate.toISOString();
	// const parseIsoTimestampDate_datetime =  _datetime(parseIsoTimestampDate);
	// const date = _date(val) as Date;
	// const date_toISOString = date?.toISOString();
	// const date_datetime = _datetime(date, true);
	// console.log(_jsonStringify({
	// 	val,
	// 	parseIsoTimestamp,
	// 	parseIsoTimestampDate,
	// 	parseIsoTimestampDate_toISOString,
	// 	parseIsoTimestampDate_datetime,
	// 	_date: [
	// 		date,
	// 		date_toISOString,
	// 		date_datetime,
	// 	],
	// }, 2));

	const tests: any[] = [
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
	let i = -1;
	for (const test of tests) {
		i ++;
		const result = _time_diff(test.start, test.end);
		const passes = [result.years === test.expects.years, result.months === test.expects.months, result.days === test.expects.days];
		const pass = passes.findIndex(v => !v) === -1;
		console.log(`[${i}]`);
		console.log(_jsonStringify({pass, passes, result, ...test}, 2));
		console.log('');
	};
})();

function _time_diff(start: any, end: any): any
{
	start = _date(start);
	end = _date(end);
	if (start > end) [start, end] = [end, start];
	const DAY_MS = 24 * 60 * 60 * 1000;
	const HOUR_MS = 60 * 60 * 1000;
	const MINUTE_MS = 60 * 1000;
	const SECOND_MS = 1000;
	let years: number = 0, months: number = 0, days: number = 0, hours: number = 0, minutes: number = 0, seconds: number = 0, milliseconds: number = 0;
	const t1: number = start.getTime();
	let t2: number = end.getTime();
	const y1: number = start.getFullYear(), m1: number = start.getMonth(), d1: number = start.getDate();
	const tt1: number = (start.getHours() * 60 * 60 * 1000) + (start.getMinutes() * 60 * 1000) + (start.getSeconds() * 1000) + start.getMilliseconds();
	const tt2: number = (end.getHours() * 60 * 60 * 1000) + (end.getMinutes() * 60 * 1000) + (end.getSeconds() * 1000) + end.getMilliseconds();
	const dt1: number = t1 - tt1;
	const dt2: number = t2 - tt2;
	const d: Date = new Date(dt1);
	const d2: Date = new Date(dt2);
	let ms: number = 0, dt: number = 0, t: number = 0, n: number = 0;
	if (tt2 < tt1) {
		ms = DAY_MS - tt1 + tt2;
		d2.setTime(dt2 - DAY_MS);
		d.setTime(dt1 + ms);
	}
	else {
		ms = tt2 - tt1;
		d.setTime(t1 + ms);
	}
	t2 = d2.getTime();
	const ed: Date = new Date(d.getTime() + DAY_MS);
	const em: Date = new Date(d.getFullYear(), d.getMonth() + 1, 1);
	const ey: Date = new Date(d.getFullYear() + 1, 0, 1);
	let day_end: boolean = false;
	let month_end: boolean = false;
	let year_end: boolean = false;
	while ((dt = d.getTime()) < t2) {
		if (!day_end) {
			t = ed.getTime() <= t2 ? ed.getTime() : t2;
			ms = t - dt;
			d.setTime(t);
			day_end = true;
			continue;
		}
		if (!month_end) {
			t = em.getTime() <= t2 ? em.getTime() : t2;
			if (dt < t) {
				n = dt + DAY_MS;
				d.setTime(n <= t ? n : t);
				days ++;
				continue;
			}
			month_end = true;
		}
		if (!year_end) {
			t = ey.getTime() <= t2 ? ey.getTime() : t2;
			if (dt < t) {
				n = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate()).getTime();
				d.setTime(n <= t ? n : t);
				months ++;
				continue;
			}
			year_end = true;
		}
		if (d.getFullYear() < d2.getFullYear() && (n = new Date(d.getFullYear() + 1, d.getMonth(), d.getDate()).getTime()) < t2) {
			d.setTime(n);
			years ++;
			continue;
		}
		if (d.getMonth() < d2.getMonth() && (n = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate()).getTime()) < t2) {
			d.setTime(n);
			months ++;
			continue;
		}
		if ((n = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime()) <= t2) {
			d.setTime(n);
			days ++;
			continue;
		}
	}
	if (ms > 0) {
		const td = new Date(ms);
		hours = td.getHours();
		minutes = td.getMinutes();
		seconds = td.getSeconds();
		milliseconds = td.getMilliseconds();
	}
	return {years, months, days, hours, minutes, seconds, milliseconds};
}