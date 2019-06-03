
export function displayStat($value, $label, { label, value, type}) {
    $label.text = label;
    $value.text = formatValue(value, type)
}

export function formatValue(value, type) {
    switch(type) {
        case 'number':
            return `${value}`;
        case "time": 
            return formatTime(value);
        case "distance": 
            return formatDistance(value);
        case "pace": 
            return formatPace(value);
    }
}

/** @description Add zero in front of numbers < 10.
 * @param {number} num The number to pad.
 * @return {string}
 */
export function zeroPad(num) {
  if (num < 10) {
    num = "0" + num;
  }
  return num;
}

/** @description String starts with a specific word.
 * @param {string} str The string to check.
 * @param {string} num The word to find at the beginning of the string.
 * @return {boolean}
 */
export function startsWith(str, word) {
  return str.lastIndexOf(word, 0) === 0;
}

/** @description Formats distance in meters into either miles or kilometers.
 * Returns an object containing a value and units.
 * @param {number} distance The distance travelled in meters.
 * @return {string}
 */
export function formatDistance(distance) {
  return distance.toFixed(0);
}

/** @description Formats distance in meters into either miles or kilometers.
 * Returns an object containing a value and units.
 * @param {number} pace The distance travelled in seconds per kilometer.
 * @return {string}
 */
export function formatPace(pace) {
  const pacePer100mInSeconds = pace / 10;
  const pacePer100mInmilliseconds = pacePer100mInSeconds * 1000;
  console.log('pace:' + pace);
  console.log('pacePer100mInSeconds:' + pacePer100mInSeconds);
  console.log('pacePer100mInmilliseconds:' + pacePer100mInmilliseconds);
  return formatTime(pacePer100mInmilliseconds);
}

/** @description Formats the time spent in milliseconds into mm:ss or hh:mm:ss.
 * @param {number} activeTime The time in milliseconds.
 * @return {string}
 */
export function formatTime(activeTime) {
  let seconds = (activeTime / 1000).toFixed(0);
  let minutes = Math.floor(seconds / 60);
  let hours;
  if (minutes > 59) {
    hours = Math.floor(minutes / 60);
    hours = zeroPad(hours);
    minutes = minutes - hours * 60;
    minutes = zeroPad(minutes);
  }
  seconds = Math.floor(seconds % 60);
  seconds = zeroPad(seconds);
  if (hours) {
    return `${hours}:${minutes}:${seconds}`;
  }
  return `${minutes}:${seconds}`;
}

/** @description Formats calories with commas for 1,000.
 * @param {number} calories The time in milliseconds.
 * @return {string}
 */
export function formatCalories(calories) {
  return calories.toLocaleString();
}