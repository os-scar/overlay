import browser from '../browser';
import { mountContentScript } from './content';
import { fetchPackageInfo } from './content-events';
import { createPackageReportElement } from './create-element';
import { urlParsers } from './registry/python';

const addPackageReport = (packageID) => {
  const sidebar = document.querySelector('.vertical-tabs__tabs');
  const sidebarSection = sidebar?.querySelectorAll('.sidebar-section')[1];
  if (!sidebarSection) {
    console.log('No side section found (parent of .github-repo-info)');
    return;
  }

  const packageReport = createPackageReportElement(packageID, browser.runtime.getURL('custom-elements.css'));
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
