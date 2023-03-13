import * as events from './content/content-events';

const injectScriptTag = () => {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('custom-elements.js');
  (document.head || document.documentElement).appendChild(script);

  console.log('Injected script tag', script);
};

export const mountContentScript = (contentScript) => {
  window.addEventListener('load', async () => {
    console.log('Overlay is running');

    events.listen();
    injectScriptTag();

    await contentScript();

    console.log('Overlay is finished');
  });
};
