// Wait for the HTML document to be fully loaded before running any script
document.addEventListener('DOMContentLoaded', () => {

    // 1. Select necessary HTML elements
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const profileBtn = document.getElementById('profile-btn');
    const modal = document.getElementById('profile-modal');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    
    // NEWLY ADDED ELEMENTS
    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('file-input');
    
    // Profile data object (to store user info)
    let userProfile = {
        age: null,
        gender: null,
        height: null,
        weight: null,
        activity: null
    };

    // --- EVENT LISTENERS ---

    // Send text message
    sendBtn.addEventListener('click', sendTextMessage);
    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') sendTextMessage();
    });

    // Open/close modal
    profileBtn.addEventListener('click', () => {
        modal.classList.add('show');
    });
    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });
    
    // Save profile
    saveProfileBtn.addEventListener('click', () => {
        // Get data from form and save to our object
        userProfile.age = document.getElementById('age').value;
        userProfile.gender = document.getElementById('gender').value;
        userProfile.height = document.getElementById('height').value;
        userProfile.weight = document.getElementById('weight').value;
        userProfile.activity = document.getElementById('activity').value;

        modal.classList.remove('show'); // Close modal
        
        // Inform the user
        addBotMessage("Your profile has been updated successfully!");
    });
    
    // Photo button click
    uploadBtn.addEventListener('click', () => {
        fileInput.click(); // Trigger the hidden file input
    });
    
    // When a photo is selected
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return; // User cancelled
        
        // Use FileReader to show a preview on the frontend
        const reader = new FileReader();
        reader.onload = (e) => {
            // Add the photo as a user message (Green Bubble)
            addUploadedImage(e.target.result);
        };
        reader.readAsDataURL(file);

        // Delay for a fake bot response
        setTimeout(() => {
            // Send the filename as userQuery, and specify this is a photo (true)
            showBotResponse(file.name, true); 
        }, 1000);

        // Reset the input to allow selecting the same file again
        fileInput.value = null;
    });


    // --- MAIN FUNCTIONS ---

    // Sends text messages only
    function sendTextMessage() {
        const messageText = userInput.value.trim();
        if (messageText === "") return; // Don't send empty messages

        addUserMessage(messageText);
        userInput.value = ""; // Clear input
        scrollToBottom();

        // Fake bot response delay
        setTimeout(() => {
            showBotResponse(messageText, false); // false = this is not not a photo
        }, 1000); 
    }

    // Add user message (plain text) to chat
    function addUserMessage(text) {
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'message user';
        userMessageDiv.innerText = text;
        chatMessages.appendChild(userMessageDiv);
    }
    
    // Add user message (photo) to chat
    function addUploadedImage(imageBase64) {
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'message user';
        // We use innerHTML to add the <img> tag
        userMessageDiv.innerHTML = `
            <img src="${imageBase64}" alt="Uploaded Photo" class="uploaded-image">
        `;
        chatMessages.appendChild(userMessageDiv);
        scrollToBottom();
    }

    // Add bot message (plain text) to chat
    function addBotMessage(text) {
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'message bot';
        botMessageDiv.innerText = text;
        chatMessages.appendChild(botMessageDiv);
        scrollToBottom();
    }

    // Show bot response (Card Design)
    function showBotResponse(userQuery, isImage = false) {
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'message bot';
        
        // --- Fake Calculation Logic ---
        let cal = 150; // Base calories
        if (userProfile.weight) {
            cal += parseInt(userProfile.weight); // Add weight (fake logic)
        }
        if (isImage) {
            cal += 100; // Photo analysis (supposedly) found more calories
        }
        cal = Math.round(cal);
        // --- End Fake Logic ---

        let responseText = "";
        if (isImage) {
            responseText = `Analyzing the photo you sent ('${userQuery}'). Estimated breakdown:`;
        } else {
            responseText = `Estimated breakdown for '${userQuery}':`;
        }
        
        if (userProfile.weight) {
            responseText += ` (adjusted for your ${userProfile.weight} kg profile).`;
        }

        // Use innerHTML to create the card
        botMessageDiv.innerHTML = `
            ${responseText}
            <div class="result-card">
                <table>
                    <tr>
                        <td><strong>Total Calories</strong></td>
                        <td class="total-calories"><strong>~${cal} kcal</strong></td>
                    </tr>
                    <tr>
                        <td>Protein</td>
                        <td>~${isImage ? 25 : 15} g</td>
                    </tr>
                    <tr>
                        <td>Fat</td>
                        <td>~${isImage ? 12 : 10} g</td>
                    </tr>
                </table>
            </div>
        `;
        chatMessages.appendChild(botMessageDiv);
        scrollToBottom(); 
    }

    // Scrolls to the bottom on every new message
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

}); // End of DOMContentLoaded