import { PACKAGE_INFO_ACTION } from '../bridge-sync';

export const getPackageInfo = async (packageID) => {
  return new Promise((resolve) =>
    chrome.runtime.sendMessage(
      {
        action: PACKAGE_INFO_ACTION,
        data: packageID,
      },
      resolve
    )
  );
};
