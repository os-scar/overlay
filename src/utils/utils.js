/**
 * Waits for element to be rendered in DOM.
 * @param {string} selector A valid css selector string
 * @param {Node} target A DOM Node (which may be an Element) within the DOM tree to watch for changes, or to be the root of a subtree of nodes to be watched.
 *
 */
import { SECOND } from '../globals';

const waitElementTimeOot = 10 * SECOND;

const waitForElement = (selector, target) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Time out to wait for the element ' + selector));
    }, waitElementTimeOot);

    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(target, {
      childList: true,
      subtree: true,
    });
  });
};

export default waitForElement;
