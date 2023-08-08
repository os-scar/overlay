export const SECOND = 1000;
export const MINUTE = 60 * SECOND;

export const advisories = {
  snyk: 'Snyk Advisor',
  depsDev: 'OpenSSF Scorecard',
  socket: 'Socket',
  debricked: 'Debricked',
};

export const advisoriesNames = Object.keys(advisories);
export const indicatorTagName = 'overlay-indicator';
export const packageReportTagName = 'overlay-package-report';
