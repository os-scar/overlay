import { OVERLAY_INDICATOR, OVERLAY_PACKAGE_REPORT } from '../global';

export const addIndicatorToRange = async (range, packageID) => {
  console.debug('Adding indicator for', packageID, range);

  const indicator = document.createElement(OVERLAY_INDICATOR);
  indicator.setAttribute('package-type', packageID.type);
  indicator.setAttribute('package-name', packageID.name);
  indicator.appendChild(range.extractContents());
  range.insertNode(indicator);
};

export const createPackageReportElement = (packageID, stylesheetUrl) => {
  const packageReport = document.createElement(OVERLAY_PACKAGE_REPORT);
  packageReport.setAttribute('package-type', packageID.type);
  packageReport.setAttribute('package-name', packageID.name);
  if (stylesheetUrl) {
    packageReport.setAttribute('stylesheet-url', stylesheetUrl);
  }
  return packageReport;
};
