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

	// calculate the difference
	let years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0;
	const d1 = new Date(start.getFullYear(), start.getMonth(), start.getDate());
	let d2 = new Date(end.getFullYear(), end.getMonth(), end.getDate());
	
	// difference: hours, minutes, seconds, milliseconds
	const t1 = end.getTime() - start.getTime();
	let t2 = d2.getTime() - d1.getTime();
	let ms = t1 - t2;
	if (ms < 0){
		ms += DAY_MS;
		d2 = new Date(end.getFullYear(), end.getMonth(), end.getDate() - 1);
	}
	hours = Math.floor(ms / HOUR_MS);
	ms -= hours * HOUR_MS;
	minutes = Math.floor(ms / MINUTE_MS);
	ms -= minutes * MINUTE_MS;
	seconds = Math.floor(ms / SECOND_MS);
	milliseconds = ms - seconds * SECOND_MS;
	console.log({hours, minutes, seconds, milliseconds});
	
	// difference: years, months, days
	const _dump = (tag: string, val: {days:number,months:number,years:number}, extra?: any) => {
		const buffer: string[] = [];
		let pass: any = expects ? true : null;
		for (const [k, v] of Object.entries(val)){
			const x = (expects as any)?.[k];
			if (x !== v){
				if (pass) pass = false;
				buffer.push(`${k}: (${v} <> ${x} ~ ${x - v})`);
			}
			else buffer.push(`${k}: ${v}`);
		}
		const log = `${tag}[${pass ? 'PASS' : 'FAIL'}] {${buffer.join(', ')}}`;
		console.log(...[log].concat(extra ? [extra] : []));
	};
	// ['1998-02-22', '2008-05-19', { years: 10, months: 2, days: 27 }],
	// ['2004-05-31', '2005-03-01', { years: 0, months: 9, days: 1 }],
	// ['2000-02-29', '2001-02-28', { years: 1, months: 0, days: 0 }],
	// ['2003-03-23', '2000-01-30', { years: 3, months: 1, days: 23 }],
	// ['2004-05-28', '2005-03-01', { years: 0, months: 9, days: 1 }],
	// ['2004-05-29', '2005-03-01', { years: 0, months: 9, days: 1 }],
	// ['2004-05-30', '2005-03-01', { years: 0, months: 9, days: 1 }],
	// ---------------------------------------------------------------
	// Jan Feb   Mar Apr May Jun Jul Aug Sep Oct Nov Dec
	// 0   1     2   3   4   5   6   7   8   9   10  11
	// 31  28/29 31  30  31  30  31  31  30  31  30  31
	// ---------------------------------------------------------------
	let y1 = d1.getFullYear(), m1 = d1.getMonth(), dd1 = d1.getDate();
	let y2 = d2.getFullYear(), m2 = d2.getMonth(), dd2 = d2.getDate();
	console.log('[i] ', {y1, m1, dd1});
	console.log('[i] ', {y2, m2, dd2});
	if (m1 === m2 && m1 === 1 && dd1 === 29 && dd2 === 28 && dd2 === new Date(y2, 2, 0).getDate()){
		dd1 = 28;
		console.log('[Feb-std] ', {odd1: d1.getMonth(), dd1, dd2});
	}
	if (y2 > y1){
		if (m2 > m1){
			if (dd1 === 1){
				days = dd2 - 1;
				months = m2 - m1;
				years = y2 - y1;
				_dump('[m2 > m1](dd1 === 1) ---', {days, months, years});
			}
			else if (dd2 > dd1){
				days = dd2 - dd1;
				months = m2 - m1;
				years = y2 - y1;
				_dump('[m2 > m1](dd2 > dd1) ---', {days, months, years});
			}
			else if (dd2 < dd1){
				let dp = Math.floor((new Date(y1, m1 + 1, 1).getTime() - d1.getTime())/DAY_MS);
				let d = Math.floor((new Date(y2, m1 + 1, 1).getTime() - new Date(y2, m1, dd1).getTime())/DAY_MS);
				const dx = dd2 > 1 ? dd2 - 1 : 0;
				console.log('#[m2 > m1](dd2 < dd1)[0]', {dp, d, dx, ddx: d + dx});
				d = dx + d;
				if ((m1 < 1 || m1 === 1 && dd1 < 28) && !(y1 % 4)){
					if (m2 > 1 || m2 === 1 && dd2 === 29){
						const n = !(y2 % 4) ? 0 : -1;
						d += n;
						console.log('##[m2 > m1](dd2 < dd1)[1]', {d, n});
					}
				}
				else if ((m2 > 1 || m2 === 1 && dd2 === 29) && !(y2 % 4)) d ++;
				console.log('###[m2 > m1](dd2 < dd1)[1]', {d});
				days = d;
				if ((months = m2 - new Date(y1, m1 + 1, 1).getMonth()) < 0){
					y2 --;
					months += 12;
				}
				years = y2 - y1;
				_dump('[m2 > m1](dd2 < dd1) ---', {days, months, years});
			}
			else {
				days = 0;
				months = m2 - m1;
				years = y2 - y1;
				_dump('[m2 > m1](dd2 === dd1) ---', {days, months, years});
			}
		}
		else if (m2 < m1){
			if (dd1 === 1){
				years = y2 - (y1 + 1);
				months = 12 - m1 + m2;
				days = dd2 - 1;
				_dump('[m2 < m1](dd1 === 1) ---', {days, months, years});
			}
			else if (dd2 > dd1){
				years = y2 - (y1 + 1);
				months = 12 - m1 + m2;
				days = dd2 - dd1;
				_dump('[m2 < m1](dd2 > dd1) ---', {days, months, years});
			}
			else if (dd2 < dd1){
				const e1 = new Date(y1, m1, 0).getDate();
				const e2 = new Date(y2, m2, 0).getDate();
				let d = 0;
				let dp = Math.floor((new Date(y1, m1 + 1, 1).getTime() - d1.getTime())/DAY_MS);
				if (dd1 > e1 && dd1 > e2) d = 1;
				else if (dd1 > e2) d = (e1 - dd1) || 1;
				else d = (e2 - dd1) || 1;
				const dx = dd2 > 1 ? dd2 - 1 : 0;
				console.log('@[m2 < m1](dd2 < dd1)[0]', {hh: dd1 > e2, e1, e2, dp, d, dx, ddx: d + dx});
				d = dx + d;
				if ((m1 < 1 || m1 === 1 && dd1 < 28) && !(y1 % 4)){
					if (m2 > 1 || m2 === 1 && dd2 === 29){
						const n = !(y2 % 4) ? 0 : -1;
						d += n;
						console.log('@@[m2 < m1](dd2 < dd1)[1]', {d, n});
					}
				}
				else if ((m2 > 1 || m2 === 1 && dd2 === 29) && !(y2 % 4)) d ++;
				console.log('@@@[m2 < m1](dd2 < dd1)[1]', {d});
				days = d;
				if ((months = m2 - new Date(y1, m1 + 1, 1).getMonth()) < 0){
					y2 --;
					months += 12;
				}
				years = y2 - y1;
				_dump('[m2 < m1](dd2 < dd1) ---', {days, months, years});
			}
			else {
				days = 0;
				months = 12 - m1 + m2;
				years = y2 - (y1 + 1);
				_dump('[m2 < m1](dd2 === dd1) ---', {days, months, years});
			}
		}
		else {
			if (dd2 >= dd1){
				years = y2 - y1;
				months = 0;
				days = dd2 - dd1;
				_dump('[m2 === m1](dd2 >= dd1) ---', {days, months, years});
			}
			else {
				// 1, 10 = 10 - 1 = 9;
				let d = new Date(y1, m1 + 1, 0).getDate() - dd1;
				let dd = 31 + dd2 - dd1;
				console.debug('[m2 === m1](dd2 < dd1)[0]',{d, dd, mm: 11, days: d + dd2});
				months = 12 - new Date(y1, m1 + 1, 1).getMonth() + m2;
				years = y2 - (y1 + 1);
				days = d + dd2;
				_dump('[m2 === m1](dd2 < dd1) ---', {days, months, years});
			}
		}
	}
	else {
		years = 0;
		months = m2 - m1;
		days = dd2 - dd1;
		_dump('[y1 === y2] ---', {days, months, years});
	}
	/*
	// -------------------------------------------------------------------------------------------------------
	if (m1 === m2){
		days = dd2 - dd1;
		years = y2 - y1;
	}
	else {
		if (dd2 < dd1){
			let m = 1
			let d = 0;
			while (new Date(y2, m2 - m + 1, 0).getDate() < dd1){
				d += new Date(y2, m2 - m + 1, 0).getDate();
				m ++;
			}
			console.log({d, m});
			const dt1 = new Date(y2, m2 - m, dd1);
			const dt2 = new Date(y2, m2, dd2);
			const t1 = dt2.getTime() - dt1.getTime();
			const t2 = t1 - (d * DAY_MS);
			const ddd = t1 - t2;
			console.log('[++]', {t1, t2, d: ddd/DAY_MS});
		}
		if (dd1 !== dd2){
			if (dd1 === 1) days = dd2;
			else {
				const end1 = new Date(y1, m1 + 1, 0).getDate();
				if (dd1 === end1){
					const py1 = y1, pm1 = m1, pdd1 = dd1;
					const dt = new Date(y1, m1 + 1, 1);
					dd1 = dt.getDate();
					m1 = dt.getMonth();
					y1 = dt.getFullYear();
					const dump0 = {py1, y1, pm1, m1, pdd1, dd1};
					console.log(`[~] next start:` + Object.entries(dump0).map(v => `${v[0]}: ${v[1]}`).join(', '));
					days += 1;
				}
				if (dd1 !== dd2){
					if (dd2 === 1){
						const py2 = y2, pm2 = m2, pdd2 = dd2;
						const dt = new Date(y2, m2, 0);
						dd2 = dt.getDate();
						m2 = dt.getMonth();
						y2 = dt.getFullYear();
						if (m2 === 1 && dd1 === 29 && dd2 < dd1) dd2 = 29;
						const dump0 = {py2, y2, pm2, m2, pdd2, dd2};
						console.log(`[~] prev end:` + Object.entries(dump0).map(v => `${v[0]}: ${v[1]}`).join(', '));
						days += 1;
					}
					if (dd2 < dd1){
						// if (dd2 === 1){
						// 	days += (new Date(y1, m1 + 1, 0).getDate() - dd1);
						// 	months --;
						// }
						// else {
							const leap1 = !(y1 % 4) && (m1 < 1 || m1 === 1 && dd1 < 29);
							const diff = dd1 - dd2;
							let x = 0, m = 0;
							do {
								const mm = m2 - m;
								let md = new Date(y2, mm, 0).getDate();
								if (mm === 2 && leap1 && md < 29) md = 29;
								x = md - diff;
								m ++;
							}
							while (x < 0);
							const x2 = m1 < m2 ? x + 1 : x;
							const dump1 = {diff, x, x2, m, m2, mm2: new Date(y1, m2 - m, 1).getMonth(), y2, yy2: new Date(y1, m2 - m, 1).getFullYear()};
							console.log(`[~] ` + Object.entries(dump1).map(v => `${v[0]}: ${v[1]}`).join(', '));
							let carry = 0, carry2 = 0, cm = 0;
							while (carry < diff){
								const mm = m2 - cm;
								const c = new Date(y2, mm, 0).getDate();
								carry += c;
								carry2 += (mm === 2 && leap1) ? new Date(y1, 2, 0).getDate() : c;
								cm ++;
							}
							const carry_diff1 = carry - diff;
							const carry_diff2 = carry2 - diff;
							const cdd1 = new Date(y2, m2 - cm, carry_diff1).getDate();
							const cdd2 = new Date(y2, m2 - cm, carry_diff2).getDate();
							const cdd3 = new Date(y2, m2 - cm, carry_diff2 + 1).getDate();
							const dump2 = {diff, carry, carry2, carry_diff1, carry_diff2, cm, cdd1, cdd2, cdd3};
							console.log(`[~] ` + Object.entries(dump2).map(v => `${v[0]}: ${v[1]}`).join(', '));
							
							// const ds = new Date(y1, m1, 1);
							const first_end = new Date(y2, m1 + 1, 0).getDate();
							const d = first_end - dd1;
							const last_end = new Date(y2, m2, 0).getDate();
							const de = new Date(y2, m2, dd2 - dd1);
				
							// const x = new Date(y1, m2 - 1, d + dd2 - 1).getDate()
							// m2 = de.getMonth();
							// y2 = de.getFullYear();
							days += de.getDate();
							if (days > last_end){
								m1 ++;
								days = days - last_end;
							}
							months --;
							const dump3 = {diff: dd1 - dd2, days, d, dd2, first_end, last_end, fld: last_end - first_end};
							console.log(`[${m2 > m1 ? 'gt' : 'lt'}] ` + Object.entries(dump3).map(v => `${v[0]}: ${v[1]}`).join(', '));
						// }
					}
					else days += dd2 - dd1;
				}
			}
		}
		if ((months += m2 - m1) < 0){
			months += 12;
			y2 --;
		}
		years = y2 - y1;
	}
	// -------------------------------------------------------------------------------------------------------
	*/
	return {years, months, days, hours, minutes, seconds, milliseconds};
};

// npx ts-node test/z__test.ts

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
		// ['2000-02-29', '2001-02-28', { years: 1, months: 0, days: 0 }],
		['2003-03-23', '2000-01-30', { years: 3, months: 1, days: 23 }],
		['2004-05-28', '2005-03-01', { years: 0, months: 9, days: 1 }],
		['2004-05-29', '2005-03-01', { years: 0, months: 9, days: 1 }],
		['2004-05-30', '2005-03-01', { years: 0, months: 9, days: 1 }],
		// ['0005-03-01', '2004-05-31', { years: 1999, months: 2, days: 30 }],
		// ['0005-03-01', '8004-05-31', { years: 7999, months: 2, days: 30 }],
	];
	tests.forEach(([start, end, expects]) => {
		const elapsed = _elapsed(start, end, expects);
		// const elapsed = _elapsed(start, end);
		const pass = elapsed.years === expects.years && elapsed.months === expects.months && elapsed.days === expects.days;
		const {years, months, days} = elapsed;
		let log = (pass ? '[+] ' : '[-] ') + `start: ${start}, end: ${end}:`;
		log += `\n \\__ elapsed: ${JSON.stringify({years, months, days})}`;
		log += `\n \\__ expects: ${JSON.stringify(expects)}`;
		// if (!pass) console.log(log);
		console.log(log);
	});
})()
.catch((err: any) => console.error('[-] ' + String(err)));

// npx ts-node test/z__test.xx.ts "1998-02-22 00:00:00" "2008-05-19 00:00:00"