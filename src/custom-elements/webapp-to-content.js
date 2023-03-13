import { PACKAGE_INFO_EVENT, FROM_CONTENT_SCRIPT, FROM_WEBPAGE } from '../consts.js';
import * as store from './store.js';

window.addEventListener('message', (event) => {
  if (event.data.from === FROM_CONTENT_SCRIPT && event.data.type === PACKAGE_INFO_EVENT) {
    store.updatePackageInfo(event.data.payload);
  }
});

export const getPackageInfo = ({ type, name }) => {
  window.postMessage({
    type: PACKAGE_INFO_EVENT,
    from: FROM_WEBPAGE,
    payload: { type, name },
  });
};
