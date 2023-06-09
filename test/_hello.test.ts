import { _sayHello } from '../lib';
import { _expectTestData } from './__utils';

const _original = console.log;
const results = ['[x] - Hello Thuku!', '[x] - Hello Martin!'];

beforeAll(() => {
	console.log = jest.fn().mockImplementation(()=>{});
});

afterAll(() => {
	console.debug('after-calls', (console.log as jest.Mock).mock.calls);
	// expect((console.log as jest.Mock).mock.calls).toEqual([[results[0]], [results[1]]]);
	console.log = _original;
});

//tests
describe("Test call arguments... \`_sayHello:(name?:string)=>string\`", () => {
	_expectTestData('_sayHello', _sayHello, [
		{
			text: 'No arguments',
			code: '',
			args: [],
			result: results[0],
		},
		{
			text: 'No arguments',
			code: 'Martin',
			args: ['Martin'],
			result: results[1],
		},
	]);
});