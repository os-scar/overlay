import {
  CONTENT_PORT_CONNECTION,
  dispatchEvent,
  READY_EVENT,
  REQUEST_PACKAGE_INFO_EVENT,
  RESPONSE_PACKAGE_INFO_EVENT,
} from '../events-shared';

const sendPackageInfoToWebapp = (info) => dispatchEvent(RESPONSE_PACKAGE_INFO_EVENT, info);

const backgroundConnection = chrome.runtime.connect({ name: CONTENT_PORT_CONNECTION });
backgroundConnection.onMessage.addListener((message) => {
  if (message.type === RESPONSE_PACKAGE_INFO_EVENT) {
    sendPackageInfoToWebapp(message.detail);
  }
});

export const fetchPackageInfo = (packageId) => {
  backgroundConnection.postMessage({ type: REQUEST_PACKAGE_INFO_EVENT, detail: packageId });
};

let isWebappReady = false;
export const onScriptLoaded = (timeout = 5000, interval = 100) => {
  return new Promise((resolve, reject) => {
    const started = Date.now();

    const checkIsWebappReady = () => {
      if (isWebappReady) return resolve();

      const duration = Date.now() - started;
      if (duration > timeout) return reject();

      setTimeout(checkIsWebappReady, interval);
    };

    checkIsWebappReady();
  });
};

export const listen = () => {
  window.addEventListener(READY_EVENT, () => {
    console.log('Ready event received from injected script');
    isWebappReady = true;
  });
};
