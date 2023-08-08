import { packageReportTagName } from '../globals';
import waitForElement from '../utils/utils';
import { mountContentScript, reloadWhenURLChanged } from './content';
import { fetchPackageInfo } from './content-events';
import { urlParsers } from './registry/npm';

const CSS_SELECTOR_COLLABORATORS = '#collaborators';

const addPackageReport = async (packageID) => {
  // remove an old package report (if exists)
  const currPackageReport = document.getElementsByTagName(packageReportTagName);
  if (currPackageReport?.length) {
    currPackageReport.item(0).remove();
  }

  const collaborators = await waitForElement(CSS_SELECTOR_COLLABORATORS, document.querySelector('#main'));
  const packageReport = document.createElement(packageReportTagName);
  packageReport.setAttribute('package-type', packageID.type);
  packageReport.setAttribute('package-name', packageID.name);
  collaborators.parentElement.parentElement.prepend(packageReport);
};

const loadPackageInfo = async () => {
  const packageId = urlParsers[location.hostname.replace('www.', '')]?.(location);
  if (!packageId) return;

  addPackageReport(packageId);
  fetchPackageInfo(packageId);
};

mountContentScript(loadPackageInfo);
reloadWhenURLChanged(loadPackageInfo);
