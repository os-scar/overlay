const defaultAdvisoriesSettings = {
  snyk: true,
  socket: true,
  debricked: true,
  depsDev: true,
  openbase: true,
};

export const getAllAdvisoriesSettings = () =>
  chrome.storage.local.get({ advisories: defaultAdvisoriesSettings }).then(({ advisories }) => advisories);

export const setAllAdvisoriesSettings = (advisories) => chrome.storage.local.set({ advisories });
