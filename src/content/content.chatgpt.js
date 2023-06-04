import { OVERLAY_INDICATOR, SECOND } from '../global';
import { mountContentScript } from './content';
import { fetchPackageInfo } from './content-events';
import { addIndicatorToRange } from './create-element';
import { findRanges } from './finder';

/*
 * obvserving the 'main' is stopped when the user navigates to a different conversation (need check)
 * MutationList didn't gives the `code` elements
 * The element are creating al the time (because of the "writing" animation),
 *     so if you wrap the element, it may throw an error because it is not existing anymore
 * When you read the same element again and again, the range may already wrapped and it will wrap it again and again
 */

const addIndicator = (element, contentElementSelector) => {
  console.log(`search finding in ${element.nodeName}`, element, contentElementSelector);
  // TODO unify with stackoverflow

  const findings = findRanges(element, contentElementSelector);
  console.debug({ findings });

  const processed = {};
  findings
    .filter(({ range }) => range.endContainer.parentElement.nodeName.toLowerCase() !== OVERLAY_INDICATOR) // For install command
    .filter(({ range }) => range.commonAncestorContainer.nodeName.toLowerCase() !== OVERLAY_INDICATOR) // For links
    .forEach(({ range, ...packageId }) => {
      addIndicatorToRange(range, packageId);
      const packageKey = `${packageId.type}/${packageId.name}`;
      if (processed[packageKey]) {
        return;
      }

      processed[packageKey] = true;
      fetchPackageInfo(packageId);
    });
};

mountContentScript(async () => {
  setInterval(() => addIndicator(document.querySelector('main')), 5 * SECOND);
});
