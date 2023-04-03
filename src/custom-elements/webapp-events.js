import {
  addMessagingEventListener,
  dispatchEvent,
  EVENT_SETTINGS_CHANGED,
  READY_EVENT,
  RESPONSE_PACKAGE_INFO_EVENT,
} from '../events-shared.js';
import * as store from './store.js';

export const initEventListenersAndStore = () => {
  console.debug('Store initialized by referencing to the store', store);

  addMessagingEventListener(RESPONSE_PACKAGE_INFO_EVENT, (data) => {
    const { packageId, part, info } = data;
    store.updatePackageInfo(packageId, part, info);
  });

  addMessagingEventListener(EVENT_SETTINGS_CHANGED, (settings) => {
    // TODO: update settings on extension load.
    // Maybe the settings should be loaded from storage and not injected all the way from popup.
    store.updateSettings(settings);
  });

  dispatchEvent(READY_EVENT);
};
