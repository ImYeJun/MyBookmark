chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (!request) return;

    switch (request.event_key) {
        case "ADD_BOOKMARK":
            if (request.name.trim().length === 0){
                sendResponse({ "isSuccess" : false, "subText" : "Empty Name : Make sure the name input field is not empty and does not contain only whitespace." });
                return false;
            }
            if (request.url.trim().length === 0){
                sendResponse({ "isSuccess" : false, "subText" : "Empty URL : Make sure the url input field is not empty and does not contain only whitespace." });
                return false;
            }
            if (!isValidHttpUrl(request.url)) { 
                sendResponse({ "isSuccess" : false, "subText" : "Invalid URL : Make sure the URL starts with http: or https:" });
                return false;
            }

            hashCode = crypto.randomUUID()
            chrome.storage.sync.set({
                [hashCode] : {
                    name: request.name,
                    url: request.url
                }
            }).then(() => {
                sendResponse({ "isSuccess" : true, "subText" : "" });
            });
            return true;
    }

    sendResponse({ "isSuccess" : false, "subText" : "Unknown Error" });
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
