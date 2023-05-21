import { mountContentScript } from './content';
import { fetchPackageInfo } from './content-events';
import { addIndicatorToRange } from './create-element';
import { findRanges } from './finder';

mountContentScript(async () => {
  const findings = findRanges(document.body);
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
