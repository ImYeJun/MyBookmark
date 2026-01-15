import { isValidHttpUrl, sortBookmark } from "./utility.js";

const messageHandlers = {
    "ADD_BOOKMARK" : handleAddBookmark,
    "GET_BOOKMARKS_BY_NAME" : handleGetBookmarksByName,
    "GET_BOOKMARK_BY_HASHCODE" : handleGetBookmarkByHashcode,
    "REMOVE_BOOKMARK" : handleRemoveBookmark
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (!request || !request.event_key){
        sendResponse({ isSuccess: false, subText: "Invalid Request" });
        return false;
    } 

    const eventHandler = messageHandlers[request.event_key]

    if (!eventHandler){
        sendResponse({ isSuccess: false, subText: `Unknown Event Key ${request.event_key}` });
        return false;
    }
    
    eventHandler(request, sender, sendResponse);
    return true;
});

async function handleAddBookmark(request, sender, sendResponse){
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

    const hashCode = crypto.randomUUID()
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

async function handleGetBookmarksByName(request, sender, sendResponse) {
    try {
        const keys = await chrome.storage.sync.getKeys()
        const bookmarks = []

        for (const key of keys) {
            const result = await chrome.storage.sync.get(key)
            const currentBookmark = result[key]

            if (
                currentBookmark &&
                currentBookmark.name?.includes(request.name)
            ) {
                bookmarks.push({key : key, name : currentBookmark.name, url : currentBookmark.url})
            }
        }

        sendResponse({ isSuccess: true, bookmarks : bookmarks})
        return true
    } catch (e) {
        console.error(e)
        sendResponse({ isSuccess: false, bookmarks: [] })
        return false
    }
}

async function handleGetBookmarkByHashcode(request, sender, sendResponse){
    try{
        let bookmark = await chrome.storage.sync.get(request.hashcode)

        if (bookmark) { 
            sendResponse(bookmark[request.hashcode])
        }
        else { sendResponse(null) }
        
        return true;
    }
    catch (e){
        console.error(e)
        sendResponse(null)
        return false
    }
}

async function handleRemoveBookmark(request, sender, sendResponse) {
    if (!request || !request?.hashcode){
        sendResponse({ isSuccess: false, subText: "Invalid Request" });
        return false;
    }

    chrome.storage.sync.remove(request.hashcode);
    sendResponse(true);
    return true;
}
