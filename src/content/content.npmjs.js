import { mountContentScript, reloadWhenURLChanged } from './content';
import { fetchPackageInfo } from './content-events';
import { urlParsers } from './registry/npm';
import waitForElement from '../utils/utils';
import { packageReportTagName } from '../utils/tag-names';

const addPackageReport = async (packageID) => {
  // remove an old package report (if exists)
  const currPackageReport = document.getElementsByTagName(packageReportTagName);
  if (currPackageReport?.length) {
    currPackageReport.item(0).remove();
  }

  const repository = await waitForElement('#repository', document.querySelector('#main'));
  const packageReport = document.createElement(packageReportTagName);
  packageReport.setAttribute('package-type', packageID.type);
  packageReport.setAttribute('package-name', packageID.name);
  repository.parentElement.insertBefore(packageReport, repository);
};

const loadPackageInfo = async () => {
  const packageId = urlParsers[location.hostname.replace('www.', '')]?.(location);
  if (!packageId) return;

  addPackageReport(packageId);
  fetchPackageInfo(packageId);
};

mountContentScript(loadPackageInfo);
reloadWhenURLChanged(loadPackageInfo);
