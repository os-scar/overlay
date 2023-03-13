import { dispatchEvent, FROM_CONTENT_SCRIPT, FROM_WEBPAGE, PACKAGE_INFO_EVENT } from '../events-shared.js';
import * as store from './store.js';

window.addEventListener(PACKAGE_INFO_EVENT, (event) => {
  if (event.detail.from === FROM_CONTENT_SCRIPT) {
    store.updatePackageInfo(event.detail.payload);
  }
});

export const getPackageInfo = ({ type, name }) => dispatchEvent(PACKAGE_INFO_EVENT, { from: FROM_WEBPAGE, type, name });
