import { advisoriesNames } from './advisories';
import browser from './browser';

const defaultAdvisoriesSettings = advisoriesNames.reduce((acc, name) => ({ ...acc, [name]: true }), {});

export const getAllAdvisoriesSettings = () =>
  browser.storage.local.get({ advisories: defaultAdvisoriesSettings }).then(({ advisories }) => advisories);

export const setAllAdvisoriesSettings = (advisories) => browser.storage.local.set({ advisories });
