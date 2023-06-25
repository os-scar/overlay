const advisories = {
  snyk: 'Snyk Advisor',
  depsDev: 'OpenSSF Scorecard',
  socket: 'Socket',
  debricked: 'Debricked',
};
export default advisories;

export const advisoriesNames = Object.keys(advisories);
export const advisoriesCount = advisoriesNames.length;

//tag names and selectors
export const packageReportTagName = 'overlay-package-report';
export const tooltipSourceSelector = '.overlay-indicator__tooltip__sources > .overlay-indicator__tooltip__source';
