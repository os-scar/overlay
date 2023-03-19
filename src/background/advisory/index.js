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

export default (packageID) => {
  const depsDev = handleAsyncError(fetchDepsDev, packageID);
  const info = depsDev.then((depsDevInfo) => {
    const { latestVersion, licenses, stars } = depsDevInfo.data;
    return {
      latest: latestVersion,
      licenses,
      stars,
    };
  });

  return {
    debricked: handleAsyncError(fetchDebricked, packageID),
    depsDev,
    info,
    openbase: handleAsyncError(fetchOpenbase, packageID),
    snyk: handleAsyncError(fetchSnyk, packageID),
    socket: handleAsyncError(fetchSocket, packageID),
  };
};
