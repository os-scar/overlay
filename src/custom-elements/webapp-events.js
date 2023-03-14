import { dispatchEvent, READY_EVENT, RESPONSE_PACKAGE_INFO_EVENT } from '../events-shared.js';
import * as store from './store.js';

export const initEventListenersAndStore = () => {
  console.debug('Store initialized by referencing to the store', store);

  window.addEventListener(RESPONSE_PACKAGE_INFO_EVENT, (event) => {
    store.updatePackageInfo(event.detail);
  });

  dispatchEvent(READY_EVENT);
};
