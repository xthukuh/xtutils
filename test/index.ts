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
		// { start: '1998-02-22', end: '2008-05-19', expects: { years: 10, months: 2, days: 27 } },
		{ start: '2004-05-31', end: '2005-03-01', expects: { years: 0, months: 9, days: 1 } },
		{ start: '2000-02-29', end: '2001-02-28', expects: { years: 1, months: 0, days: 0 } },
		{ start: '2003-03-23', end: '2000-01-30', expects: { years: 3, months: 1, days: 23 } },
		{ start: '2004-05-28', end: '2005-03-01', expects: { years: 0, months: 9, days: 1 } },
		{ start: '2004-05-29', end: '2005-03-01', expects: { years: 0, months: 9, days: 1 } },
		{ start: '2004-05-30', end: '2005-03-01', expects: { years: 0, months: 9, days: 1 } },
		{ start: '0005-03-01', end: '2004-05-31', expects: { years: 1999, months: 2, days: 30 } },
		// { start: '0005-03-01', end: '8004-05-31', expects: { years: 7999, months: 2, days: 30 } },
	];
	let i = -1;
	for (const test of tests) {
		i ++;
		const {start, end} = test;
		const result = _time_diff(start, end);
		const passes = [result.years === test.expects.years, result.months === test.expects.months, result.days === test.expects.days, test.expects.days - result.days];
		const pass = passes.findIndex(v => v === false) === -1;
		console.log(`[${i}] pass: ` + pass, _jsonStringify(pass ? {start, end, result} : {passes, result, ...test}, pass ? undefined : 2));
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
	const t1: number = start.getTime(), t2: number = end.getTime();
	let years: number = 0, months: number = 0, days: number = 0, hours: number = 0, minutes: number = 0, seconds: number = 0, milliseconds: number = 0;
	const tt1: number = (start.getHours() * 60 * 60 * 1000) + (start.getMinutes() * 60 * 1000) + (start.getSeconds() * 1000) + start.getMilliseconds();
	const tt2: number = (end.getHours() * 60 * 60 * 1000) + (end.getMinutes() * 60 * 1000) + (end.getSeconds() * 1000) + end.getMilliseconds();
	const d1: Date = new Date(t1 - tt1);
	const d2: Date = new Date(t2 - tt2);
	let ms: number = 0;
	if (tt1 || tt2) {
		if (tt2 < tt1) {
			d2.setTime(d2.getTime() - DAY_MS);
			ms = DAY_MS - tt1 + tt2;
		} else {
			ms = tt2 - tt1;
		}
	}
	let leap_adjust: boolean = false;
	if (d1.getMonth() === d2.getMonth() && d1.getMonth() === 1 && d1.getDate() === 29 && d2.getDate() === 28 && d2.getDate() === new Date(d2.getFullYear(), 2, 0).getDate()) {
		d2.setTime(d2.getTime() + DAY_MS);
		leap_adjust = true;
	}
	let yss: boolean = false;
	let mss: boolean = false;
	let sy: number = 0, sm: number = 0, sd: number = 0, pm: number = -1, dt: number = 0;
	let  n: number = 0, n2: number = 0, t: number = 0;
	while ((t = (n2 = d2.getTime()) - (dt = d1.getTime())) > 0) {
		if (!mss) {
			const nd: Date = new Date(d1.getFullYear(), d1.getMonth() + 1, 1);
			nd.setFullYear(d1.getFullYear());
			// n = new Date(d1.getFullYear(), d1.getMonth() + 1, 1).getTime();
			n = nd.getTime();
			n = n < n2 ? n : n2;
			sd += ((n - dt)/DAY_MS);
			d1.setTime(n); // + days
			mss = true;
			continue;
		}
		if (!yss) {
			const nd: Date = new Date(d1.getFullYear() + 1, 0, 1);
			nd.setFullYear(d1.getFullYear() + 1);
			n = nd.getTime();
			n = n < n2 ? n : n2;
			while (!(d1.getFullYear() === nd.getFullYear() && d1.getMonth() === nd.getMonth())) {
				d1.setMonth(d1.getMonth() + 1); // + month
				sm ++;
			}
			yss = true;
			continue;
		}
		const yd: number = d2.getFullYear() - d1.getFullYear();
		if (yd > 1) {
			console.log([yd, d1.getFullYear(), d2.getFullYear()]);
			d1.setFullYear(d1.getFullYear() + (sy = yd - 1)); // + years
			continue;
		}
		if (t > new Date(d1.getFullYear(), d1.getMonth() + 1, d1.getDate()).getTime()) {
			d1.setMonth(d1.getMonth() + 1); // + month
			if (sm == 11) {
				sy ++;
				sm = 0;
			}
			else sm ++;
			continue;
		}
		if (pm < 0) pm = d1.getMonth();
		const _plus_day = () => {
			sd ++;
			d1.setDate(d1.getDate() + 1); // + day
			if (d1.getMonth() !== pm) { // ++ month
				pm = d1.getMonth();
				if (sm == 11) {
					sy ++;
					sm = 0;
				}
				else sm ++;
				sd = leap_adjust ? 0 : 1;
			}
		};
		if (t > DAY_MS) {
			_plus_day();
			continue;
		}
		ms += t; // + ms
		if (ms >= DAY_MS) {
			_plus_day();
			const msd: number = Math.floor(ms / DAY_MS);
			ms -= msd * DAY_MS;
		}
		d1.setTime(n2);
	}
	years = sy;
	months = sm;
	days = sd;
	if (ms) {
		hours = Math.floor(ms / HOUR_MS);
		ms -= hours * HOUR_MS;
		minutes = Math.floor(ms / MINUTE_MS);
		ms -= minutes * MINUTE_MS;
		seconds = Math.floor(ms / SECOND_MS);
		milliseconds = ms - seconds * SECOND_MS;
	}
	return {years, months, days, hours, minutes, seconds, milliseconds};
}