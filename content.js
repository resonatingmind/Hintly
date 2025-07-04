// Create "Ask AI" floating button
const aiButton = document.createElement("button");
aiButton.innerText = "Ask AI";

// Create chatbot container
const chatBot = document.createElement("div");

Object.assign(chatBot.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: "9999",
    width: "360px",
    height: "480px",
    backgroundColor: "#fff",
    color: "#222",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
    display: "none",
    flexDirection: "column",
    overflow: "hidden",
    fontFamily: "Segoe UI, Arial, sans-serif",
});

// Clear previous content
chatBot.innerHTML = "";
// Header
const header = document.createElement("div");
Object.assign(header.style, {
    background: "#3b82f6",
    color: "#fff",
    padding: "14px 18px",
    fontWeight: "bold",
    fontSize: "16px",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
    letterSpacing: "0.5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative"
});

// Header icon and title
const headerLeft = document.createElement("div");
headerLeft.style.display = "flex";
headerLeft.style.alignItems = "center";

const logo = document.createElement("div");
logo.innerText = "💡";
logo.style.fontSize = "20px";
logo.style.marginRight = "8px";

const title = document.createElement("div");
title.innerText = "Hintly";

headerLeft.appendChild(logo);
headerLeft.appendChild(title);

// Close button
const closeBtn = document.createElement("button");
closeBtn.innerText = "×";
Object.assign(closeBtn.style, {
    background: "transparent",
    color: "#fff",
    border: "none",
    fontSize: "20px",
    cursor: "pointer"
});
closeBtn.addEventListener("click", () => {
    chatBot.style.display = "none";
    aiButton.style.display = "block";
});

header.appendChild(headerLeft);
header.appendChild(closeBtn);

// Chat area
const chatArea = document.createElement("div");
Object.assign(chatArea.style, {
    flex: "1",
    padding: "12px",
    overflowY: "auto",
    background: "#f9fafb",
    fontSize: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
});
chatArea.id = "hintly-chat-area";

// Helper to add messages
function addMessage(content, sender) {
    const message = document.createElement("div");
    message.innerText = content;
    message.style.padding = "8px 12px";
    message.style.borderRadius = "12px";
    message.style.maxWidth = "80%";
    message.style.wordWrap = "break-word";
    if (sender === "user") {
        message.style.alignSelf = "flex-end";
        message.style.backgroundColor = "#3b82f6";
        message.style.color = "#fff";
    } else {
        message.style.alignSelf = "flex-start";
        message.style.backgroundColor = "#e5e7eb";
        message.style.color = "#111";
    }
    chatArea.appendChild(message);
    chatArea.scrollTop = chatArea.scrollHeight;
}

// Bottom container
const bottomContainer = document.createElement("div");
Object.assign(bottomContainer.style, {
    display: "flex",
    flexDirection: "column",
    padding: "8px",
    borderTop: "1px solid #e5e7eb",
    background: "#fff",
    gap: "6px"
});

// Buttons container
const buttonsRow = document.createElement("div");
buttonsRow.style.display = "flex";
buttonsRow.style.justifyContent = "space-between";
buttonsRow.style.gap = "8px";

const getHintBtn = document.createElement("button");
getHintBtn.innerText = "Get Hint";
Object.assign(getHintBtn.style, {
    flex: "1",
    background: "#f59e0b",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px"
});

const getSolutionBtn = document.createElement("button");
getSolutionBtn.innerText = "Get Solution";
Object.assign(getSolutionBtn.style, {
    flex: "1",
    background: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px"
});

// Custom message input + send
const messageRow = document.createElement("div");
Object.assign(messageRow.style, {
    display: "flex",
    alignItems: "center",
    gap: "6px"
});

const textArea = document.createElement("textarea");
Object.assign(textArea.style, {
    flex: "1",
    resize: "none",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    padding: "8px",
    fontSize: "14px",
    outline: "none",
    minHeight: "36px",
    maxHeight: "80px"
});
textArea.placeholder = "Type your question...";

const sendBtn = document.createElement("button");
sendBtn.innerText = "Send";
Object.assign(sendBtn.style, {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "8px 12px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px"
});

const rawTitle = getInnerText('.problem-statement .header .title');
const probTitle = rawTitle ? rawTitle.split('.').slice(1).join('.').trim() : "";

const timeLimitEl = document.querySelector('.problem-statement .header .time-limit');
const timeLimit = timeLimitEl && timeLimitEl.lastChild ? timeLimitEl.lastChild.textContent.trim() : "";

const memoryLimitEl = document.querySelector('.problem-statement .header .memory-limit');
const memoryLimit = memoryLimitEl && memoryLimitEl.lastChild ? memoryLimitEl.lastChild.textContent.trim() : "";

let description = "";
const ps = document.getElementById('problem-statement');
if (ps && ps.children.length >= 2) {
    description = ps.children[1].innerText.trim();
}
const inputSpec = getInnerText('.problem-statement .input-specification');
const outputSpec = getInnerText('.problem-statement .output-specification');
const examples = getInnerText('.problem-statement .sample-test');
const note = getInnerText('.problem-statement .note');

// Prompts for OpenAI API
const prompts = [`You are Hintly. Provide a single actionable hint for the following competitive programming problem to help the user move forward without revealing the complete solution. Be concise, clear, and avoid giving away full logic.

Problem Title: ${probTitle}

Time Limit: {timeLimit}
Memory Limit: ${memoryLimit}

Description:
${description}

Input Specification:
${inputSpec}

Output Specification:
${outputSpec}

Examples:
${examples}

Note:
${note}
`,
`You are Hintly. Provide a clear, step-by-step solution with a clean implementation in C++ for the following competitive programming problem.

Problem Title: ${probTitle}

Time Limit: {timeLimit}
Memory Limit: ${memoryLimit}

Description:
${description}

Input Specification:
${inputSpec}

Output Specification:
${outputSpec}

Examples:
${examples}

Note:
${note}
`,
`You are Hintly. The user has asked the following question regarding the given competitive programming problem:

Here are the problem details to assist you:

Problem Title: ${probTitle}

Time Limit: {timeLimit}
Memory Limit: ${memoryLimit}

Description:
${description}

Input Specification:
${inputSpec}

Output Specification:
${outputSpec}

Examples:
${examples}

Note:
${note}

Please answer the user's query clearly and concisely.
`]

// Event listeners
getHintBtn.addEventListener("click", async () => {
    const apiKey = await chrome.storage.local.get("openai_api_key").then(data => data.openai_api_key);
    const responseText = await callOpenAI(prompts[0], apiKey, "hint");
    addMessage(responseText, "bot");
});
getSolutionBtn.addEventListener("click", async () => {
    const apiKey = await chrome.storage.local.get("openai_api_key").then(data => data.openai_api_key);
    const responseText = await callOpenAI(prompts[1], apiKey, "solution");
    addMessage(responseText, "bot");
});
sendBtn.addEventListener("click", async () => {
    const apiKey = await chrome.storage.local.get("openai_api_key").then(data => data.openai_api_key);
    const message = textArea.value.trim();
    const userQuery = message;
    userQuery ? prompts[2] = `You are Hintly. The user has asked the following question regarding the given competitive programming problem:

User Query: ${userQuery}

Here are the problem details to assist you:

Problem Title: ${probTitle}

Time Limit: {timeLimit}
Memory Limit: ${memoryLimit}

Description:
${description}

Input Specification:
${inputSpec}

Output Specification:
${outputSpec}

Examples:
${examples}

Note:
${note}

Please answer the user's query clearly and concisely.
`: `
You are Hintly. The user has asked the following question regarding the given competitive programming problem:

Here are the problem details to assist you:

Problem Title: ${probTitle}

Time Limit: {timeLimit}
Memory Limit: ${memoryLimit}

Description:
${description}

Input Specification:
${inputSpec}

Output Specification:
${outputSpec}

Examples:
${examples}

Note:
${note}

Please answer the user's query clearly and concisely.
`;
    if (message) {
        addMessage(message, "user");
        textArea.value = "";
        const responseText = await callOpenAI(prompts[2], apiKey, "query");
        addMessage(responseText, "bot");
    }
});

const callOpenAI = async (prompt, apiKey, type) => {
    try {
        const temperature = type === "solution" ? 0.0 : 0.3;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // or "gpt-4o-mini", fallback to "gpt-3.5-turbo" if needed
                store:true,
                max_tokens: 1500,
                messages: [
                    {
                        role: "system",
                        content: "You are Hintly, a competitive programming assistant that provides clear, concise hints and clean C++ solutions without revealing full solutions unless explicitly asked."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();

    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        return `Error fetching ${type}: ${error.message}`;
    }
};


// Assemble bottom container
buttonsRow.appendChild(getHintBtn);
buttonsRow.appendChild(getSolutionBtn);
messageRow.appendChild(textArea);
messageRow.appendChild(sendBtn);
bottomContainer.appendChild(buttonsRow);
bottomContainer.appendChild(messageRow);

// Assemble chatbot
chatBot.appendChild(header);
chatBot.appendChild(chatArea);
chatBot.appendChild(bottomContainer);

// Style the "Ask AI" button
Object.assign(aiButton.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: "9999",
    padding: "10px 16px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
});

// Hover effect
aiButton.addEventListener("mouseenter", () => {
    aiButton.style.backgroundColor = "#2563eb";
});
aiButton.addEventListener("mouseleave", () => {
    aiButton.style.backgroundColor = "#3b82f6";
});

// On click, show chatbot and hide button
aiButton.addEventListener("click", () => {
    const apiKey = chrome.storage.local.get("openai_api_key", (data) => {
        if (!data.openai_api_key) {
            alert("Please set your OpenAI API key by clicking on the extension icon.");
            return;
        }
        else {
            chatBot.style.display = "flex";
            aiButton.style.display = "none";
            addMessage("Hello! How can I assist you today?", "bot");
            return data.openai_api_key;
        }
    });
});

// Append to DOM
document.body.appendChild(aiButton);
document.body.appendChild(chatBot);

//Fetching problem statement from the page

function getInnerText(selector) {
    const el = document.querySelector(selector);
    return el ? el.innerText.trim() : "";
}