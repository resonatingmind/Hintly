document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector(".start-btn");
    const updateBtn = document.querySelector(".update-btn");
    const langButton = document.getElementById("save-lang-btn");
    const initialCard = document.querySelector(".initial-card");
    const showCard = document.querySelector(".show-card");
    button.addEventListener("click", handleClick);
    updateBtn.addEventListener("click", handleUpdateClick);
    langButton.addEventListener("click", handleLangClick);

    const api=chrome.storage.local.get("openai_api_key", (data) => {
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

async function handleClick() {
    const apiKey = document.querySelector('.api-input').value;
    const loader = document.getElementById('loader');
    const btnTxt = document.querySelector('.btn-txt');
    const input = document.querySelector('.api-input');
    const dialog = document.querySelector('.dialog');
    input.disabled = true;
    btnTxt.style.display = 'none';
    loader.style.display = 'block';
    const isValid = await validateOpenAIKey(apiKey); const button = document.querySelector('.start-btn');
    if (!isValid) {
        dialog.textContent = "Invalid API key. Please try again.";
        dialog.classList.add('error');
        input.disabled = false;
        btnTxt.style.display = 'block';
        loader.style.display = 'none';
        return;
    }
    // Store in chrome.storage.local
    chrome.storage.local.set({ preferredLanguage: "C++" });
    chrome.storage.local.set({ openai_api_key: apiKey }, () => {
        window.close(); // Close the popup after saving
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
    const dialog = document.querySelector('.dialog');
    dialog.textContent = "";
    const selectedLanguage = document.getElementById('language-select').value;
    chrome.storage.local.set({ preferredLanguage: selectedLanguage }, () => {
        dialog.textContent = `Preferred language set to ${selectedLanguage}`;
        dialog.classList.add('success');
    });
}

async function handleUpdateClick() {
    const apiKey = document.getElementById('update-api-input').value;
    const loader = document.getElementById('loader');
    const btnTxt = document.querySelector('.btn-txt');
    const input = document.querySelector('.api-input');
    const dialog = document.querySelector('.dialog');
    dialog.textContent = "";
    input.disabled = true;
    btnTxt.style.display = 'none';
    loader.style.display = 'block';
    const isValid = await validateOpenAIKey(apiKey);
    if (!isValid) {
        dialog.textContent = "Invalid API key. Please try again.";
        dialog.classList.add('error');
        input.disabled = false;
        btnTxt.style.display = 'block';
        loader.style.display = 'none';
        return;
    }
    // Store in chrome.storage.local
    chrome.storage.local.set({ openai_api_key: apiKey }, () => {
        dialog.textContent = "API key updated successfully.";
        dialog.classList.add('success');
        input.disabled = false;
        btnTxt.style.display = 'block';
        loader.style.display = 'none';
    });
}