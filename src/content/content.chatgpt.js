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

const foundElements = new WeakSet();

const registerNodeHandler = (element) => {
  console.log('registerNodeHandler', element);
  setTimeout(() => addIndicator(element), /* 5 seconds */ 5000);
};

const addIndicator = (element, contentElementSelector) => {
  console.log(`search finding in ${element.nodeName}`, element, contentElementSelector);
  // TODO unify with stackoverflow

  // Check if element is still in the DOM
  if (!element.isConnected) {
    console.debug('element is not connected');
    return;
  }
  if (element.parentElement?.nodeName.toLowerCase() === 'overlay-indicator') {
    console.debug('element is already wrapped');
    return;
  }

  const findings = findRanges(element, contentElementSelector);
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
};

const elementsToAddIndicator = ['a', 'code']

const observer = new MutationObserver((mutationsList) => {
  console.log('mutation', mutationsList);
  mutationsList
    .filter((mutation) => mutation.type === 'childList')
    .flatMap((mutation) => Array.from(mutation.addedNodes))
    .filter(
      (node) =>
        node.nodeType === Node.ELEMENT_NODE &&
        elementsToAddIndicator.includes(node.nodeName.toLowerCase()) &&
        node.parentElement?.nodeName.toLowerCase() !== 'overlay-indicator'
    )
    .map(registerNodeHandler);
});

mountContentScript(async () => {
  // TODO: Chat with
  // TODO: Open existing chat
  // setInterval(() => addIndicator(document.querySelector('main')), 5000);
  observer.observe(document.querySelector('main'), { childList: true, subtree: true });
});
{/* <button class="btn relative btn-neutral border-0 md:border" as="button"><div class="flex w-full gap-2 items-center justify-center"><svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>Stop generating</div></button> */}