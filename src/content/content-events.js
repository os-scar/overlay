import { dispatchEvent, READY_EVENT, RESPONSE_PACKAGE_INFO_EVENT } from '../events-shared';

let isWebappReady = false;
export const waitForWebappReady = () => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (isWebappReady) {
        clearInterval(interval);
        resolve(true);
      }
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      resolve(false);
    }, 5000);
  });
};

export const listen = () => {
  window.addEventListener(READY_EVENT, () => {
    console.log('Ready event received from injected script');
    isWebappReady = true;
  });
};

export const sendPackageInfoToWebapp = (info) => dispatchEvent(RESPONSE_PACKAGE_INFO_EVENT, info);
