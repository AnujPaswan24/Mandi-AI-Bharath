// Global variables
let isRecording = false;
let recognition = null;
let currentLanguage = 'hi';
let tickerNews = [
    'गेहूं की कीमत में 2% की वृद्धि • Wheat prices up 2% • ',
    'प्याज का निर्यात बढ़ा • Onion exports increased • ',
    'टमाटर की नई किस्म बाजार में • New tomato variety in market • ',
    'मानसून की बारिश से फसल में सुधार • Monsoon improves crop yield • ',
    'किसान सब्सिडी योजना शुरू • Farmer subsidy scheme launched • ',
    'चावल की खरीद शुरू • Rice procurement begins • ',
    'सब्जी मंडी में नए नियम • New rules in vegetable market • ',
    'कृषि तकनीक में नवाचार • Innovation in agriculture technology • '
];
let currentTickerIndex = 0;

// Language configurations
const languages = {
    'hi': { code: 'hi-IN', name: 'हिंदी' },
    'en': { code: 'en-IN', name: 'English' },
    'ta': { code: 'ta-IN', name: 'தமிழ்' },
    'te': { code: 'te-IN', name: 'తెలుగు' },
    'bn': { code: 'bn-IN', name: 'বাংলা' },
    'gu': { code: 'gu-IN', name: 'ગુજરાતી' }
};

// Translation mappings (simplified for demo)
const translations = {
    'hi': {
        'micReady': 'बोलने के लिए तैयार',
        'listening': 'सुन रहा हूँ...',
        'processing': 'प्रोसेसिंग...',
        'micPress': 'माइक दबाएं',
        'send': 'भेजें',
        'placeholder': 'यहाँ टाइप करें या माइक का उपयोग करें...'
    },
    'en': {
        'micReady': 'Ready to speak',
        'listening': 'Listening...',
        'processing': 'Processing...',
        'micPress': 'Press Mic',
        'send': 'Send',
        'placeholder': 'Type here or use microphone...'
    },
    'ta': {
        'micReady': 'பேச தயார்',
        'listening': 'கேட்கிறது...',
        'processing': 'செயலாக்கம்...',
        'micPress': 'மைக் அழுத்தவும்',
        'send': 'அனுப்பு',
        'placeholder': 'இங்கே தட்டச்சு செய்யவும் அல்லது மைக்ரோஃபோனைப் பயன்படுத்தவும்...'
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeSpeechRecognition();
    setupEventListeners();
    updatePrices();
    updateNewsTicker();
    setInterval(updatePrices, 120000); // Update prices every 2 minutes
    setInterval(updateNewsTicker, 10000); // Update news ticker every 10 seconds
});

// Setup event listeners
function setupEventListeners() {
    const micButton = document.getElementById('micButton');
    const sendButton = document.getElementById('sendButton');
    const messageInput = document.getElementById('messageInput');
    const languageSelect = document.getElementById('languageSelect');

    micButton.addEventListener('click', toggleRecording);
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    languageSelect.addEventListener('change', changeLanguage);
}

// Initialize speech recognition
function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = languages[currentLanguage].code;
        
        recognition.onstart = function() {
            updateStatus('listening');
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('messageInput').value = transcript;
            updateStatus('processing');
            setTimeout(() => {
                sendMessage();
                updateStatus('micReady');
            }, 1000);
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            updateStatus('micReady');
            stopRecording();
        };
        
        recognition.onend = function() {
            stopRecording();
        };
    } else {
        console.warn('Speech recognition not supported');
    }
}

// Toggle recording
function toggleRecording() {
    if (!recognition) {
        alert('Speech recognition not supported in this browser');
        return;
    }
    
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

// Start recording
function startRecording() {
    isRecording = true;
    const micButton = document.getElementById('micButton');
    micButton.classList.add('recording');
    recognition.start();
}

// Stop recording
function stopRecording() {
    isRecording = false;
    const micButton = document.getElementById('micButton');
    micButton.classList.remove('recording');
    if (recognition) {
        recognition.stop();
    }
    updateStatus('micReady');
}

// Update status text
function updateStatus(status) {
    const statusText = document.getElementById('statusText');
    const micText = document.querySelector('.mic-text');
    
    const currentTranslations = translations[currentLanguage] || translations['hi'];
    
    statusText.textContent = currentTranslations[status];
    if (status === 'micReady') {
        micText.textContent = currentTranslations['micPress'];
    }
}

// Send message
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    addMessageToChat(message, 'farmer');
    messageInput.value = '';
    
    // Simulate translation and response
    setTimeout(() => {
        const translatedMessage = simulateTranslation(message);
        addMessageToChat(translatedMessage, 'buyer');
    }, 1500);
}

// Add message to chat
function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const translation = simulateTranslation(message);
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="original">${message}</div>
            <div class="translation">${translation}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Simulate translation (in real app, this would call translation API)
function simulateTranslation(text) {
    const translations = {
        'मेरे पास अच्छे टमाटर हैं': 'I have good tomatoes',
        'क्या दाम है?': 'What is the price?',
        '40 रुपये किलो': '40 rupees per kg',
        'Can you do 35 rupees?': 'क्या आप 35 रुपये कर सकते हैं?',
        'Deal!': 'सौदा पक्का!',
        'Good quality': 'अच्छी गुणवत्ता',
        'Fresh vegetables': 'ताज़ी सब्जियां'
    };
    
    return translations[text] || `[Translated: ${text}]`;
}

// Change language
function changeLanguage() {
    const languageSelect = document.getElementById('languageSelect');
    currentLanguage = languageSelect.value;
    
    if (recognition) {
        recognition.lang = languages[currentLanguage].code;
    }
    
    updateUILanguage();
}

// Update UI language
function updateUILanguage() {
    const currentTranslations = translations[currentLanguage] || translations['hi'];
    
    document.getElementById('statusText').textContent = currentTranslations['micReady'];
    document.querySelector('.mic-text').textContent = currentTranslations['micPress'];
    document.getElementById('sendButton').textContent = currentTranslations['send'];
    document.getElementById('messageInput').placeholder = currentTranslations['placeholder'];
}

// Update market prices (simulate real-time data)
function updatePrices() {
    const priceItems = document.querySelectorAll('.city-price');
    
    priceItems.forEach(item => {
        const currentPrice = item.textContent.match(/₹([\d,]+)/);
        if (currentPrice) {
            const price = parseInt(currentPrice[1].replace(',', ''));
            const variation = Math.floor(Math.random() * 20) - 10; // ±10 variation
            const newPrice = Math.max(price + variation, 10);
            
            item.textContent = item.textContent.replace(/₹[\d,]+/, `₹${newPrice.toLocaleString('en-IN')}`);
            
            // Add visual feedback for price changes
            item.style.transition = 'all 0.5s ease';
            if (variation > 0) {
                item.style.color = '#28a745';
                setTimeout(() => { item.style.color = ''; }, 2000);
            } else if (variation < 0) {
                item.style.color = '#dc3545';
                setTimeout(() => { item.style.color = ''; }, 2000);
            }
        }
    });
    
    // Update timestamp
    const timeAgo = Math.floor(Math.random() * 5) + 1;
    const lastUpdatedElement = document.querySelector('.last-updated');
    if (lastUpdatedElement) {
        lastUpdatedElement.textContent = `अंतिम अपडेट: ${timeAgo} मिनट पहले`;
    }
}

// Update news ticker with fresh content
function updateNewsTicker() {
    const tickerContent = document.getElementById('tickerContent');
    if (tickerContent) {
        // Rotate through news items
        currentTickerIndex = (currentTickerIndex + 1) % tickerNews.length;
        
        // Create new ticker content with multiple news items
        let newContent = '';
        for (let i = 0; i < 3; i++) {
            const index = (currentTickerIndex + i) % tickerNews.length;
            newContent += `<span class="ticker-item">${tickerNews[index]}</span>`;
        }
        
        tickerContent.innerHTML = newContent;
        
        // Reset animation
        tickerContent.style.animation = 'none';
        setTimeout(() => {
            tickerContent.style.animation = 'scroll 30s linear infinite';
        }, 10);
    }
}

// Quick action handlers
document.addEventListener('click', function(e) {
    if (e.target.closest('.action-button')) {
        const button = e.target.closest('.action-button');
        const action = button.querySelector('span:last-child').textContent;
        
        // Add visual feedback
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
        
        // Handle different actions
        switch(action) {
            case 'आज के भाव':
                alert('आज के भाव देखे जा रहे हैं...');
                break;
            case 'ट्रांसपोर्ट':
                alert('ट्रांसपोर्ट सेवा जल्द आएगी...');
                break;
            case 'पेमेंट':
                alert('पेमेंट सिस्टम जल्द आएगा...');
                break;
            case 'संपर्क':
                alert('संपर्क सूची खुल रही है...');
                break;
        }
    }
});

// Add some sample interactions on load
setTimeout(() => {
    addMessageToChat('नमस्ते! मुझे टमाटर चाहिए', 'buyer');
}, 2000);

setTimeout(() => {
    addMessageToChat('Hello! I need tomatoes', 'farmer');
}, 4000);