document.addEventListener("DOMContentLoaded", ()=>{
    goBackButton = document.getElementById("GoBackButton")

    goBackButton.addEventListener("click", ()=>{
        window.location.href = "/popup_related/popup_default.html"
    })
})