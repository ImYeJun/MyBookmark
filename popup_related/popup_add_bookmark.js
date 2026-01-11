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
    
    urlInputField = document.getElementById("URLInputField");
    urlInput = urlInputField.querySelector("input");
    urlValue = urlInput.value;
    
    result = await chrome.runtime.sendMessage({ event_key : "ADD_BOOKMARK" , name : keyValue, url : urlValue})
    
    if (result.isSuccess) {
        keyInput.value = "";
        urlInput.value = "";

        displayAlaram("Success", result.subText)
    }
    else displayAlaram("Fail", result.subText)
}


let alarmTimer = null;
const ALARM_DUATION = 5000;
function displayAlaram(type, subTextContent){
    alarmBox = document.getElementById("AlarmBox")
    mainText = alarmBox.querySelector("#MainText")
    subText = alarmBox.querySelector("#SubText")

    alarmBox.classList.remove("Success", "Fail")

    switch (type){
        case "Success":
            alarmBox.classList.add("Success");
            mainText.textContent = "Success to Create Bookmark"
            subText.textContent = subTextContent
            break;
        case "Fail":
            alarmBox.classList.add("Fail");
            mainText.textContent = "Fail to Create Bookmark"
            subText.textContent = subTextContent
            break;
        default:
            console.error(`${type} is not valid`);
            return;
    }

    if (alarmTimer){
        clearTimeout(alarmTimer);
        alarmTimer = null;
    }

    alarmTimer = setTimeout(() => {
        alarmBox.classList.remove("Success", "Fail");
        alarmTimer = null;
    }, ALARM_DUATION)
}
