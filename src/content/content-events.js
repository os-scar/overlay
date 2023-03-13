import { dispatchEvent, HEARTBEAT_EVENT, REQUEST_PACKAGE_INFO_EVENT, RESPONSE_PACKAGE_INFO_EVENT } from '../events-shared';
import { getPackageInfo } from './bridge';

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
  window.addEventListener(REQUEST_PACKAGE_INFO_EVENT, (event) => {
    const { type, name } = event.detail;
    getPackageInfo({ type, name }).then((info) => {
      dispatchEvent(RESPONSE_PACKAGE_INFO_EVENT, info);
    });
  });

  window.addEventListener(HEARTBEAT_EVENT, () => {
    console.log('Heartbeat received from injected script');
    isWebappReady = true;
  });
};
