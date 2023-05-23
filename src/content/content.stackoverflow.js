import { mountContentScript } from './content';
import { fetchPackageInfo } from './content-events';
import { addIndicatorToRange } from './create-element';
import { findRanges } from './finder';

const POST_SELECTOR = 'div.js-post-body';

mountContentScript(async () => {
  const findings = findRanges(document.body, POST_SELECTOR);
  console.debug({ findings });

  const processed = {};
  findings.forEach(({ range, ...packageId }) => {
    addIndicatorToRange(range, packageId);
    const packageKey = `${packageId.type}/${packageId.name}`;
    if (processed[packageKey]) {
      return;
    }

    processed[packageKey] = true;
    fetchPackageInfo(packageId);
  });
});
