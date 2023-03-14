import { mountContentScript } from './content';
import { getPackageInfo } from './content/bridge';
import { sendPackageInfoToWebapp } from './content/content-events';
import { findRanges } from './content/stackoverflow/finder';
import { addIndicator } from './content/stackoverflow/indicator';

mountContentScript(async () => {
  const findings = findRanges(document.body);
  console.debug({ findings });

  findings.forEach((find) => {
    getPackageInfo(find).then(sendPackageInfoToWebapp);
    addIndicator(find);
  });
});
