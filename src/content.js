export const mountContentScript = (contentScript) => {
  window.addEventListener('load', async () => {
    console.log('SCS TBD is running');

    await contentScript();

    console.log('SCS TBD is finished');
  });
};
