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

async function submitForm() {
    keyInputField = document.getElementById("KeyInputField");
    keyInput = keyInputField.querySelector("input");
    keyValue = keyInput.value;
    keyInput.value = "";

    urlInputField = document.getElementById("URLInputField");
    urlInput = urlInputField.querySelector("input");
    urlValue = urlInput.value;
    urlInput.value = "";

    isSuccess = await chrome.runtime.sendMessage({ event_key : "ADD_BOOKMARK" , name : keyValue, url : urlValue})

    if (isSuccess) displaySuccessAlram()
    else displayFailAlram()
}


