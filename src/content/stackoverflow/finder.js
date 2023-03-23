import * as npm from '../registry/npm';
import * as python from '../registry/python';
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

const urlParsers = {
  ...npm.urlParsers,
  ...python.urlParsers,
};

const codeBlockParsers = [npm.parseCommand, python.parseCommand];

export const findRanges = (body) => {
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

  const installCommands = Array.from(body.querySelectorAll(`${POST_SELECTOR} code`)).flatMap((element) => {
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
