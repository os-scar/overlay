/**
 * Waits for element to be rendered in DOM.
 * @param {string} selector A valid css selector string
 * @param {Node} target A DOM Node (which may be an Element) within the DOM tree to watch for changes, or to be the root of a subtree of nodes to be watched.
 *
 */

const TIME_OUT = 10000;

const waitForElement = (selector, target) => {
  const waitForElement = new Promise((resolve) => {
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

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Time out to wait for the element'));
    }, TIME_OUT);
  });

  return Promise.race([waitForElement, timeoutPromise]);
};

export default waitForElement;
