import * as go from './registry/go';
import * as npm from './registry/npm';
import * as python from './registry/python';
import { getRangeOfPositions } from './range';

const validURL = (href) => {
  try {
    const url = new URL(href);
    if (url.protocol === 'http:' || url.protocol === 'https:') return url;
  } catch {
    /* empty */
  }
  return false;
};

const urlParsers = {
  ...npm.urlParsers,
  ...python.urlParsers,
};

const codeBlockParsers = [...npm.parseCommands, python.parseCommand, go.parseCommand];

const querySelectorAllIncludeSelf = (element, selector) => {
  const matches = Array.from(element.querySelectorAll(selector));
  if (element.matches(selector)) {
    matches.push(element);
  }
  return matches;
};

export const findRanges = (element, contentElementSelector = '') => {
  const links = querySelectorAllIncludeSelf(element, `${contentElementSelector} a`)
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

  const installCommands = querySelectorAllIncludeSelf(element, `${contentElementSelector} code`).flatMap((element) => {
    return codeBlockParsers.flatMap((parser) => {
      const packages = parser(element.textContent);

      const withRanges = packages.map(({ startIndex, endIndex, ...packageID }) => {
        const range = getRangeOfPositions(element, startIndex, endIndex);
        return { ...packageID, range };
      });

      return withRanges;
    });
  });

  return [...links, ...installCommands];
};
