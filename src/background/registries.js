/**
 * @typedef {{
 *   info: {
 *     name: string
 *   }
 * }} PypiPackageResponse
 */

import cache from './cache';

/** @return {Promise<PypiPackageResponse>} */
const getPypiPackage = (name) => cache(['pypi', name], () => fetch(`https://pypi.org/pypi/${name}/json`).then((r) => r.json()));

export const getNormalizedPackageID = async (packageID) => {
  const { type, name } = packageID;

  if (type === 'pypi') {
    const { info } = await getPypiPackage(name);
    return { ...packageID, name: info.name };
  }
  return packageID;
};
