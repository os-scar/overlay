import { getPackageInfo } from './content/bridge';

const eventType = 'get-package-info';
const fromContentScript = 'content-script';
const fromWebpage = 'webpage';

export const listen = () => {
  window.addEventListener('message', (event) => {
    if (event.data.from === fromWebpage) {
      if (event.data.type === eventType) {
        const { type, name } = event.data.payload;
        getPackageInfo({ type, name }).then((info) => {
          window.postMessage({
            type: eventType,
            from: fromContentScript,
            payload: info,
          });
        });
      }
    }
  });
};
