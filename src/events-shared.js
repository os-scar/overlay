export const PACKAGE_INFO_ACTION = 'PACKAGE_INFO_ACTION';

const overlayPrefix = 'overlay-';
export const RESPONSE_PACKAGE_INFO_EVENT = overlayPrefix + 'RESPONSE_PACKAGE_INFO_EVENT';
export const HEARTBEAT_EVENT = overlayPrefix + 'HEARTBEAT_EVENT';

export const dispatchEvent = (type, detail) => {
  const event = new CustomEvent(type, { detail });
  window.dispatchEvent(event);
};
