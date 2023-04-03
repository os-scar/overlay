import { EVENT_SETTINGS_CHANGED, sendMessageToAllTabs } from '../../events-shared';

export const sendEventSettingsChanged = (settings) => {
  sendMessageToAllTabs(EVENT_SETTINGS_CHANGED, settings);
};
