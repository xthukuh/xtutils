/**
 * Sort direction type
 */
export type SortDirection = 1 | -1 | 'asc' | 'desc' | 'ascending' | 'descending';
/**
 * Sort order type
 */
export type SortOrder = SortDirection | {
    [key: string]: SortDirection;
};
/**
 * Sort array values
 *
 * @param array
 * @param sort
 * @returns Sorted `array`
 */
export declare const _sortValues: <T extends unknown>(array: T[], sort?: SortOrder) => T[];
