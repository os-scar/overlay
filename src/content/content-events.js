import { dispatchEvent, FROM_CONTENT_SCRIPT, FROM_WEBPAGE, PACKAGE_INFO_EVENT } from '../events-shared';
import { getPackageInfo } from './bridge';

export const listen = () => {
  window.addEventListener(PACKAGE_INFO_EVENT, (event) => {
    if (event.detail.from === FROM_WEBPAGE) {
      const { type, name } = event.detail;
      getPackageInfo({ type, name }).then((info) => {
        dispatchEvent(PACKAGE_INFO_EVENT, { from: FROM_CONTENT_SCRIPT, payload: info });
      });
    }
  });
};
