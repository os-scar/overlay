const advisories = {
  snyk: 'Snyk Advisor',
  depsDev: 'OpenSSF Scorecard',
  socket: 'Socket',
  debricked: 'Debricked',
};
export default advisories;

export const advisoriesNames = Object.keys(advisories);
export const advisoriesCount = advisoriesNames.length;
