import { REQUEST_PACKAGE_INFO_EVENT, RESPONSE_PACKAGE_INFO_EVENT } from '../events-shared';
import advisory from './advisory/index';

const getPackageInfo = async (packageID) => {
  const packageInfo = await advisory(packageID);

  const { latestVersion, license, stars } = packageInfo.depsDev.data;

  return {
    ...packageID,
    latest: latestVersion,
    license,
    stars,
    sources: packageInfo,
  };
};

const listener = async ({ type, detail }, port) => {
  if (type === REQUEST_PACKAGE_INFO_EVENT) {
    const info = await getPackageInfo(detail);
    port.postMessage({ type: RESPONSE_PACKAGE_INFO_EVENT, detail: info });
  }

  return true;
};

export const listen = () => {
  chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener(listener);
  });
};
