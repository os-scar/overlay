const overlayPrefix = 'overlay-';
export const REQUEST_PACKAGE_INFO_EVENT = overlayPrefix + 'REQUEST_PACKAGE_INFO_EVENT';
export const RESPONSE_PACKAGE_INFO_EVENT = overlayPrefix + 'RESPONSE_PACKAGE_INFO_EVENT';
export const READY_EVENT = overlayPrefix + 'READY_EVENT';
export const CONTENT_PORT_CONNECTION = overlayPrefix + 'content-script';

export const dispatchEvent = (type, detail) => {
  const event = new CustomEvent(type, { detail });
  window.dispatchEvent(event);
};
