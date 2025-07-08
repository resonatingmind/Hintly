document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector(".start-btn");
    const updateBtn = document.querySelector(".update-btn");
    const langButton = document.getElementById("save-lang-btn");
    const initialCard = document.querySelector(".initial-card");
    const showCard = document.querySelector(".show-card");
    const closeBtn = document.querySelectorAll(".close-btn")[0];
    const closeBtnTwo = document.querySelectorAll(".close-btn")[1];
    const resetKey = document.getElementsByClassName("reset-key")[0];
    resetKey.addEventListener("click", handleResetKey);
    closeBtn.addEventListener("click", () => {
        window.close(); // Close the popup when the close button is clicked 
    });
    closeBtnTwo.addEventListener("click", () => {
        window.close(); // Close the popup when the close button is clicked 
    });
    button.addEventListener("click", handleClick);
    updateBtn.addEventListener("click", handleUpdateClick);
    langButton.addEventListener("click", handleLangClick);

    const api = chrome.storage.local.get("openai_api_key", (data) => {
        const apiKey = data.openai_api_key || "";
        const input = document.querySelector('.api-input');
        input.disabled = false;
        if (apiKey) {
            initialCard.style.display = "none";
            showCard.style.display = "flex";
        } else {
            initialCard.style.display = "flex";
            showCard.style.display = "none";
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const updateSelect = document.getElementById('language-select');
    if (updateSelect && chrome && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['preferredLanguage'], function (result) {
            if (result.preferredLanguage) {
                updateSelect.value = result.preferredLanguage;
            }
        });
    }
});

function handleResetKey() {
    chrome.storage.local.set({ openai_api_key: null }, () => {
        const dialog = document.querySelector('.dialog');
        const clickBtn = document.querySelector(".start-btn");
        dialog.textContent = "API key has been reset. Please enter a new key.";
        dialog.classList.add('success');
        setTimeout(() => {
            dialog.textContent = "";
            dialog.style.display = 'none';
        }, 3000)

        const initialCard = document.querySelector(".initial-card");
        const showCard = document.querySelector(".show-card");
        initialCard.style.display = "flex";
        showCard.style.display = "none";
        const input = document.querySelector('.api-input');
        input.value = "";
        input.disabled = false;
        input.style.cursor = 'text';
        const btnTxt = document.querySelector('.btn-txt');
        btnTxt.style.display = 'block';
        clickBtn.disabled = false;
        clickBtn.style.cursor = 'pointer';
        const loader = document.getElementById('loader');
        loader.textContent = 'Validating...'
        loader.style.display = 'none';
        document.getElementById('language-select-start').disabled = false;
        document.getElementById('language-select-start').style.cursor = 'pointer';
    });
}

async function handleClick() {
    const clickBtn = document.querySelector(".start-btn");
    const apiKey = document.querySelector('.api-input').value;
    const loader = document.getElementById('loader');
    const btnTxt = document.querySelector('.btn-txt');
    const input = document.querySelector('.api-input');
    const dialog = document.querySelector('.dialog');
    const initialCard = document.querySelector(".initial-card");
    const showCard = document.querySelector(".show-card");
    const startSelectedLanguage = document.getElementById('language-select-start').value;
    document.getElementById('language-select-start').disabled = true;
    document.getElementById('language-select-start').style.cursor = 'not-allowed';
    input.disabled = true;
    input.style.cursor = 'not-allowed';
    clickBtn.disabled = true;
    clickBtn.style.cursor = 'not-allowed';
    btnTxt.style.display = 'none';
    loader.style.display = 'block';
    const isValid = await validateOpenAIKey(apiKey); const button = document.querySelector('.start-btn');
    if (!isValid) {
        dialog.textContent = "Invalid API key. Please try again.";
        dialog.classList.add('error');
        dialog.style.display = 'block';
        setTimeout(() => {
            dialog.style.display = 'none';
            dialog.textContent = "";
        }, 3000);
        input.disabled = false;
        input.style.cursor = 'pointer';
        document.getElementById('language-select-start').disabled = false;
        document.getElementById('language-select-start').style.cursor = 'pointer';
        clickBtn.disabled = false;
        clickBtn.style.cursor = 'pointer';
        btnTxt.style.display = 'block';
        loader.style.display = 'none';
        return;
    }
    // Store in chrome.storage.local
    chrome.storage.local.set({ preferredLanguage: startSelectedLanguage });
    chrome.storage.local.set({ openai_api_key: apiKey }, () => {
        loader.textContent = "Saved Successfully!";
        setTimeout(() => {
            initialCard.style.display = "none";
            showCard.style.display = "flex";
        }, 1000)
    });
}

//Validate the OpenAI API key
async function validateOpenAIKey(apiKey) {
    try {
        const response = await fetch("https://api.openai.com/v1/models", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${apiKey}`
            }
        });
        if (response.status === 200) {
            console.log("API key is valid.");
            return true;
        } else {
            console.log("API key is Invalid.");
            return false; // Invalid key or expired
        }
    } catch (error) {
        console.log("API key is invalid.");
        return false;
    }
}

async function handleLangClick() {
    const dialog = document.querySelector('.dialogTwo');
    dialog.textContent = "";
    const selectedLanguage = document.getElementById('language-select').value;
    chrome.storage.local.set({ preferredLanguage: selectedLanguage }, () => {
        dialog.textContent = `Preferred language set to ${selectedLanguage}`;
        dialog.classList.add('success');
        setTimeout(() => {
            dialog.textContent = "";
            dialog.style.display = 'none';
        }, 3000)
    });
}

async function handleUpdateClick() {
    const apiKey = document.getElementById('update-api-input').value;
    const loader = document.getElementById('loader');
    const btnTxt = document.querySelector('.btn-txt');
    const input = document.querySelector('.api-input');
    const dialog = document.querySelector('.dialogTwo');
    dialog.textContent = "";
    input.disabled = true;
    btnTxt.style.display = 'none';
    loader.style.display = 'block';
    const isValid = await validateOpenAIKey(apiKey);
    if (!isValid) {
        dialog.textContent = "Invalid API key. Please try again.";
        dialog.classList.add('error');
        setTimeout(() => {
            dialog.textContent = "";
            dialog.style.display = 'none';
        }, 3000)
        input.disabled = false;
        btnTxt.style.display = 'block';
        loader.style.display = 'none';
        return;
    }

    chrome.storage.local.set({ openai_api_key: apiKey }, () => {
        dialog.textContent = "API key updated successfully.";
        dialog.classList.add('success');
        setTimeout(() => {
            dialog.textContent = "";
            dialog.style.display = 'none';
        }, 3000)
        input.disabled = false;
        btnTxt.style.display = 'block';
        loader.style.display = 'none';
    });
}