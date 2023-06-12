/**
 * Get unique string of random characters (in lowercase)
 * 
 * @param {Number} length   specify generated string length (integer >= 1)
 * @returns {String}
 */

export function _getUid(length: number): string{
  const _uid = () => Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
  if (!(Number.isInteger(length) && length > 0 && Number.isFinite(length))) return _uid();
  let buffer = '';
  while (buffer.length < length) buffer += _uid();
  return buffer.substring(0, length);
}