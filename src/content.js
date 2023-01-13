export const mountContentScript = (contentScript) => {
    window.addEventListener('load', async () => {
        console.log('running');
        await contentScript();
        console.log('finished');
    });
};
