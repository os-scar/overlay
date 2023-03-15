import { mountContentScript } from './content';
import { fetchPackageInfo } from './content/content-events';
import { findRanges } from './content/stackoverflow/finder';
import { addIndicator } from './content/stackoverflow/indicator';

mountContentScript(async () => {
  const findings = findRanges(document.body);
  console.debug({ findings });

  findings.forEach((find) => {
    fetchPackageInfo(find);
    addIndicator(find);
  });
});
