const injectScriptTag = () => {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('custom-elements.js');
  (document.head || document.documentElement).appendChild(script);
  console.log('Injected script tag', script);

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL('custom-elements.css');
  (document.head || document.documentElement).appendChild(link);
  console.log('Injected link tag', link);
};

export const mountContentScript = (contentScript) => {
  window.addEventListener('load', async () => {
    console.log('Overlay is running');

    injectScriptTag();

    await contentScript();

    console.log('Overlay is finished');
  });
};
