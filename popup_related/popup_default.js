document.addEventListener("DOMContentLoaded", () =>{
    console.log("loaded!");
    addBookmarkButton = document.getElementById("AddBoomarkButton")

    addBookmarkButton.addEventListener("click", () =>{
        window.location.href = "/popup_related/popup_add_bookmark.html"
    })
})