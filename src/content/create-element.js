export const addIndicatorToRange = async (range, packageID) => {
  console.debug('Adding indicator for', packageID);

  const indicator = document.createElement('overlay-indicator');
  indicator.setAttribute('package-type', packageID.type);
  indicator.setAttribute('package-name', packageID.name);
  indicator.appendChild(range.extractContents());
  range.insertNode(indicator);
};

export const createPackageReportElement = (packageID, stylesheetUrl) => {
  const packageReport = document.createElement('overlay-package-report');
  packageReport.setAttribute('package-type', packageID.type);
  packageReport.setAttribute('package-name', packageID.name);
  if (stylesheetUrl) {
    packageReport.setAttribute('stylesheet-url', stylesheetUrl);
  }
  return packageReport;
};
