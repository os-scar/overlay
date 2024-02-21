/**
 * Waits for element to be rendered in DOM.
 * @param {string} selector A valid css selector string
 * @param {Node} [target=document] A DOM Node (which may be an Element) within the DOM tree to watch for changes, or to be the root of a subtree of nodes to be watched.
 *
 */
import { SECOND } from '../globals';

const waitElementTimeOot = 10 * SECOND;

const waitForElement = (selector, target = document) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Time out to wait for the element ' + selector));
    }, waitElementTimeOot);

    const wishedElement = target.querySelector(selector);
    if (wishedElement) {
      return resolve(wishedElement);
    }

    const observer = new MutationObserver(() => {
      const wishedElement = target.querySelector(selector);
      if (wishedElement) {
        resolve(wishedElement);
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
