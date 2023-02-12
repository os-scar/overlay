import { PACKAGE_INFO_ACTION } from "../bridge-sync"

/** 
 * @param {PackageID} packageID
 * @returns {ReturnType<import('../background/advisory/index').default>}
 */
export const getPackageInfo = async (packageID) => {
    return new Promise((resolve) => chrome.runtime.sendMessage({
        action: PACKAGE_INFO_ACTION,
        data: packageID
    }, resolve))
}