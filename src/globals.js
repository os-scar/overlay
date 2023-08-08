export const second = 1000;
export const minute = 60 * second;

export const advisories = {
  snyk: 'Snyk Advisor',
  depsDev: 'OpenSSF Scorecard',
  socket: 'Socket',
  debricked: 'Debricked',
};

export const advisoriesNames = Object.keys(advisories);
export const indicatorTagName = 'overlay-indicator';
export const packageReportTagName = 'overlay-package-report';
export const waitElementTimeOot = 10 * second;
