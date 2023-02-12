/// <reference path="../types.js" />
import { PACKAGE_INFO_ACTION } from '../bridge-sync';
import advisory from './advisory/index';

/** @param {PackageID} packageID */
const getPackageInfo = async (packageID) => {
  const packageInfo = await advisory(packageID);

  return {
    id: {
      ...packageID,
      latestVersion: packageInfo.depsDev?.latestVersion,
    },
    ...packageInfo,
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
