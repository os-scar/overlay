import { addMessagingEventListener, dispatchEvent, READY_EVENT, RESPONSE_PACKAGE_INFO_EVENT } from '../events-shared';

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
  addMessagingEventListener(READY_EVENT, () => {
    console.log('Ready event received from injected script');
    isWebappReady = true;
  });
};

export const sendPackageInfoToWebapp = (info) => dispatchEvent(RESPONSE_PACKAGE_INFO_EVENT, info);
