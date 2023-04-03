import { EVENT_SETTINGS_CHANGED, sendMessageToAllTabs } from '../../events-shared';

export const sendEventSettingsChanged = () => {
  sendMessageToAllTabs(EVENT_SETTINGS_CHANGED);
};
