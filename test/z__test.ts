// npx ts-node test/z__test.ts

// helper function to parse date
const _parse_date = (val: any): Date|undefined => {
	if (val instanceof Date) return !isNaN(val = val.getTime()) ? new Date(val) : undefined;
	else if ('string' === typeof val) return !isNaN(val = Date.parse(val)) ? new Date(val) : undefined;
	return Number.isInteger(val) ? new Date(val) : undefined;
};

// helper function to get YYYY-MM-DD (no time)
const _get_date = (date: Date): string => {
	return String(date.getFullYear()).padStart(4, '0') + '-' + [date.getMonth() + 1, date.getDate()].map(v => String(v).padStart(2, '0')).join('-');
};

// helper function to get "YYYY-MM-DD HH:mm:ss"
const _get_datetime = (date: Date): string => {
	return String(date.getFullYear()).padStart(4, '0') + '-' + [date.getMonth() + 1, date.getDate()].map(v => String(v).padStart(2, '0')).join('-')
	+ ' '
	+ [date.getHours(), date.getMinutes(), date.getSeconds()].map(v => String(v).padStart(2, '0')).join(':')
	+ '.' + String(date.getMilliseconds()).padStart(3, '0');
};

// millisecond constants
const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;
const SECOND_MS = 1000;

// helper function to get {dd, hh, mm, ss, ms} from milliseconds
const _ms_time = (ms: number): {dd: number, hh: number, mm: number, ss: number, ms: number} => {
	const dd = Math.floor(ms / DAY_MS);
	ms -= dd * DAY_MS;
	const hh = Math.floor(ms / HOUR_MS);
	ms -= hh * HOUR_MS;
	const mm = Math.floor(ms / MINUTE_MS);
	ms -= mm * MINUTE_MS;
	const ss = Math.floor(ms / SECOND_MS);
	ms -= ss * SECOND_MS;
	return {dd, hh, mm, ss, ms};
}

const _elapsed = (_start: any, _end: any, expects?: {years: number, months: number, days: number}): {years: number, months: number, days: number, hours: number, minutes: number, seconds: number, milliseconds: number} => {
	let start = _parse_date(_start);
	let end = _parse_date(_end);
	if (!start) throw new Error('Invalid start date.');
	if (!end) throw new Error('Invalid end date.');
	
	// ensure start date is earlier than end date
	if (start > end) [start, end] = [end, start];
	console.log(`\n\n[~] start: ${_get_datetime(start)}, end: ${_get_datetime(end)}`);

	// helper to get date only
	const _date_only = (yy: number, mm: number, dd: number): string => String(yy).padStart(4, '0') + '-' + [mm + 1, dd].map(v => String(v).padStart(2, '0')).join('-') + ' 00:00:00.000';

	// calculate the difference
	let years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0;
	const d1 = new Date(_date_only(start.getFullYear(), start.getMonth(), start.getDate()));
	let d2 = new Date(_date_only(end.getFullYear(), end.getMonth(), end.getDate()));
	const t1 = end.getTime() - start.getTime();
	let t2 = d2.getTime() - d1.getTime();
	let t = t1 - t2;
	if (t < 0){
		t = Math.abs(t);
		t2 -= DAY_MS;
	}
	hours = Math.floor(t / HOUR_MS);
	t -= hours * HOUR_MS;
	minutes = Math.floor(t / MINUTE_MS);
	t -= minutes * MINUTE_MS;
	seconds = Math.floor(t / SECOND_MS);
	milliseconds = t - seconds * SECOND_MS;

	//========================== approach 4
	let y1 = d1.getFullYear(), m1 = d1.getMonth(), dd1 = d1.getDate();
	let y2 = d2.getFullYear(), m2 = d2.getMonth(), dd2 = d2.getDate();
	let skip = false;
	if (m1 === m2 && m1 === 1){
		let end1 = new Date(y1, 2, 0).getDate();
		let end2 = new Date(y2, 2, 0).getDate();
		if (dd1 === end1 && dd2 < end1){
			dd1 = 28;
			dd2 = 28;
			skip = true;
		}
	}
	if (!skip){
		if (dd1 > 1){
			let d = new Date(y1, m1 + 1, 0).getDate() - dd1;
			dd1 = 1;
			if (m1 === 11){
				m1 = 0;
				y1 ++;
			}
			else m1 ++;
			d2 = new Date(y2, m2, dd2 + d);
			y2 = d2.getFullYear();
			m2 = d2.getMonth();
			dd2 = d2.getDate();
		}
		days = dd2;
	}
	if (m2 < m1){
		m2 += 12;
		y2 --;
	}
	months = m2 - m1;
	years = y2 - y1;

	//========================== approach 3
	// const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	// let y1 = d1.getFullYear(), m1 = d1.getMonth(), dd1 = d1.getDate();
	// let y2 = d2.getFullYear(), m2 = d2.getMonth(), dd2 = d2.getDate();
	// if (m1 === m2 && m1 === 1 && dd1 === 29 && dd2 === 28) dd1 = 28;
	// if (!(y1 % 4) && (m1 < 1 || m1 === 1 && dd1 < 19)) days ++;
	// console.log('[1]', {y2, m2, dd2, y1, m1, dd1, days});
	// if (dd1 === new Date(y1, m1 + 1, 0).getDate() || (dd1 + days) === new Date(y1, m1 + 1, 0).getDate()){
	// 	days = dd2;
	// 	if (!m2){
	// 		m2 = 11;
	// 		y2 --;
	// 	}
	// 	else m2 --;
	// }
	// else if (dd2 < dd1){
	// 	let m = 0;
	// 	if (dd2 === 1){
	// 		m ++;
	// 		// m2 ++;
	// 	}
	// 	while (dd2 < dd1){
	// 		m ++;
	// 		if (!m2){
	// 			m2 = 11;
	// 			y2 --;
	// 		}
	// 		else m2 --;
	// 		const carry = m2 === 1 ? new Date(y2, 2, 0).getDate() : MONTH_DAYS[m2];
	// 		dd2 += carry
	// 		console.log({dd2, m2, carry});
	// 	}
	// 	days = dd2 - dd1;
	// 	const dt = new Date(y2, m2 - m, days);
	// 	//// days = dd2 = new Date(y1, m1 + 1, 0).getDate() - dd1 + dd2;
	// 	// if (!m2){
	// 	// 	m2 = 11;
	// 	// 	y2 --;
	// 	// }
	// 	// else m2 --;
	// 	console.log({dtm: dt.getMonth(), dty: dt.getFullYear(), dtd: dt.getDate(), m2, y2, days});
	// 	m2 = dt.getMonth();
	// 	y2 = dt.getFullYear();
	// }
	// else days = dd2 - dd1;
	// console.log('[2]', {y2, m2, dd2, y1, m1, dd1});
	// d2 = new Date(y2, m2, dd2);
	// m2 = d2.getMonth();
	// y2 = d2.getFullYear();
	// console.log('[3]', {y2, m2, dd2, y1, m1, dd1});

	// // while (dd2 < dd1){
	// // 	if (!m2){
	// // 		m2 = 11;
	// // 		y2 --;
	// // 	}
	// // 	else m2 --;
	// // 	let m = m2 === 12 ? 11 : m2 % 12;
	// // 	const carry_days = m2 === 1 ? new Date(y2, 2, 0).getDate() : MONTH_DAYS[m2];
	// // 	dd2 += carry_days;
	// // }
	// // days = dd2 - dd1;
	// console.log('[a]', {years, months, days});
	// if (m2 < m1){
	// 	// let days1 = new Date(y2, m2 - 1, 0).getDate() + dd2;
	// 	// let days2 = new Date(y1, m1, 0).getDate() + dd1;
	// 	// console.log('[before]', {y2, m2});
	// 	m2 += 12;
	// 	y2 --;
	// 	// console.log('[after]', {y1, y2, m2, m1, dd2, dd1, carry_months: 12, days1, days2, d: days1 - days2});
	// }
	// months = m2 - m1;
	// years = y2 - y1;
	// console.log('[b]', {years, months, days});
	// let leaps = 0;
	// if (years) leaps = years >= 4 ? Math.floor(years/4) : years <= (4 - (y1 % 4)) ? 1 : 0;
	// else leaps = !(y1 % 4) || !(y2 % 4) ? 1 : 0;
	// let leap_days = leaps;
	// if (!(y1 % 4) && (m1 > 1 || m1 === 1 && dd1 === 29)) leap_days --;
	// if (!(y2 % 4) && m2 <= 1) leap_days --;
	// console.log(`[+] ${y1}/${m1} - ${y2}/${m2} ~ years: ${years}, leaps: ${leaps}, leap_days: ${leap_days}, days: ${days}`);

	// 2004-05-29
	// 2005-03-01
	//-----------
	// 
	//-----------

	//========================== approach 2
	// //years, months, days
	// console.log(`[+] d1: ${_get_datetime(d1)}, d2: ${_get_datetime(d2)}`);
	// d2 = new Date(d1.getTime() + t2);
	// console.log(`[+] d1: ${_get_datetime(d1)}, d2: ${_get_datetime(d2)}`);
	// const y1 = d1.getFullYear(), y2 = d2.getFullYear();
	// const m1 = d1.getMonth(), m2 = d2.getMonth();
	// const dd1 = d1.getDate(), dd2 = d2.getDate();
	// years = y2 - y1;

	// // leap days
	// let leaps = 0;
	// if (years) leaps = years >= 4 ? Math.floor(years/4) : years <= (4 - (y1 % 4)) ? 1 : 0;
	// else leaps = !(y1 % 4) || !(y2 % 4) ? 1 : 0;
	// days += leaps;
	// if (!(y1 % 4) && (m1 > 1 || m1 === 1 && dd1 === 29)) days --;
	// if (!(y2 % 4) && m2 <= 1) days --;

	// // debug leap years
	// console.log('----');
	// ((a:number,b:number)=>{ let d = b - a; for (let i = 0; i < d && i < 20; i ++){ let y = a + i; let e = new Date(y, 2, 0).getDate(); let x = y % 4; if (!x) console.log(d, i, y, e, x); } })(y1,y2);
	// console.log('----');
	// console.log(`[+] ${y1} - ${y2} ~ years: ${years}, leap_days: ${leaps}, days: ${days}`);

	// // months, days
	// if (m1 === m2){
	// 	if (m1 === 1 && new Date(y1, m1 + 1, 0).getDate() === dd1 && new Date(y2, m2 + 1, 0).getDate() === dd2){
	// 		days = 0;
	// 	}
	// 	else days += dd2 - dd1;
	// }
	// else {
	// 	if (m2 > m1){
	// 		months = m2 - m1;
	// 		if (dd2 >= dd1) days += dd2 - dd1;
	// 		else {
	// 			if (dd1 === 1) days += dd2 - 1;
	// 			else {
	// 				months --;
	// 				days += new Date(y1, m1 + 1, 0).getDate() - dd1 + 1;
	// 				days += dd2 - 1;
	// 			}
	// 		}
	// 	}
	// 	else {
	// 		years --;
	// 		months = 12 - m1 + m2;
	// 		if (dd2 >= dd1) days += dd2 - dd1;
	// 		else {
	// 			if (dd1 === 1) days += dd2 - 1;
	// 			else {
	// 				months --;
	// 				days += new Date(y1, m1 + 1, 0).getDate() - dd1 + 1;
	// 				days += dd2 - 1;
	// 			}
	// 		}
	// 	}
	// 	if (expects){
	// 		const fails = [];
	// 		if (years !== expects.years) fails.push(`years: ${years} !== ${expects.years} (${Math.abs(expects.years - years)})`);
	// 		if (months !== expects.months) fails.push(`months: ${months} !== ${expects.months} (${Math.abs(expects.months - months)})`);
	// 		if (days !== expects.days) fails.push(`days: ${days} !== ${expects.days} (${Math.abs(expects.days - days)})`);
	// 		if (fails.length) console.log(`[FAILS]\n \\__ ${fails.join('\n \\__ ')}`);
	// 	}

	// 	//.. 1998-02-22, end: 2008-05-19
	// 	//.. 1998-03-01, end: 2008-05-01
	// 	//.. 29 - 22, 19 - 1
	// 	//.. 2000-03-29, end: 2001-01-28
	// }
	
	//========================== approach 1
	// if (d1.getMonth() === d2.getMonth() && d1.getMonth() === 1 && d1.getDate() === 29 && d2.getDate() === 28) d1.setDate(28);
	// if (d1.getDate() > d2.getDate()){
	// 	let e = new Date(d2.getFullYear(), d1.getMonth() + 1, 0).getDate();
	// 	let d = e - d1.getDate();
	// 	d1.setDate(1);
	// 	d1.setMonth(d1.getMonth() + 1);
	// 	d2 = new Date(d2.getFullYear(), d2.getMonth(), 1 + d2.getDate() + d);
	// 	// d2.setDate(d2.getDate() + d);
	// 	console.log(`[==========] D1: ${_get_datetime(d1)}, D2: ${_get_datetime(d2)}`, {e, d, x: (d2.getFullYear() % 4)});
	// }
	// days = d2.getDate() - d1.getDate();
	// console.log(`[1] D2: ${_get_datetime(d2)}`);
	// console.log('[1] ', JSON.stringify({years, months, days, hours, minutes, seconds, milliseconds}));
	// if (days < 0){
	// 	let d = new Date(d1.getFullYear(), d1.getMonth() + 1, 0).getDate() - d1.getDate();
	// 	d += d2.getDate();
	// 	d2 = new Date(d2.getFullYear(), d2.getMonth() - 1, d);
	// 	const xx = new Date(d1.getFullYear(), d2.getMonth(), d).getDate();
	// 	console.debug({days, d, dd: d2.getDate(), xx});
	// 	days = d2.getDate();
	// 	//-----
	// 	// let m = d2.getMonth();
	// 	// while (days < 0){
	// 	// 	const d = new Date(d2.getFullYear(), m, 0).getDate();
	// 	// 	const p = days;
	// 	// 	days += d;
	// 	// 	console.log('-----', [m, d, p, days]);
	// 	// 	m --;
	// 	// }
	// 	// d2 = new Date(d2.getFullYear(), m, days);
	// 	//-----
	// 	// days += new Date(d2.getFullYear(), d2.getMonth() + 1, 0).getDate();
	// 	// console.log('[xxx] ', _get_datetime(new Date(d2.getFullYear(), d2.getMonth(), d2.getDate() + days)));
	// 	// let m = d2.getMonth(), carry_days = 0;
	// 	// while (carry_days < Math.abs(days)){
	// 	// 	const borrow = new Date(d2.getFullYear(), m, 0).getDate();
	// 	// 	carry_days += borrow;
	// 	// 	// console.log({bd: _get_datetime(new Date(d2.getFullYear(), m, 0)), m, borrow, carry_days, days});
	// 	// 	m --;
	// 	// }
	// 	// // let carry_days = new Date(d2.getFullYear(), d2.getMonth(), 0).getDate();
	// 	// days += carry_days;
	// 	// // console.log({carry_days, m, days, end: new Date(d2.getFullYear(), m, days).getDate()});
	// 	// // d2 = new Date(d2.getFullYear(), d2.getMonth() - 1, days);
	// 	// d2 = new Date(d2.getFullYear(), m, days);
	// }
	// months = d2.getMonth() - d1.getMonth();
	// years = d2.getFullYear() - d1.getFullYear();
	// console.log(`[2] D2: ${_get_datetime(d2)}`);
	// console.log('[2] ', JSON.stringify({years, months, days, hours, minutes, seconds, milliseconds}));
	// if (months < 0){
	// 	months += 12;
	// 	years --;
	// }
	// console.log('[3] ', JSON.stringify({years, months, days, hours, minutes, seconds, milliseconds}));
	return {years, months, days, hours, minutes, seconds, milliseconds};
};

// main
(async () => {

	// parse arguments to dates: [start] [end]
	const args = process.argv.slice(2);
	if (args.length === 2){
		let start = _parse_date(args[0]);
		let end = _parse_date(args[1]);
		return _elapsed(start, end);
	}
	
	// run tests
	const tests: [string, string, {years: number, months: number, days: number}][] = [
		['1998-02-22', '2008-05-19', { years: 10, months: 2, days: 27 }],
		['2004-05-31', '2005-03-01', { years: 0, months: 9, days: 1 }],
		['2000-02-29', '2001-02-28', { years: 1, months: 0, days: 0 }],
		['2003-03-23', '2000-01-30', { years: 3, months: 1, days: 23 }],
		['2004-05-28', '2005-03-01', { years: 0, months: 9, days: 1 }],
		['2004-05-29', '2005-03-01', { years: 0, months: 9, days: 1 }],
		['2004-05-30', '2005-03-01', { years: 0, months: 9, days: 1 }],
		['0005-03-01', '2004-05-31', { years: 1999, months: 2, days: 30 }],
		['0005-03-01', '8004-05-31', { years: 7999, months: 2, days: 30 }],
	];
	tests.forEach(([start, end, expects]) => {
		const elapsed = _elapsed(start, end, expects);
		// const elapsed = _elapsed(start, end);
		const pass = elapsed.years === expects.years && elapsed.months === expects.months && elapsed.days === expects.days;
		const {years, months, days} = elapsed;
		let log = (pass ? '[+] ' : '[-] ') + `start: ${start}, end: ${end}:`;
		log += `\n \\__ elapsed: ${JSON.stringify({years, months, days})}`;
		log += `\n \\__ expects: ${JSON.stringify(expects)}`;
		if (!pass) console.log(log);
		// console.log(log);
	});
})()
.catch((err: any) => console.error('[-] ' + String(err)));

// npx ts-node test/z__test.xx.ts "1998-02-22 00:00:00" "2008-05-19 00:00:00"