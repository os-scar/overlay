export const PACKAGE_INFO_ACTION = 'PACKAGE_INFO_ACTION';

const overlayPrefix = 'overlay-';
export const RESPONSE_PACKAGE_INFO_EVENT = overlayPrefix + 'RESPONSE_PACKAGE_INFO_EVENT';
export const READY_EVENT = overlayPrefix + 'READY_EVENT';

export const dispatchEvent = (type, detail) => {
  window.postMessage({ type, detail }, '*');
};

export const addMessagingEventListener = (type, callback) => {
  window.addEventListener('message', (event) => {
    if (event?.data?.type === type) {
      callback(event.data.detail);
    }
  });
};
