import { PACKAGE_INFO_ACTION } from '../bridge-sync';
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

const listeners = {
  [PACKAGE_INFO_ACTION]: getPackageInfo,
};

export const listen = () => {
  chrome.runtime.onMessage.addListener(({ action, data }, _sender, sendResponse) => {
    Promise.resolve(listeners[action](data)).then(sendResponse);
    return true;
  });
};
