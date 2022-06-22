/**
 * Fluree returns duration as string (i.e 15ms)
 * This converts it to integer number of milliseconds
 * @param duration : duration in format of 15ms, 15s, 15m, 15h etc
 * @returns duration as number of milliseconds
 */
export function processDuration(duration: string): number {
  if (duration === null || duration === undefined) {
    return -1;
  } else if (duration.indexOf('ms') > 0) {
    return +duration.replace('ms', '');
  } else if (duration.indexOf('s') > 0) {
    return +duration.replace('s', '') * 1000;
  } else if (duration.indexOf('m') > 0) {
    return +duration.replace('m', '') * 1000 * 60;
  } else if (duration.indexOf('h') > 0) {
    return +duration.replace('h', '') * 1000 * 60 * 60;
  } else {
    return +duration;
  }
}
