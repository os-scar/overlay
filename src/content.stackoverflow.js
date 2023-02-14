import { mountContentScript } from './content';
import { findRanges } from './content/stackoverflow/finder';
import { addIndicator } from './content/stackoverflow/indicator';

mountContentScript(async () => {
  const ranges = findRanges(document.body);
  console.debug({ ranges });

  ranges.map(addIndicator);
});
