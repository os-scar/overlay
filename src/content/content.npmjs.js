import { mountContentScript, reloadWhenURLChanged } from './content';
import { fetchPackageInfo } from './content-events';
import { urlParsers } from './registry/npm';

const addPackageReport = (packageID) => {
  const packageReport = document.createElement('overlay-package-report');
  packageReport.setAttribute('package-type', packageID.type);
  packageReport.setAttribute('package-name', packageID.name);

  const repository = document.querySelector('#repository');
  if (repository) {
    repository.parentElement.insertBefore(packageReport, repository);
  }
};

const reloadPackageInfo = async () => {
  const currPackageReport = document.getElementsByTagName('overlay-package-report');
  if (!currPackageReport || currPackageReport.length === 0) return;

  currPackageReport?.item(0)?.remove();
  await loadPackageInfo();
};

const loadPackageInfo = async () => {
  const packageId = urlParsers[location.hostname.replace('www.', '')]?.(location);
  if (!packageId) return;

  addPackageReport(packageId);
  fetchPackageInfo(packageId);
};

mountContentScript(loadPackageInfo);
reloadWhenURLChanged(reloadPackageInfo);
