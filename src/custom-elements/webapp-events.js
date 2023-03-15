import { addMessagingEventListener, dispatchEvent, READY_EVENT, RESPONSE_PACKAGE_INFO_EVENT } from '../events-shared.js';
import * as store from './store.js';

export const initEventListenersAndStore = () => {
  console.debug('Store initialized by referencing to the store', store);

  addMessagingEventListener(RESPONSE_PACKAGE_INFO_EVENT, (data) => {
    store.updatePackageInfo(data);
  });

  dispatchEvent(READY_EVENT);
};
