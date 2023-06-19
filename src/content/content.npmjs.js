import { mountContentScript } from './content';
import { fetchPackageInfo } from './content-events';
import { createPackageReportElement } from './create-element';
import { urlParsers } from './registry/npm';

const addPackageReport = (packageID) => {
  const repository = document.querySelector('#repository');
  if (repository) {
    repository.parentElement.insertBefore(createPackageReportElement(packageID), repository);
  }
};

mountContentScript(async () => {
  const packageId = urlParsers[location.hostname.replace('www.', '')]?.(location);
  if (!packageId) return;

  addPackageReport(packageId);
  fetchPackageInfo(packageId);
});
