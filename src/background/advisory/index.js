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
  const [debricked, depsDev, openbase, snyk, socket] = await Promise.all([
    handleAsyncError(fetchDebricked, packageID),
    handleAsyncError(fetchDepsDev, packageID),
    handleAsyncError(fetchOpenbase, packageID),
    handleAsyncError(fetchSnyk, packageID),
    handleAsyncError(fetchSocket, packageID),
  ]);

  return { debricked, depsDev, openbase, snyk, socket };
};
