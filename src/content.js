export const mountContentScript = (contentScript) => {
  window.addEventListener('load', async () => {
    console.log('Overlay is running');

    await contentScript();

    console.log('Overlay is finished');
  });
};
