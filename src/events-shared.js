export const PACKAGE_INFO_ACTION = 'PACKAGE_INFO_ACTION';
export const PACKAGE_INFO_EVENT = 'get-package-info';
export const FROM_CONTENT_SCRIPT = 'content-script';
export const FROM_WEBPAGE = 'webpage';

export const dispatchEvent = (type, payload) => {
  const event = new CustomEvent(type, { detail: payload });
  window.dispatchEvent(event);
};
