import { FROM_CONTENT_SCRIPT, FROM_WEBPAGE, PACKAGE_INFO_EVENT } from '../consts';
import { getPackageInfo } from './bridge';

export const listen = () => {
  window.addEventListener('message', (event) => {
    if (event.data.from === FROM_WEBPAGE && event.data.type === PACKAGE_INFO_EVENT) {
      const { type, name } = event.data.payload;
      getPackageInfo({ type, name }).then((info) => {
        window.postMessage({
          type: PACKAGE_INFO_EVENT,
          from: FROM_CONTENT_SCRIPT,
          payload: info,
        });
      });
    }
  });
};
