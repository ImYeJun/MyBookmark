const pressedKeys = new Set()
let openShortCutFired = false;
const bookmarkBoxes = () => Array.from(document.querySelectorAll(".BookmarkBox"))

document.addEventListener("DOMContentLoaded", () =>{
    addBookmarkButton = document.getElementById("AddBoomarkButton")

    addBookmarkButton.addEventListener("click", () =>{
        window.location.href = "/popup_related/popup_add_bookmark.html"
    })

    searchButton = document.getElementById("SearchButton")
    searchButton.addEventListener("click", ()=>{
        searchBookmarks()
    })

    document.addEventListener("keydown", (e)=>{
        if (e.key == "ArrowDown"){
            onArrowKeyPressed(e, "Down")
        }
        
        if (e.key == "ArrowUp"){
            onArrowKeyPressed(e, "Up")
        }

        pressedKeys.add(e.key);
        if (pressedKeys.has("Enter")){
            handleShortCutInput()
        }
    })
    
    document.addEventListener("keyup", (e) => {
        pressedKeys.delete(e.key);
        openShortCutFired = false;
    });
})

async function searchBookmarks() {
    searchBox = document.getElementById("SearchBox")

    inputField = searchBox.querySelector("input")
    inputKey = inputField.value
    
    result = await chrome.runtime.sendMessage({ event_key : "GET_BOOKMARKS_BY_NAME" , name : inputKey})
    
    if (result.isSuccess){
        var contentBox = document.getElementById("BookmarksBox")
        while (contentBox.firstChild) { contentBox.removeChild(contentBox.firstChild); }
        
        for (var bookmarkData of result.bookmarks){
            createBookmarkBox(bookmarkData, contentBox)
        }
        return true;
    }
    else{
        console.error("Failed to get bookmarks")
        return false;
    }
}

function handleShortCutInput(){
    if (openShortCutFired) return;

    url = document.activeElement.classList.contains("BookmarkBox") ? document.activeElement.getAttribute("url") : ""
    if (url === ""){
        return;
    }
    else if (pressedKeys.has("Shift")){
        chrome.windows.create({
            url: url,
            type: "normal"
        });
        pressedKeys.clear();
    }
    else if (pressedKeys.has("Control")){
        chrome.tabs.create({
            url: url    
        });
    }
    else{
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.update(tabs[0].id, { url: url })
        })
    }
    openShortCutFired = true;
}

function createBookmarkBox(bookmarkData, parentBox) {
    let key = bookmarkData.key
    let name = bookmarkData.name
    let url = bookmarkData.url

    let bookmarkBox = document.createElement("div")
    bookmarkBox.role = "button"
    bookmarkBox.tabIndex = 0

    bookmarkBox.classList.add("BookmarkBox")
    bookmarkBox.setAttribute("hashcode", key)
    bookmarkBox.setAttribute("name", name)
    bookmarkBox.setAttribute("url", url)
    bookmarkBox.addEventListener("mousedown", (e) => {
        if (e.button == 0){
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.update(tabs[0].id, { url: url })
            })
        }
        else if (e.button == 1){
            chrome.tabs.create({
                url: url    
            });
        }
    })
    if (parentBox.firstChild) bookmarkBox.tabIndex = -1
    else bookmarkBox.tabIndex = 0

    let deleteButton = document.createElement("button")
    deleteButton.id = "DeleteButton"
    let deleteButtonImg = document.createElement("img")
    deleteButtonImg.src = "/assets/delete_icon.png"
    deleteButton.appendChild(deleteButtonImg)
    deleteButton.addEventListener("mousedown", async (e) => {
        e.stopPropagation()
        e.preventDefault()
        let isSuccess = await chrome.runtime.sendMessage({ event_key : "REMOVE_BOOKMARK", hashcode : key})

        if (isSuccess){
            bookmarkBox.remove();
        }   
    })
    deleteButton.tabIndex = -1

    let uppderBox = document.createElement("div")
    uppderBox.id = "UpperBox"

    let nameBox = document.createElement("div")
    nameBox.id = "Name"
    nameBox.textContent = name
    nameBox.tabIndex = -1

    let settingButton = document.createElement("button")
    settingButton.id = "SettingButton"
    let settingButtonImg = document.createElement("img")
    settingButtonImg.src = "/assets/setting_icon.png"
    settingButton.appendChild(settingButtonImg)
    settingButton.addEventListener("mousedown", (e)=>{
        e.stopPropagation()
        e.preventDefault()

        openBookmarkSettingModal(key)
    })
    settingButton.tabIndex = -1

    let urlBox = document.createElement("div")
    urlBox.id = "Url"
    urlBox.textContent = url
    urlBox.tabIndex = -1
    
    uppderBox.appendChild(nameBox)
    uppderBox.appendChild(settingButton)
    bookmarkBox.appendChild(uppderBox)
    bookmarkBox.appendChild(urlBox)
    bookmarkBox.appendChild(deleteButton)
    parentBox.appendChild(bookmarkBox)
}

function onArrowKeyPressed(e, direction){
    boxes = bookmarkBoxes();
    currentIndex = boxes.indexOf(document.activeElement)

    e.preventDefault()
    if (direction == "Up"){
        let prevIndex
        if (currentIndex == -1) { prevIndex = boxes.length - 1 }
        else { prevIndex = currentIndex == 0 ? boxes.length - 1 : currentIndex - 1 }

        prevBox = boxes[prevIndex]
        if (prevBox) prevBox.focus()
    }
    else if (direction == "Down"){
        let nextIndex
        if (currentIndex == -1) { nextIndex = 0 }
        else { nextIndex = currentIndex == boxes.length - 1 ? 0 : currentIndex + 1 }

        nextBox = boxes[nextIndex]
        if (nextBox) nextBox.focus()
    }
}

async function openBookmarkSettingModal(bookmarkHashcode){
    let bookmark = await chrome.runtime.sendMessage({ event_key : "GET_BOOKMARK_BY_HASHCODE" , hashcode : bookmarkHashcode})
}