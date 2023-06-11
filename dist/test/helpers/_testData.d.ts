/**
 * Test data item interface
 */
export interface ITestDataItem {
    text: string;
    code: string;
    args: any[];
    expected: any;
    returns?: string;
}
/**
 * Runs expect tests on function with data
 *
 * @param func  Handler function name
 * @param handler  Handler function
 * @param data  Test data items
 */
export declare const _expectTestDataFn: (func: string, handler: (...args: any[]) => any, data: ITestDataItem[]) => void;
