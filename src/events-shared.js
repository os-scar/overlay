import browser from './browser';

const overlayPrefix = 'overlay-';
export const REQUEST_PACKAGE_INFO_EVENT = overlayPrefix + 'REQUEST_PACKAGE_INFO_EVENT';
export const RESPONSE_PACKAGE_INFO_EVENT = overlayPrefix + 'RESPONSE_PACKAGE_INFO_EVENT';
export const READY_EVENT = overlayPrefix + 'READY_EVENT';
export const CONTENT_PORT_CONNECTION = overlayPrefix + 'content-script';
export const EVENT_SETTINGS_CHANGED = overlayPrefix + 'EVENT_SETTINGS_CHANGED';
export const EVENT_URL_CHANGE = overlayPrefix + 'EVENT_URL_CHANGE';

export const dispatchEvent = (type, detail) => {
  window.postMessage({ type, detail });
};

export const addMessagingEventListener = (type, callback) => {
  window.addEventListener('message', (event) => {
    if (event?.data?.type === type) {
      callback(event.data.detail);
    }
  });
};

export const sendMessageToAllTabs = (type, detail) => {
  browser.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      browser.tabs.sendMessage(tab.id, { type, detail });
    });
  });
};
