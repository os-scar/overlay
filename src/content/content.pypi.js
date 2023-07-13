import browser from '../browser';
import { packageReportTagName } from '../globals';
import { mountContentScript } from './content';
import { fetchPackageInfo } from './content-events';
import { urlParsers } from './registry/python';

const addPackageReport = (packageID) => {
  const packageReport = document.createElement(packageReportTagName);
  packageReport.setAttribute('package-type', packageID.type);
  packageReport.setAttribute('package-name', packageID.name);
  packageReport.setAttribute('stylesheet-url', browser.runtime.getURL('custom-elements.css'));

  const sidebar = document.querySelector('.vertical-tabs__tabs');
  const sidebarSection = sidebar?.querySelectorAll('.sidebar-section')[1];
  if (!sidebarSection) {
    console.log('No side section found (parent of .github-repo-info)');
    return;
  }

  sidebar.insertBefore(packageReport, sidebarSection);
};

mountContentScript(async () => {
  console.log('Running content script for PyPI');
  const packageId = urlParsers[location.hostname.replace('www.', '')]?.(location);
  if (!packageId) {
    console.log('No package found', packageId);
    return;
  }

  addPackageReport(packageId);
  fetchPackageInfo(packageId);
});
