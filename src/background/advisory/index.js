import { getNormalizedPackageID } from '../registries';
import fetchDebricked from './debricked';
import fetchDepsDev from './deps-dev';
import fetchOpenbase from './openbase';
import fetchSnyk from './snyk';
import fetchSocket from './socket';

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

  return {
    debricked: handleAsyncError(fetchDebricked, normalizedPackageID),
    depsDev,
    info,
    openbase: handleAsyncError(fetchOpenbase, normalizedPackageID),
    snyk: handleAsyncError(fetchSnyk, normalizedPackageID),
    socket: handleAsyncError(fetchSocket, normalizedPackageID),
  };
};
