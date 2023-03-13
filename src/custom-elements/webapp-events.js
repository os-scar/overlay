import { dispatchEvent, HEARTBEAT_EVENT, REQUEST_PACKAGE_INFO_EVENT, RESPONSE_PACKAGE_INFO_EVENT } from '../events-shared.js';
import * as store from './store.js';

window.addEventListener(RESPONSE_PACKAGE_INFO_EVENT, (event) => {
  store.updatePackageInfo(event.detail);
});

dispatchEvent(HEARTBEAT_EVENT);

export const getPackageInfo = ({ type, name }) => dispatchEvent(REQUEST_PACKAGE_INFO_EVENT, { type, name });
