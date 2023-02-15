import { describe, expect, jest, test } from '@jest/globals';
import { findRanges } from '../src/content/stackoverflow/finder';
import { readRealExamples, writeResultsSnapshot } from './real-examples/real-examples';

const JEST_DEFAULT_TIMEOUT = 5000;

const htmlParser = new DOMParser();
const getElementFromFragment = (fragment) => {
  const div = document.createElement('div');
  div.appendChild(fragment.cloneNode(true));
  return div.innerHTML;
};

describe('Real Pages', () => {
  jest.setTimeout(JEST_DEFAULT_TIMEOUT * 2 * 2);

  test('Snapshot real StackOverflow pages', async () => {
    const realExamples = await readRealExamples();

    const results = realExamples.map(({ html, ...example }) => {
      const body = htmlParser.parseFromString(html, 'text/html').body;

      const foundLinks = findRanges(body)
        .map(({ range, ...rest }) => {
          const element =
            range.cloneContents().firstChild.nodeType === Node.TEXT_NODE
              ? range.commonAncestorContainer.parentElement
              : range.cloneContents().firstChild;
          return {
            range: getElementFromFragment(element),
            ...rest,
          };
        })
        .sort();

      return { ...example, results: foundLinks };
    });

    const resultsByLink = results.reduce((acc, { link, ...current }) => {
      acc[link] = current;
      return acc;
    }, {});

    const snapshotFilePath = await writeResultsSnapshot(resultsByLink);
    expect(snapshotFilePath).not.toBeChangedByGit();
  });
});
