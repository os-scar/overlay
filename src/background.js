function onIncomingMessage(message, sender, sendResponse) {
    if (message.command === 'openTab' && message.url) {
        chrome.tabs.create({url: message.url});
    } else {
        console.error(`unknown message ${message}`)
    }

    sendResponse({});
}

chrome.runtime.onMessageExternal.addListener(onIncomingMessage);
chrome.runtime.onMessage.addListener(onIncomingMessage);
