import { _date } from '../lib/utils/_datetime';
// interface ElapsedTime {
// 	years: number;
// 	months: number;
// 	days: number;
// 	hours: number;
// 	minutes: number;
// 	seconds: number;
// 	milliseconds: number;
// 	total_days: number;
// 	total_time: number;
// 	start_time: number;
// 	end_time: number;
// }

// function _elapsed(start: Date | number | string, end: Date | number | string): ElapsedTime {
// 	const startDate = parseDate(start);
// 	const endDate = parseDate(end);

// 	if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
// 			throw new TypeError('Invalid date');
// 	}

// 	const startTime = startDate.getTime();
// 	const endTime = endDate.getTime();
// 	const [tempStart, tempEnd] = startTime <= endTime ? [startDate, endDate] : [endDate, startDate];

// 	let currentDate = new Date(tempStart.getTime());
// 	let years = 0;

// 	// Calculate years
// 	while (true) {
// 			const nextYear = currentDate.getFullYear() + 1;
// 			const currentMonth = currentDate.getMonth();
// 			const isLastDay = isLastDayOfMonth(currentDate);
// 			const nextDay = isLastDay ? new Date(nextYear, currentMonth + 1, 0).getDate() : currentDate.getDate();
// 			const nextDate = new Date(nextYear, currentMonth, nextDay);
// 			if (nextDate > tempEnd) break;
// 			years++;
// 			currentDate = nextDate;
// 	}

// 	// Calculate months
// 	let months = 0;
// 	while (true) {
// 			const currentMonth = currentDate.getMonth();
// 			const nextMonth = currentMonth + 1;
// 			const nextYear = currentDate.getFullYear();
// 			const isLastDay = isLastDayOfMonth(currentDate);
// 			const nextDay = isLastDay ? new Date(nextYear, nextMonth + 1, 0).getDate() : currentDate.getDate();
// 			const nextDate = new Date(nextYear, nextMonth, nextDay);
// 			if (nextDate > tempEnd) break;
// 			months++;
// 			currentDate = nextDate;
// 	}

// 	// Calculate days
// 	let days = 0;
// 	while (true) {
// 			const nextDay = currentDate.getDate() + 1;
// 			const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), nextDay);
// 			if (nextDate > tempEnd) break;
// 			days++;
// 			currentDate = nextDate;
// 	}

// 	// Calculate remaining time
// 	const remainingTime = tempEnd.getTime() - currentDate.getTime();
// 	const hours = Math.floor(remainingTime / 3600000);
// 	const remainingAfterHours = remainingTime % 3600000;
// 	const minutes = Math.floor(remainingAfterHours / 60000);
// 	const remainingAfterMinutes = remainingAfterHours % 60000;
// 	const seconds = Math.floor(remainingAfterMinutes / 1000);
// 	const milliseconds = remainingAfterMinutes % 1000;

// 	// Calculate totals
// 	const total_time = endTime - startTime;
// 	const total_days = Math.floor((tempEnd.getTime() - tempStart.getTime()) / 86400000);

// 	return {
// 			years,
// 			months,
// 			days,
// 			hours,
// 			minutes,
// 			seconds,
// 			milliseconds,
// 			total_days,
// 			total_time,
// 			start_time: startTime,
// 			end_time: endTime,
// 	};
// }

// function parseDate(input: Date | number | string): Date {
// 	if (input instanceof Date) return new Date(input.getTime());
// 	return new Date(input);
// }

// function isLastDayOfMonth(date: Date): boolean {
// 	const nextMonthFirstDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
// 	const lastDay = new Date(nextMonthFirstDay.getTime() - 86400000);
// 	return date.getDate() === lastDay.getDate();
// }

// =======================================================================================================

// interface ElapsedTime {
// 	years: number;
// 	months: number;
// 	days: number;
// 	hours: number;
// 	minutes: number;
// 	seconds: number;
// 	milliseconds: number;
// 	total_days: number;
// 	total_time: number;
// 	start_time: number;
// 	end_time: number;
// }

// function _elapsed(start: Date | number | string, end: Date | number | string): ElapsedTime {
// 	const startDate = parseDate(start);
// 	const endDate = parseDate(end);

// 	if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
// 			throw new TypeError('Invalid date');
// 	}

// 	const startTime = startDate.getTime();
// 	const endTime = endDate.getTime();
// 	const [tempStart, tempEnd] = startTime <= endTime ? [startDate, endDate] : [endDate, startDate];

// 	let currentDate = new Date(tempStart.getTime());
// 	let years = 0;

// 	// Calculate years
// 	while (true) {
// 			const currentYear = currentDate.getUTCFullYear();
// 			const currentMonth = currentDate.getUTCMonth();
// 			const nextYear = currentYear + 1;
// 			const isLastDay = isLastDayOfMonth(currentDate);
// 			const nextDay = isLastDay ? 
// 					new Date(Date.UTC(nextYear, currentMonth + 1, 0)).getUTCDate() : 
// 					currentDate.getUTCDate();
// 			const nextDate = new Date(Date.UTC(nextYear, currentMonth, nextDay));
// 			if (nextDate > tempEnd) break;
// 			years++;
// 			currentDate = nextDate;
// 	}

// 	// Calculate months
// 	let months = 0;
// 	while (true) {
// 			const currentYear = currentDate.getUTCFullYear();
// 			const currentMonth = currentDate.getUTCMonth();
// 			const nextMonth = currentMonth + 1;
// 			const isLastDay = isLastDayOfMonth(currentDate);
// 			const nextDay = isLastDay ? 
// 					new Date(Date.UTC(currentYear, nextMonth + 1, 0)).getUTCDate() : 
// 					currentDate.getUTCDate();
// 			const nextDate = new Date(Date.UTC(currentYear, nextMonth, nextDay));
// 			if (nextDate > tempEnd) break;
// 			months++;
// 			currentDate = nextDate;
// 	}

// 	// Calculate days
// 	let days = 0;
// 	while (true) {
// 			const currentYear = currentDate.getUTCFullYear();
// 			const currentMonth = currentDate.getUTCMonth();
// 			const currentDay = currentDate.getUTCDate();
// 			const nextDay = currentDay + 1;
// 			const nextDate = new Date(Date.UTC(currentYear, currentMonth, nextDay));
// 			if (nextDate > tempEnd) break;
// 			days++;
// 			currentDate = nextDate;
// 	}

// 	// Calculate remaining time
// 	const remainingTime = tempEnd.getTime() - currentDate.getTime();
// 	const hours = Math.floor(remainingTime / 3600000);
// 	const remainingAfterHours = remainingTime % 3600000;
// 	const minutes = Math.floor(remainingAfterHours / 60000);
// 	const remainingAfterMinutes = remainingAfterHours % 60000;
// 	const seconds = Math.floor(remainingAfterMinutes / 1000);
// 	const milliseconds = remainingAfterMinutes % 1000;

// 	// Calculate totals
// 	const total_time = endTime - startTime;
// 	const total_days = Math.floor((tempEnd.getTime() - tempStart.getTime()) / 86400000);

// 	return {
// 			years,
// 			months,
// 			days,
// 			hours,
// 			minutes,
// 			seconds,
// 			milliseconds,
// 			total_days,
// 			total_time,
// 			start_time: startTime,
// 			end_time: endTime,
// 	};
// }

// function parseDate(input: Date | number | string): Date {
// 	if (input instanceof Date) return new Date(input.getTime());
// 	return new Date(input);
// }

// function isLastDayOfMonth(date: Date): boolean {
// 	const nextMonthFirstDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
// 	const lastDay = new Date(nextMonthFirstDay.getTime() - 86400000);
// 	return date.getUTCDate() === lastDay.getUTCDate();
// }

// =======================================================================================================

interface ElapsedTime {
	years: number;
	months: number;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	milliseconds: number;
	total_days: number;
	total_time: number;
	start_time: number;
	end_time: number;
}

function _elapsed(start: Date | number | string, end: Date | number | string): ElapsedTime {
	const startDate = parseDate(start);
	const endDate = parseDate(end);

	if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
			throw new TypeError('Invalid date');
	}
	console.log([startDate.toISOString(), endDate.toISOString()]);

	const startTime = startDate.getTime();
	const endTime = endDate.getTime();
	const [tempStart, tempEnd] = startTime <= endTime ? [startDate, endDate] : [endDate, startDate];

	let currentDate = new Date(tempStart.getTime());
	let years = 0;

	// Calculate years
	while (true) {
			const currentYear = currentDate.getUTCFullYear();
			const currentMonth = currentDate.getUTCMonth();
			const currentDay = currentDate.getUTCDate();
			const nextYear = currentYear + 1;

			// Create ISO string for next year's date
			const isoMonth = String(currentMonth + 1).padStart(2, '0');
			const isoDay = String(currentDay).padStart(2, '0');
			const isoString = `${nextYear}-${isoMonth}-${isoDay}`;
			let nextDate = new Date(isoString);

			// Check if the month rolled over due to invalid day
			if (nextDate.getUTCMonth() !== currentMonth) {
					nextDate = new Date(Date.UTC(nextYear, currentMonth + 1, 0));
			}

			if (nextDate > tempEnd) break;
			years++;
			currentDate = nextDate;
	}

	// Calculate months
	let months = 0;
	while (true) {
			const currentYear = currentDate.getUTCFullYear();
			const currentMonth = currentDate.getUTCMonth();
			const currentDay = currentDate.getUTCDate();
			const nextMonth = currentMonth + 1;
			const nextYear = currentYear;

			// Create ISO string for next month's date
			const isoMonth = String(nextMonth + 1).padStart(2, '0'); // Months are 0-based in JS
			const isoDay = String(currentDay).padStart(2, '0');
			const isoString = `${nextYear}-${isoMonth}-${isoDay}`;
			let nextDate = new Date(isoString);

			// Check if the month rolled over (e.g., Jan 31 -> March 3)
			if (nextDate.getUTCMonth() !== (nextMonth % 12)) {
					nextDate = new Date(Date.UTC(nextYear, nextMonth + 1, 0));
			}

			if (nextDate > tempEnd) break;
			months++;
			currentDate = nextDate;
	}

	// Calculate days
	let days = 0;
	while (true) {
			const currentYear = currentDate.getUTCFullYear();
			const currentMonth = currentDate.getUTCMonth();
			const currentDay = currentDate.getUTCDate();
			const nextDay = currentDay + 1;

			// Create ISO string for next day
			const isoMonth = String(currentMonth + 1).padStart(2, '0');
			const isoDay = String(nextDay).padStart(2, '0');
			const isoString = `${currentYear}-${isoMonth}-${isoDay}`;
			const nextDate = new Date(isoString);

			if (nextDate > tempEnd) break;
			days++;
			currentDate = nextDate;
	}

	// Calculate remaining time
	const remainingTime = tempEnd.getTime() - currentDate.getTime();
	const hours = Math.floor(remainingTime / 3600000);
	const remainingAfterHours = remainingTime % 3600000;
	const minutes = Math.floor(remainingAfterHours / 60000);
	const remainingAfterMinutes = remainingAfterHours % 60000;
	const seconds = Math.floor(remainingAfterMinutes / 1000);
	const milliseconds = remainingAfterMinutes % 1000;

	// Calculate totals
	const total_time = endTime - startTime;
	const total_days = Math.floor((tempEnd.getTime() - tempStart.getTime()) / 86400000);

	return {
			years,
			months,
			days,
			hours,
			minutes,
			seconds,
			milliseconds,
			total_days,
			total_time,
			start_time: startTime,
			end_time: endTime,
	};
}

function parseDate(input: Date | number | string): Date {
	if (input instanceof Date) return new Date(input.getTime());
	return new Date(input);
}

// =======================================================================================================

// interface ElapsedTime {
// 	years: number;
// 	months: number;
// 	days: number;
// 	hours: number;
// 	minutes: number;
// 	seconds: number;
// 	milliseconds: number;
// 	total_days: number;
// 	total_time: number;
// 	start_time: number;
// 	end_time: number;
// }

// function _elapsed(start: Date | number | string, end: Date | number | string): ElapsedTime {
// 	const startDate = parseDate(start);
// 	const endDate = parseDate(end);

// 	if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
// 			throw new TypeError('Invalid date');
// 	}

// 	const startTime = startDate.getTime();
// 	const endTime = endDate.getTime();
// 	const [tempStart, tempEnd] = startTime <= endTime ? [startDate, endDate] : [endDate, startDate];

// 	let currentDate = new Date(tempStart.getTime());

// 	// Calculate years efficiently
// 	let years = tempEnd.getUTCFullYear() - tempStart.getUTCFullYear();
// 	let candidateDate = new Date(tempStart.getTime());
// 	candidateDate.setUTCFullYear(tempStart.getUTCFullYear() + years);
// 	adjustToValidMonthDay(candidateDate, tempStart.getUTCDate());
// 	if (candidateDate > tempEnd) {
// 			years--;
// 			candidateDate = new Date(tempStart.getTime());
// 			candidateDate.setUTCFullYear(tempStart.getUTCFullYear() + years);
// 			adjustToValidMonthDay(candidateDate, tempStart.getUTCDate());
// 	}
// 	currentDate = candidateDate;

// 	// Calculate months
// 	let months = 0;
// 	while (true) {
// 			const nextMonth = currentDate.getUTCMonth() + 1;
// 			const nextYear = currentDate.getUTCFullYear();
// 			const nextDay = currentDate.getUTCDate();
// 			const isoMonth = String(nextMonth + 1).padStart(2, '0');
// 			const isoDay = String(nextDay).padStart(2, '0');
// 			const isoString = `${nextYear}-${isoMonth}-${isoDay}`;
// 			let nextDate = new Date(isoString);
// 			if (nextDate.getUTCMonth() !== nextMonth % 12) {
// 					nextDate = new Date(Date.UTC(nextYear, nextMonth + 1, 0));
// 			}
// 			if (nextDate > tempEnd) break;
// 			months++;
// 			currentDate = nextDate;
// 	}

// 	// Calculate days
// 	let days = 0;
// 	while (true) {
// 			const nextDay = currentDate.getUTCDate() + 1;
// 			const isoMonth = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
// 			const isoDay = String(nextDay).padStart(2, '0');
// 			const isoString = `${currentDate.getUTCFullYear()}-${isoMonth}-${isoDay}`;
// 			const nextDate = new Date(isoString);
// 			if (nextDate > tempEnd) break;
// 			days++;
// 			currentDate = nextDate;
// 	}

// 	// Calculate remaining time
// 	const remainingTime = tempEnd.getTime() - currentDate.getTime();
// 	const hours = Math.floor(remainingTime / 3600000);
// 	const remainingAfterHours = remainingTime % 3600000;
// 	const minutes = Math.floor(remainingAfterHours / 60000);
// 	const remainingAfterMinutes = remainingAfterHours % 60000;
// 	const seconds = Math.floor(remainingAfterMinutes / 1000);
// 	const milliseconds = remainingAfterMinutes % 1000;

// 	// Calculate totals
// 	const total_time = endTime - startTime;
// 	const total_days = Math.floor((tempEnd.getTime() - tempStart.getTime()) / 86400000);

// 	return {
// 			years,
// 			months,
// 			days,
// 			hours,
// 			minutes,
// 			seconds,
// 			milliseconds,
// 			total_days,
// 			total_time: Math.abs(total_time),
// 			start_time: startTime,
// 			end_time: endTime,
// 	};
// }

// function parseDate(input: Date | number | string): Date {
// 	return _date(input) as any;
// 	// if (input instanceof Date) return new Date(input.getTime());
// 	// if (typeof input === 'string') {
// 	// 		const isoRegex = /^(\d{4,})-(\d{2})-(\d{2})(T\d{2}:\d{2}:\d{2}(\.\d+)?Z)?$/;
// 	// 		const match = input.match(isoRegex);
// 	// 		if (match) {
// 	// 				const year = parseInt(match[1], 10);
// 	// 				const month = parseInt(match[2], 10) - 1;
// 	// 				const day = parseInt(match[3], 10);
// 	// 				return new Date(Date.UTC(year, month, day));
// 	// 		}
// 	// }
// 	// return new Date(input);
// }

// function adjustToValidMonthDay(date: Date, originalDay: number): void {
// 	if (date.getUTCDate() !== originalDay) {
// 			date.setUTCDate(0);
// 	}
// }

// =======================================================================================================

describe('_elapsed', () => {
	it('should calculate the elapsed duration between known expectations', () => {
		expect((({years, months, days})=>({years, months, days}))(_elapsed('1998-02-22', '2008-05-19'))).toStrictEqual({ years: 10, months: 2, days: 27 });
		expect((({years, months, days})=>({years, months, days}))(_elapsed('2004-05-31', '2005-03-01'))).toStrictEqual({ years: 0, months: 9, days: 1 });
		expect((({years, months, days})=>({years, months, days}))(_elapsed('2000-02-29', '2001-02-28'))).toStrictEqual({ years: 1, months: 0, days: 0 });
		expect((({years, months, days})=>({years, months, days}))(_elapsed('2003-03-23', '2000-01-30'))).toStrictEqual({ years: 3, months: 1, days: 23 });
		expect((({years, months, days})=>({years, months, days}))(_elapsed('2004-05-28', '2005-03-01'))).toStrictEqual({ years: 0, months: 9, days: 1 });
		expect((({years, months, days})=>({years, months, days}))(_elapsed('2004-05-29', '2005-03-01'))).toStrictEqual({ years: 0, months: 9, days: 1 });
		expect((({years, months, days})=>({years, months, days}))(_elapsed('2004-05-30', '2005-03-01'))).toStrictEqual({ years: 0, months: 9, days: 1 });
		// expect((({years, months, days})=>({years, months, days}))(_elapsed('0005-03-01', '2004-05-31'))).toStrictEqual({ years: 1999, months: 2, days: 30 });
		// expect((({years, months, days})=>({years, months, days}))(_elapsed('0005-03-01', '8004-05-31'))).toStrictEqual({ years: 7999, months: 2, days: 30 });

		// const tests = [
		// 	{ start: '1998-02-22', end: '2008-05-19', expects: { years: 10, months: 2, days: 27 } },
		// 	{ start: '2004-05-31', end: '2005-03-01', expects: { years: 0, months: 9, days: 1 } },
		// 	{ start: '2000-02-29', end: '2001-02-28', expects: { years: 1, months: 0, days: 0 } },
		// 	{ start: '2003-03-23', end: '2000-01-30', expects: { years: 3, months: 1, days: 23 } },
		// 	{ start: '2004-05-28', end: '2005-03-01', expects: { years: 0, months: 9, days: 1 } },
		// 	{ start: '2004-05-29', end: '2005-03-01', expects: { years: 0, months: 9, days: 1 } },
		// 	{ start: '2004-05-30', end: '2005-03-01', expects: { years: 0, months: 9, days: 1 } },
		// 	{ start: '0005-03-01', end: '2004-05-31', expects: { years: 1999, months: 2, days: 30 } },
		// 	{ start: '0005-03-01', end: '8004-05-31', expects: { years: 7999, months: 2, days: 30 } },
		// ];
		// tests.forEach((test) => {
		// 	const start = new Date(test.start);
		// 	const end = new Date(test.end);
		// 	const expectedDuration = test.expects;
		// 	const result = _elapsed(start, end);
		// 	expect(result.years).toEqual(expectedDuration.years);
		// 	expect(result.months).toEqual(expectedDuration.months);
		// 	expect(result.days).toEqual(expectedDuration.days);
		// });
	});

	it('should calculate the elapsed duration between two valid Date instances', () => {
		const start = new Date('2022-01-01T00:00:00.000Z');
		const end = new Date('2022-01-02T12:34:56.789Z');
		const expectedDuration = {
			years: 0,
			months: 0,
			days: 1,
			hours: 12,
			minutes: 34,
			seconds: 56,
			milliseconds: 789,
			total_days: 1,
			total_time: end.getTime() - start.getTime(),
			start_time: start.getTime(),
			end_time: end.getTime(),
			toString: expect.any(Function),
		};
		expect(_elapsed(start, end)).toEqual(expectedDuration);
	});

	it('should calculate the elapsed duration between a valid Date instance and a valid timestamp', () => {
		const start = new Date('2022-01-01T00:00:00.000Z');
		const end = 1641182096789; // 2022-01-03T03:54:56.789Z
		const expectedDuration = {
			years: 0,
			months: 0,
			days: 2,
			hours: 3,
			minutes: 54,
			seconds: 56,
			milliseconds: 789,
			total_days: 2,
			total_time: 186896789, // new Date(end).getTime() - start.getTime()
			start_time: start.getTime(),
			end_time: end,
			toString: expect.any(Function),
		};
		expect(_elapsed(start, end)).toEqual(expectedDuration);
	});

	it('should calculate the elapsed duration between two valid timestamps', () => {
		const start = 1640995200000; // 2022-01-01T00:00:00.000Z
		const end = 1641182096789; // 2022-01-03T03:54:56.789Z
		const expectedDuration = {
			years: 0,
			months: 0,
			days: 2,
			hours: 3,
			minutes: 54,
			seconds: 56,
			milliseconds: 789,
			total_days: 2,
			total_time: 186896789, // new Date(end).getTime() - new Date(start).getTime()
			start_time: start,
			end_time: end,
			toString: expect.any(Function),
		};
		expect(_elapsed(start, end)).toEqual(expectedDuration);
	});

	it('should throw a TypeError when an invalid start time value is provided', () => {
		expect(() => _elapsed('invalid', new Date())).toThrow(TypeError);
	});

	it('should throw a TypeError when an invalid end time value is provided', () => {
		expect(() => _elapsed(new Date(), 'invalid')).toThrow(TypeError);
	});
});

// npm run test z_elapsed.test.ts