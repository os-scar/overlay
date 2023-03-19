import { mountContentScript } from './content';
import { getPackageInfo } from './content/bridge';
import { sendPackageInfoToWebapp } from './content/content-events';
import { findRanges } from './content/stackoverflow/finder';
import { addIndicator } from './content/stackoverflow/indicator';

mountContentScript(async () => {
  const findings = findRanges(document.body);
  console.debug({ findings });

  findings.reduce((acc, current) => {
    const { type, name } = current;
    if (acc[type + '_' + name]) return acc;

    getPackageInfo(find).then(sendPackageInfoToWebapp);
    acc[type + '_' + name] = true;
    return acc;
  }, {});

  findings.forEach(addIndicator);
});
