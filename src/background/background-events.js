import browser from '../browser';
import { REQUEST_PACKAGE_INFO_EVENT, RESPONSE_PACKAGE_INFO_EVENT, EVENT_URL_CHANGED } from '../events-shared';
import advisories from './advisory/index';
import { domains } from '../utils/url_change_domains_to_track';

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
  browser.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener(listener);
  });

  browser.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
    if (changeInfo.url) {
      for (const [domainName, pattern] of domains) {
        if (changeInfo.url.match(pattern)) {
          browser.tabs.sendMessage(tabId, {
            type: EVENT_URL_CHANGED,
            detail: domainName,
          });
        }
      }
    }
  });
};
