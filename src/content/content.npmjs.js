import { mountContentScript, reloadWhenURLChanged } from './content';
import { fetchPackageInfo } from './content-events';
import { urlParsers } from './registry/npm';
import waitForElement from '../utils/utils';
import { NPM_DOMAIN_NAME } from '../utils/url_change_domains_to_track';

const addPackageReport = async (packageID) => {
  // remove an old package report (if exists)
  const currPackageReport = document.getElementsByTagName('overlay-package-report');
  if (currPackageReport?.length) {
    currPackageReport.item(0).remove();
  }

  const repository = await waitForElement('#repository', document.querySelector('#main'));
  const packageReport = document.createElement('overlay-package-report');
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
reloadWhenURLChanged(loadPackageInfo, NPM_DOMAIN_NAME);
