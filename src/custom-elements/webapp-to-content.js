import * as store from './store.js';

// TODO: move to shared file
const eventType = 'get-package-info';
const fromContentScript = 'content-script';
const fromWebpage = 'webpage';

window.addEventListener('message', (event) => {
  if (event.data.from === fromContentScript) {
    if (event.data.type === eventType) {
      store.updatePackageInfo(event.data.payload);
    }
  }
});

export const getPackageInfo = ({ type, name }) => {
  window.postMessage({
    type: eventType,
    from: fromWebpage,
    payload: { type, name },
  });
};
