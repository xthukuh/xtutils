import {

_isDate,
_date,
_time,
_dayName,
_monthName,
_dayStart,
_dayEnd,
_monthStart,
_monthEnd,
_yearStart,
_yearEnd,
_dateOnly,
_dayTime,
_datetime,
_datestr,
_timestr,
_parseIso,
_elapsed,
_duration,
} from '../lib/utils/_datetime';

describe('_isDate', () => {
	it('should return true for a valid Date instance', () => {
		expect(_isDate(new Date())).toBe(true);
	});

	it('should return false for an invalid Date instance', () => {
		expect(_isDate('2022-01-01')).toBe(false);
	});
});

describe('_date', () => {
	it('should parse a valid Date instance', () => {
		const date = new Date();
		expect(_date(date)).toEqual(date);
	});

	it('should parse a valid timestamp integer', () => {
		const timestamp = 1640995200000; // January 1, 2022
		const expectedDate = new Date(timestamp);
		expect(_date(timestamp)).toEqual(expectedDate);
	});

	it('should parse a valid datetime string', () => {
		const datetime = '2022-01-01T00:00:00.000Z';
		const expectedDate = new Date(datetime);
		expect(_date(datetime)).toEqual(expectedDate);
	});

	it('should return undefined for an invalid value', () => {
		expect(_date('invalid')).toBeUndefined();
	});
});

describe('_time', () => {
	it('should parse a valid Date instance and return the timestamp', () => {
		const date = new Date();
		const expectedTimestamp = date.getTime();
		expect(_time(date)).toEqual(expectedTimestamp);
	});

	it('should parse a valid timestamp integer and return the timestamp', () => {
		const timestamp = 1640995200000; // January 1, 2022
		expect(_time(timestamp)).toEqual(timestamp);
	});

	it('should parse a valid datetime string and return the timestamp', () => {
		const datetime = '2022-01-01T00:00:00.000Z';
		const expectedTimestamp = new Date(datetime).getTime();
		expect(_time(datetime)).toEqual(expectedTimestamp);
	});

	it('should return undefined for an invalid value', () => {
		expect(_time('invalid')).toBeUndefined();
	});
});

describe('_dayName', () => {
	it('should return the correct day name for a valid index', () => {
		expect(_dayName(0)).toEqual('Sunday');
		expect(_dayName(1)).toEqual('Monday');
		expect(_dayName(2)).toEqual('Tuesday');
		expect(_dayName(3)).toEqual('Wednesday');
		expect(_dayName(4)).toEqual('Thursday');
		expect(_dayName(5)).toEqual('Friday');
		expect(_dayName(6)).toEqual('Saturday');
	});
	it('should return the correct day name for a negative index', () => {
		expect(_dayName(-1)).toEqual('Saturday');
		expect(_dayName(-2)).toEqual('Friday');
		expect(_dayName(-3)).toEqual('Thursday');
		expect(_dayName(-4)).toEqual('Wednesday');
		expect(_dayName(-5)).toEqual('Tuesday');
		expect(_dayName(-6)).toEqual('Monday');
		expect(_dayName(-7)).toEqual('Sunday');
	});
	it('should return the correct day name for an index greater than 6', () => {
		expect(_dayName(7)).toEqual('Sunday');
		expect(_dayName(8)).toEqual('Monday');
		expect(_dayName(9)).toEqual('Tuesday');
		expect(_dayName(10)).toEqual('Wednesday');
		expect(_dayName(11)).toEqual('Thursday');
		expect(_dayName(12)).toEqual('Friday');
		expect(_dayName(13)).toEqual('Saturday');
	});
});

describe('_monthName', () => {
	it('should return the correct month name for a valid index', () => {
		expect(_monthName(0)).toEqual('January');
		expect(_monthName(1)).toEqual('February');
		expect(_monthName(2)).toEqual('March');
		expect(_monthName(3)).toEqual('April');
		expect(_monthName(4)).toEqual('May');
		expect(_monthName(5)).toEqual('June');
		expect(_monthName(6)).toEqual('July');
		expect(_monthName(7)).toEqual('August');
		expect(_monthName(8)).toEqual('September');
		expect(_monthName(9)).toEqual('October');
		expect(_monthName(10)).toEqual('November');
		expect(_monthName(11)).toEqual('December');
	});

	it('should return the correct month name for a negative index', () => {
		expect(_monthName(-1)).toEqual('December');
		expect(_monthName(-2)).toEqual('November');
		expect(_monthName(-3)).toEqual('October');
		expect(_monthName(-4)).toEqual('September');
		expect(_monthName(-5)).toEqual('August');
		expect(_monthName(-6)).toEqual('July');
		expect(_monthName(-7)).toEqual('June');
		expect(_monthName(-8)).toEqual('May');
		expect(_monthName(-9)).toEqual('April');
		expect(_monthName(-10)).toEqual('March');
		expect(_monthName(-11)).toEqual('February');
		expect(_monthName(-12)).toEqual('January');
	});

	it('should return the correct month name for an index greater than 11', () => {
		expect(_monthName(12)).toEqual('January');
		expect(_monthName(13)).toEqual('February');
		expect(_monthName(14)).toEqual('March');
		expect(_monthName(15)).toEqual('April');
		expect(_monthName(16)).toEqual('May');
		expect(_monthName(17)).toEqual('June');
		expect(_monthName(18)).toEqual('July');
		expect(_monthName(19)).toEqual('August');
		expect(_monthName(20)).toEqual('September');
		expect(_monthName(21)).toEqual('October');
		expect(_monthName(22)).toEqual('November');
		expect(_monthName(23)).toEqual('December');
	});
});

describe('_dayStart', () => {
	it('should parse a valid Date instance and return the start of the day', () => {
		const date = new Date('2022-01-01T12:34:56.789Z');
		const expected = new Date(2022, 0, 1, 0, 0, 0, 0);
		expect(_dayStart(date)).toEqual(expected);
	});

	it('should parse a valid datetime string and return the start of the day', () => {
		const datetime = '2022-01-01T12:34:56.789Z';
		const expected = new Date(2022, 0, 1, 0, 0, 0, 0);
		expect(_dayStart(datetime)).toEqual(expected);
	});

	it('should return the current day start when no value is provided', () => {
		const currentDate = new Date();
		const expected = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
		expect(_dayStart()).toEqual(expected);
	});
});

describe('_dayEnd', () => {
	it('should parse a valid Date instance and return the end of the day', () => {
		const date = new Date('2022-01-01T12:34:56.789Z');
		const expected = new Date(2022, 0, 1, 23, 59, 59, 999);
		expect(_dayEnd(date)).toEqual(expected);
	});

	it('should parse a valid datetime string and return the end of the day', () => {
		const datetime = '2022-01-01T12:34:56.789Z';
		const expected = new Date(2022, 0, 1, 23, 59, 59, 999);
		expect(_dayEnd(datetime)).toEqual(expected);
	});

	it('should return the current day end when no value is provided', () => {
		const currentDate = new Date();
		const expected = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59, 999);
		expect(_dayEnd()).toEqual(expected);
	});
});

describe('_monthStart', () => {
	it('should parse a valid Date instance and return the start of the month', () => {
		const date = new Date('2022-01-15T12:34:56.789Z');
		const expected = new Date(2022, 0, 1, 0, 0, 0, 0);
		expect(_monthStart(date)).toEqual(expected);
	});

	it('should parse a valid datetime string and return the start of the month', () => {
		const datetime = '2022-01-15T12:34:56.789Z';
		const expected = new Date(2022, 0, 1, 0, 0, 0, 0);
		expect(_monthStart(datetime)).toEqual(expected);
	});

	it('should return the current month start when no value is provided', () => {
		const currentDate = new Date();
		const expected = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
		expect(_monthStart()).toEqual(expected);
	});
});

describe('_monthEnd', () => {
	it('should parse a valid Date instance and return the end of the month', () => {
		const date = new Date('2022-01-15T12:34:56.789Z');
		const expected = new Date(2022, 0, 31, 23, 59, 59, 999);
		expect(_monthEnd(date)).toEqual(expected);
	});

	it('should parse a valid datetime string and return the end of the month', () => {
		const datetime = '2022-01-15T12:34:56.789Z';
		const expected = new Date(2022, 0, 31, 23, 59, 59, 999);
		expect(_monthEnd(datetime)).toEqual(expected);
	});

	it('should return the current month end when no value is provided', () => {
		const currentDate = new Date();
		const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
		const expectedEndOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), lastDayOfMonth, 23, 59, 59, 999);
		expect(_monthEnd()).toEqual(expectedEndOfMonth);
	});
});

describe('_yearStart', () => {
	it('should parse a valid Date instance and return the start of the year', () => {
		const date = new Date('2022-06-15T12:34:56.789Z');
		const expected = new Date(2022, 0, 1, 0, 0, 0, 0);
		expect(_yearStart(date)).toEqual(expected);
	});

	it('should parse a valid datetime string and return the start of the year', () => {
		const datetime = '2022-06-15T12:34:56.789Z';
		const expected = new Date(2022, 0, 1, 0, 0, 0, 0);
		expect(_yearStart(datetime)).toEqual(expected);
	});

	it('should return the current year start when no value is provided', () => {
		const currentDate = new Date();
		const expected = new Date(currentDate.getFullYear(), 0, 1);
		expect(_yearStart()).toEqual(expected);
	});
});

describe('_yearEnd', () => {
	it('should parse a valid Date instance and return the end of the year', () => {
		const date = new Date('2022-06-15T12:34:56.789Z');
		const expected = new Date(2022, 11, 31, 23, 59, 59, 999);
		expect(_yearEnd(date)).toEqual(expected);
	});

	it('should parse a valid datetime string and return the end of the year', () => {
		const datetime = '2022-06-15T12:34:56.789Z';
		const expected = new Date(2022, 11, 31, 23, 59, 59, 999);
		expect(_yearEnd(datetime)).toEqual(expected);
	});

	it('should return the current year end when no value is provided', () => {
		const currentDate = new Date();
		const expected = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59, 999);
		expect(_yearEnd()).toEqual(expected);
	});
});

describe('_dateOnly', () => {
	it('should parse a valid Date instance and return only the date part', () => {
		const date = new Date('2022-01-01T12:34:56.789Z');
		const expected = new Date(2022, 0, 1);
		expect(_dateOnly(date)).toEqual(expected);
	});

	it('should parse a valid datetime string and return only the date part', () => {
		const datetime = '2022-01-01T12:34:56.789Z';
		const expected = new Date(2022, 0, 1);
		expect(_dateOnly(datetime)).toEqual(expected);
	});

	it('should return the current date only when no value is provided', () => {
		const currentDate = new Date();
		const expectedDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
		expect(_dateOnly()).toEqual(expectedDateOnly);
	});
});

describe('_dayTime', () => {
	it('should parse a valid Date instance and return the time in milliseconds since midnight', () => {
		const date = new Date('2022-01-01T12:34:56.789Z');
		const expected = date.getTime() - new Date(2022, 0, 1).getTime();
		expect(_dayTime(date)).toEqual(expected);
	});

	it('should parse a valid datetime string and return the time in milliseconds since midnight', () => {
		const datetime = '2022-01-01T12:34:56.789Z';
		const expected = 56096789;
		expect(_dayTime(datetime)).toEqual(expected);
	});

	it('should return the current time in milliseconds since midnight when no value is provided', () => {
		const currentDate = new Date();
		const expected = currentDate.getHours() * 60 * 60 * 1000 + currentDate.getMinutes() * 60 * 1000 + currentDate.getSeconds() * 1000 + currentDate.getMilliseconds();
		expect(_dayTime()).toEqual(expected);
	});
});

describe('_datetime', () => {
	it('should parse a valid Date instance and return the datetime in "YYYY-MM-DD HH:mm:ss" format', () => {
		const date = new Date('2022-01-01T12:34:56.789Z');
		date.setMinutes(date.getMinutes() + date.getTimezoneOffset()); // adjust timezone offset
		const expected = '2022-01-01 12:34:56';
		expect(_datetime(date)).toEqual(expected);
	});

	it('should parse a valid datetime string and return the datetime in "YYYY-MM-DD HH:mm:ss" format', () => {
		const datetime = '2022-01-01T12:34:56.789Z';
		// const expected = '2022-01-01 12:34:56';
		const expected = '2022-01-01 15:34:56'; // timezone +3
		expect(_datetime(datetime)).toEqual(expected);
	});

	it('should return current timestamp value is undefined', () => {
		const expected = _datetime(new Date());
		expect(_datetime()).toEqual(expected);
	});

	it('strict mode should return an empty string when an invalid value is provided', () => {
		expect(_datetime('invalid', true)).toEqual('');
	});

	it('should parse "now" and return datetime in in "YYYY-MM-DD HH:mm:ss" format', () => {
		const expected = _datetime(new Date());
		expect(_datetime('now')).toEqual(expected);
	});

	it('should parse "today" and return datetime in in "YYYY-MM-DD HH:mm:ss" format', () => {
		const date = new Date();
		const expected = _datetime(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
		expect(_datetime('today')).toEqual(expected);
	});

	it('should parse "tomorrow" and return datetime in in "YYYY-MM-DD HH:mm:ss" format', () => {
		const date = new Date();
		const expected = _datetime(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1));
		expect(_datetime('tomorrow')).toEqual(expected);
	});

	it('should parse "yesterday" and return datetime in in "YYYY-MM-DD HH:mm:ss" format', () => {
		const date = new Date();
		const expected = _datetime(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1));
		expect(_datetime('yesterday')).toEqual(expected);
	});
});

describe('_datestr', () => {
	it('should parse a valid Date instance and return the date in "YYYY-MM-DD" format', () => {
		const date = new Date('2022-01-01T12:34:56.789Z');
		const expected = '2022-01-01';
		expect(_datestr(date)).toEqual(expected);
	});

	it('should parse a valid datetime string and return the date in "YYYY-MM-DD" format', () => {
		const datetime = '2022-01-01T12:34:56.789Z';
		const expected = '2022-01-01';
		expect(_datestr(datetime)).toEqual(expected);
	});

	it('hould return current date in "YYYY-MM-DD" format when value is undefined', () => {
		const expected = _datestr(new Date());
		expect(_datestr()).toEqual(expected);
	});
	
	it('should return an empty string when an invalid value is provided', () => {
		expect(_datestr('invalid', true)).toEqual('');
	});
});

describe('_timestr', () => {
	it('should parse a valid Date instance and return the time in "HH:mm:ss" format', () => {
		const date = new Date('2022-01-01T12:34:56.789Z');
		date.setMinutes(date.getMinutes() + date.getTimezoneOffset()); // adjust timezone offset
		const expected = '12:34:56';
		expect(_timestr(date)).toEqual(expected);
	});

	it('should parse a valid datetime string and return the time in "HH:mm:ss" format', () => {
		const datetime = '2022-01-01T12:34:56.789Z';
		const expected = '15:34:56'; // timezone +3
		expect(_timestr(datetime)).toEqual(expected);
	});

	it('hould return current time in "HH:mm:ss" format when value is undefined', () => {
		const expected = _timestr(new Date());
		expect(_timestr()).toEqual(expected);
	});

	it('should return an empty string when an invalid value is provided', () => {
		expect(_timestr('invalid')).toEqual('');
	});
});

describe('_parseIso', () => {
	it('should parse a valid ISO date string and return the timestamp in milliseconds', () => {
		const isoDate = '2022-12-19T13:12:42.000Z';
		const expectedTimestamp = 1671455562000;
		expect(_parseIso(isoDate)).toEqual(expectedTimestamp);
	});

	it('should return undefined when an invalid ISO date string is provided', () => {
		expect(_parseIso('invalid')).toBeUndefined();
	});
});

describe('_elapsed', () => {
	it('should calculate the elapsed duration between known expectations', () => {
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
		tests.forEach((test) => {
			const start = new Date(test.start);
			const end = new Date(test.end);
			const expectedDuration = test.expects;
			const result = _elapsed(start, end);
			expect(result.years).toEqual(expectedDuration.years);
			expect(result.months).toEqual(expectedDuration.months);
			expect(result.days).toEqual(expectedDuration.days);
		});
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

describe('_duration', () => {
	it('should calculate the duration between two valid Date instances', () => {
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
			total_time: 131696789,
			start_time: start.getTime(),
			end_time: end.getTime(),
			toString: expect.any(Function),
		};
		expect(_duration(start, end)).toEqual(expectedDuration);
	});

	it('should calculate the duration between a valid Date instance and a valid timestamp', () => {
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
			total_time: 186896789,
			start_time: start.getTime(),
			end_time: end,
			toString: expect.any(Function),
		};
		expect(_duration(start, end)).toEqual(expectedDuration);
	});

	it('should calculate the duration between two valid timestamps', () => {
		const start = 1641009296789; // 2022-01-01T03:54:56.789Z
		const end = 1641168000000; // 2022-01-03T00:00:00.000Z
		const expectedDuration = {
			years: 0,
			months: 0,
			days: 1,
			hours: 20,
			minutes: 5,
			seconds: 3,
			milliseconds: 211,
			total_days: 1,
			total_time: 158703211,
			start_time: start,
			end_time: end,
			toString: expect.any(Function),
		};
		expect(_duration(start, end)).toEqual(expectedDuration);
	});

	it('should throw a TypeError when an invalid start time value is provided', () => {
		expect(() => _duration('invalid', new Date())).toThrow(TypeError);
	});

	it('should throw a TypeError when an invalid end time value is provided', () => {
		expect(() => _duration(new Date(), 'invalid')).toThrow(TypeError);
	});
});