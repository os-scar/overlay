import {
  addMessagingEventListener,
  dispatchEvent,
  EVENT_SETTINGS_CHANGED,
  EVENT_URL_CHANGED,
  READY_EVENT,
  RESPONSE_PACKAGE_INFO_EVENT,
} from '../events-shared.js';
import * as store from './store.js';

const listenForUrlChange = () => {
  console.debug('Listening for URL changes');
  const pushState = history.pushState;
  history.pushState = function (state) {
    if (typeof history.onpushstate == 'function') {
      history.onpushstate({ state: state });
    }
    console.log('URL changed', location.href);
    dispatchEvent(EVENT_URL_CHANGED);
    return pushState.apply(history, arguments);
  };
};

export const initEventListenersAndStore = () => {
  console.debug('Store initialized by referencing to the store', store);

  addMessagingEventListener(RESPONSE_PACKAGE_INFO_EVENT, (data) => {
    const { packageId, part, info } = data;
    store.updatePackageInfo(packageId, part, info);
  });

  addMessagingEventListener(EVENT_SETTINGS_CHANGED, (settings) => {
    store.updateSettings(settings);
  });

  listenForUrlChange();

  dispatchEvent(READY_EVENT);
};
