document.addEventListener("DOMContentLoaded", () =>{
    addBookmarkButton = document.getElementById("AddBoomarkButton")

    addBookmarkButton.addEventListener("click", () =>{
        window.location.href = "/popup_related/popup_add_bookmark.html"
    })

    searchButton = document.getElementById("SearchButton")
    searchButton.addEventListener("click", ()=>{
        searchBookmarks()
    })
})

async function searchBookmarks() {
    searchBox = document.getElementById("SearchBox")

    inputField = searchBox.querySelector("input")
    inputKey = inputField.value
    
    result = await chrome.runtime.sendMessage({ event_key : "GET_BOOKMARKS" , name : inputKey})
    
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
    bookmarkBox.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.update(tabs[0].id, { url: url })
        })
    })
    //TODO : Refactor this fucking hack
    bookmarkBox.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault() // Space 스크롤 방지
            bookmarkBox.click()
        }
    })

    let deleteButton = document.createElement("button")
    deleteButton.id = "DeleteButton"
    let deleteButtonImg = document.createElement("img")
    deleteButtonImg.src = "/assets/delete_icon.png"
    
    deleteButton.appendChild(deleteButtonImg)
    deleteButton.addEventListener("click", async (e) => {
        e.stopPropagation()
        let isSuccess = await chrome.runtime.sendMessage({ event_key : "REMOVE_BOOKMARK", hashcode : key})

        if (isSuccess){
            bookmarkBox.remove();
        }   
    })

    let nameBox = document.createElement("div")
    nameBox.id = "Name"
    nameBox.textContent = name

    let urlBox = document.createElement("div")
    urlBox.id = "Url"
    urlBox.textContent = url

    bookmarkBox.appendChild(nameBox)
    bookmarkBox.appendChild(urlBox)
    bookmarkBox.appendChild(deleteButton)
    parentBox.appendChild(bookmarkBox)
}

