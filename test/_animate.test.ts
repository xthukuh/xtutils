import {
	_animate,
	IAnimateOptions,
	IAnimation,
	ANIMATE_DEFAULT_EASING,
	_sleep,
} from '../lib';

describe('\n _animate', () => {
	let updateMock: jest.Mock;
	let beforeMock: jest.Mock;
	let afterMock: jest.Mock;

	beforeEach(() => {
		updateMock = jest.fn();
		beforeMock = jest.fn();
		afterMock = jest.fn();
	});

	test('should initialize properly', () => {
		const options: IAnimateOptions = {
			update: updateMock,
			easing: ANIMATE_DEFAULT_EASING,
			duration: 100,
		};
		const animation: IAnimation = _animate(options);
		expect(animation._debug).toBe(false);
		expect(animation.begun).toBe(false);
		expect(animation.paused).toBe(false);
		expect(animation.done).toBe(false);
	});

	test('should call update callback', async () => {
		const options: IAnimateOptions = {
			update: updateMock,
			easing: ANIMATE_DEFAULT_EASING,
			duration: 100,
		};
		const animation: IAnimation = _animate(options);
		animation.play();
		await _sleep(200);
		expect(updateMock).toHaveBeenCalled();
	});

	test('should call before callback', async () => {
		const options: IAnimateOptions = {
			update: updateMock,
			before: beforeMock,
			easing: ANIMATE_DEFAULT_EASING,
			duration: 100,
		};
		const animation: IAnimation = _animate(options);
		animation.play();
		await _sleep(200);
		expect(beforeMock).toHaveBeenCalled();
	});

	test('should call after callback', async () => {
		const options: IAnimateOptions = {
			update: updateMock,
			after: afterMock,
			easing: ANIMATE_DEFAULT_EASING,
			duration: 100,
		};
		const animation: IAnimation = _animate(options);
		animation.play();
		await _sleep(300);
		expect(afterMock).toHaveBeenCalled();
	});

	test('should autoplay and respect duration', async () => {
		const options: IAnimateOptions = {
			update: updateMock,
			easing: ANIMATE_DEFAULT_EASING,
			duration: 100,
			autoplay: true,
		};
		_animate(options);
		await _sleep(200);
		expect(updateMock).toHaveBeenCalledTimes(8);
		// expect(updateMock).toHaveBeenCalled();
    // expect(updateMock.mock.calls.length).toBeGreaterThanOrEqual(10);
	});

	test('should respect delay', async () => {
		const options: IAnimateOptions = {
			update: updateMock,
			easing: ANIMATE_DEFAULT_EASING,
			duration: 100,
			delay: 100,
			delayed: true,
		};
		const animation: IAnimation = _animate(options);
		animation.play();
		await _sleep(50);
		expect(updateMock).not.toHaveBeenCalled();
		await _sleep(400);
		expect(updateMock).toHaveBeenCalled();
	});

	test('should pause and resume', async () => {
		const options: IAnimateOptions = {
			update: updateMock,
			easing: ANIMATE_DEFAULT_EASING,
			duration: 100,
		};
		const animation: IAnimation = _animate(options);
		animation.play();
		animation.pause();
		await _sleep(50);
		expect(animation.paused).toBe(true);
		animation.resume();
		await _sleep(200);
		expect(animation.paused).toBe(false);
		expect(updateMock).toHaveBeenCalled();
	});

	test('should reset', async () => {
		const options: IAnimateOptions = {
			update: updateMock,
			easing: ANIMATE_DEFAULT_EASING,
			duration: 100,
		};
		const animation: IAnimation = _animate(options);
		animation.play();
		await _sleep(50);
		expect(updateMock).toHaveBeenCalled();
		animation.reset();
		expect(animation.begun).toBe(false);
		expect(animation.paused).toBe(false);
		expect(animation.done).toBe(false);
	});

	test('should abort', async () => {
		const options: IAnimateOptions = {
			update: updateMock,
			easing: ANIMATE_DEFAULT_EASING,
			duration: 100,
		};
		const animation: IAnimation = _animate(options);
		animation.play();
		animation.abort();
		expect(animation.done).toBe(true);
		expect(updateMock).not.toHaveBeenCalled();
	});
});
