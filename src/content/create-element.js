import { OVERLAY_INDICATOR, OVERLAY_PACKAGE_REPORT } from '../global';
import { fetchPackageInfo } from './content-events';
import { findRanges } from './finder';

export const addIndicatorToFindingsInElement = (element, contentElementSelector) => {
  const findings = findRanges(element, contentElementSelector);
  console.debug({ findings });

  const processed = {};
  findings
    .filter(({ range }) => range.endContainer.parentElement.nodeName.toLowerCase() !== OVERLAY_INDICATOR) // For install command
    .filter(({ range }) => range.commonAncestorContainer.nodeName.toLowerCase() !== OVERLAY_INDICATOR) // For links
    .forEach(({ range, ...packageId }) => {
      addIndicatorToRange(range, packageId);
      const packageKey = `${packageId.type}/${packageId.name}`;
      if (processed[packageKey]) {
        return;
      }

      processed[packageKey] = true;
      fetchPackageInfo(packageId);
    });
};

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
