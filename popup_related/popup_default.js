document.addEventListener("DOMContentLoaded", () =>{
    addBookmarkButton = document.getElementById("AddBoomarkButton")

    addBookmarkButton.addEventListener("click", () =>{
        window.location.href = "/popup_related/popup_add_bookmark.html"
    })

    searchButton = document.getElementById("SearchButton")
    searchButton.addEventListener("click", ()=>{
        searchKey()
    })
})

function searchKey() {
    searchBox = document.getElementById("SearchBox")

    inputField = searchBox.querySelector("input")
    inputKey = inputField.value
    console.log(`Input Key : ${inputKey}`)
}
