import { getNormalizedPackageID } from '../registries';
import fetchDebricked from './debricked';
import fetchDepsDev from './deps-dev';
import fetchOpenbase from './openbase';
import fetchSnyk from './snyk';
import fetchSocket from './socket';

const thirdPartyPackages = ['debricked', 'snyk', 'socket', 'openbase'];
const handleAsyncError = (func, ...args) =>
  Promise.resolve(func(...args)).catch((err) => {
    console.error(err, func.name, args);
    return null;
  });

export default async (packageID) => {
  const normalizedPackageID = await getNormalizedPackageID(packageID);

  const depsDev = handleAsyncError(fetchDepsDev, normalizedPackageID);
  const info = depsDev.then((depsDevInfo) => {
    const { latestVersion, licenses, stars } = depsDevInfo.data;
    return {
      latest: latestVersion,
      licenses,
      stars,
    };
  });
  const results = await Promise.allSettled([
    fetchDebricked(normalizedPackageID),
    fetchSnyk(normalizedPackageID),
    fetchSocket(normalizedPackageID),
    fetchOpenbase(normalizedPackageID),
  ]);
  const fulfilledResultsNormalized = results.reduce((acc, currentRes, index) => {
    if (currentRes.status === 'fulfilled') {
      acc[thirdPartyPackages[index]] = Promise.resolve(currentRes.value);
    } else {
      console.log({ failedPackage: [thirdPartyPackages[index]], reason: currentRes.reason });
    }
    return acc;
  }, {});

  return {
    ...fulfilledResultsNormalized,
    depsDev,
    info,
  };
};
