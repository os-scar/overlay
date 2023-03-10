import { PACKAGE_INFO_ACTION } from '../events-shared';
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
  const listener = ({ action, data }, _sender, sendResponse) => {
    Promise.resolve(listeners[action](data)).then(sendResponse);
    return true;
  };

  chrome.runtime.onMessage.addListener(listener);
  chrome.runtime.onMessageExternal.addListener(listener);
};
