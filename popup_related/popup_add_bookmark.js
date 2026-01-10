document.addEventListener("DOMContentLoaded", ()=>{
    goBackButton = document.getElementById("GoBackButton")

    goBackButton.addEventListener("click", ()=>{
        window.location.href = "/popup_related/popup_default.html"
    })

    submitButton = document.getElementById("SubmitButton");
    submitButton.addEventListener("click", ()=>{
        submitForm();
    })
})

function submitForm() {
    keyInputField = document.getElementById("KeyInputField");
    keyInput = keyInputField.querySelector("input");
    keyValue = keyInput.value;

    urlInputField = document.getElementById("URLInputField");
    urlInput = urlInputField.querySelector("input");
    urlValue = urlInput.value;

    console.log(`Input Key : ${keyValue}, Input URL : ${urlValue}`);
}
