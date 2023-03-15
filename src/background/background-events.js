import { REQUEST_PACKAGE_INFO_EVENT, RESPONSE_PACKAGE_INFO_EVENT } from '../events-shared';
import advisories from './advisory/index';

const listener = async ({ type, detail }, port) => {
  if (type === REQUEST_PACKAGE_INFO_EVENT) {
    const promises = await advisories(detail);
    Object.entries(promises).forEach(([part, promise]) => {
      promise.then((info) => {
        port.postMessage({
          type: RESPONSE_PACKAGE_INFO_EVENT,
          detail: {
            packageId: detail,
            part,
            info,
          },
        });
      });
    });
  }

  return true;
};

export const listen = () => {
  chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener(listener);
  });
};
