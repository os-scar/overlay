import browser from './browser';

const defaultAdvisoriesSettings = {
  snyk: true,
  socket: true,
  debricked: true,
  depsDev: true,
  openbase: true,
};

export const getAllAdvisoriesSettings = () =>
  browser.storage.local.get({ advisories: defaultAdvisoriesSettings }).then(({ advisories }) => advisories);

export const setAllAdvisoriesSettings = (advisories) => browser.storage.local.set({ advisories });
