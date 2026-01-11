chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (!request) return;

    switch (request.event_key) {
        case "ADD_BOOKMARK":
            if (!isValidHttpUrl(request.url)) { break; }

            hashCode = crypto.randomUUID()
            chrome.storage.sync.set({
                [hashCode] : {
                    name: request.name,
                    url: request.url
                }
            }).then(() => {
                sendResponse(true);
            });
            return true;
    }

    sendResponse(false);
    return false;
});

function isValidHttpUrl(url) {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}
