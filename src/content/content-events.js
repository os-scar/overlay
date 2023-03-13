import { dispatchEvent, REQUEST_PACKAGE_INFO_EVENT, RESPONSE_PACKAGE_INFO_EVENT } from '../events-shared';
import { getPackageInfo } from './bridge';

export const listen = () => {
  window.addEventListener(REQUEST_PACKAGE_INFO_EVENT, (event) => {
    const { type, name } = event.detail;
    getPackageInfo({ type, name }).then((info) => {
      dispatchEvent(RESPONSE_PACKAGE_INFO_EVENT, info);
    });
  });
};
