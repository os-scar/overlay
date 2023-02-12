/// <reference path="../../types.js" />
import * as npm from '../registry/npm';
import { getRangeOfPositions } from './range';

const POST_SELECTOR = 'div.js-post-body';

const validURL = (href) => {
  try {
    const url = new URL(href);
    if (url.protocol === 'http:' || url.protocol === 'https:') return url;
  } catch {
    /* empty */
  }
  return false;
};

/** @type {Record<string, (url: URL) => PackageID>} */
const urlParsers = {
  'npmjs.com': npm.urlParser,
  'npmjs.org': npm.urlParser,
  // 'pypi.org': python.urlParser,
  // 'pypi.python.org': python.urlParser,
};

/** @param {HTMLElement} body */
export const findRanges = (body) => {
  /** @type {ElementFindings[]} */
  const links = Array.from(body.querySelectorAll(`${POST_SELECTOR} a`))
    .map((element) => {
      const url = validURL(element.getAttribute('href'));
      if (!url) return;

      const packageID = urlParsers[url.hostname.replace('www.', '')]?.(url);
      if (!packageID?.name) return;

      const range = new Range();
      range.selectNode(element);

      return {
        range,
        ...packageID,
      };
    })
    .filter((p) => p);

  const npmCommands = Array.from(body.querySelectorAll(`${POST_SELECTOR} code`)).flatMap((element) => {
    const packages = npm.parseCommand(element.textContent);

    const withRanges = packages.map(({ startIndex, endIndex, ...packageID }) => {
      const range = getRangeOfPositions(element, startIndex, endIndex);
      return { ...packageID, range };
    });

    return withRanges;
  });

  return [...links, ...npmCommands];
};
