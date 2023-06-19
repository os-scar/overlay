/**
 * Creates a regexp from a given string
 * @param {string} str the string we want to make a regexp from
 * @returns {string} representing regex
 */
const createRegexp = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

export const NPM_DOMAIN_NAME = 'npmjs';
/**
 * A map that contains domains whose URL changes are tracked by the extension.
 * Each pair consist of a domain and a RegExp representation of its URL.
 */
export const domains = new Map([[NPM_DOMAIN_NAME, createRegexp('://www.npmjs.com/package/')]]);
