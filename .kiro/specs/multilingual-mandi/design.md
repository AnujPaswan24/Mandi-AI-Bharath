# Design Document: The Multilingual Mandi

## Overview

The Multilingual Mandi is a progressive web application designed to bridge language barriers in Indian agricultural markets. The system provides real-time voice and text translation, live market pricing, and bilingual negotiation tools through an accessible, mobile-first interface optimized for rural users with limited technical literacy.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                     │
├─────────────────────────────────────────────────────────────┤
│  Mobile-First UI  │  Voice Interface  │  Chat Interface    │
├─────────────────────────────────────────────────────────────┤
│                   Application Layer                         │
├─────────────────────────────────────────────────────────────┤
│ Translation Engine │ Price Discovery  │ Negotiation Manager│
├─────────────────────────────────────────────────────────────┤
│                    Service Layer                            │
├─────────────────────────────────────────────────────────────┤
│   Speech API      │   Market API     │   Storage Service   │
├─────────────────────────────────────────────────────────────┤
│                    Data Layer                               │
├─────────────────────────────────────────────────────────────┤
│  Local Storage    │  Cache Manager   │   Session Store     │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Speech Recognition**: Web Speech API with fallback to cloud services
- **Translation**: Browser-based translation with cloud API backup
- **Storage**: LocalStorage, IndexedDB for offline capability
- **Styling**: CSS Grid, Flexbox for responsive design
- **PWA Features**: Service Worker, Web App Manifest

## User Interface Design

### Design System

#### Color Palette
- **Primary Saffron**: #FF9933 (buttons, highlights, active states)
- **Secondary Green**: #138808 (success states, positive indicators)
- **Background White**: #FFFFFF (main backgrounds, text areas)
- **Text Dark**: #2c3e50 (primary text, headings)
- **Text Light**: #7f8c8d (secondary text, labels)
- **Error Red**: #e74c3c (error states, warnings)

#### Typography
- **Primary Font**: 'Inter' for Latin text
- **Devanagari Font**: 'Noto Sans Devanagari' for Hindi
- **Tamil Font**: 'Noto Sans Tamil' for Tamil script
- **Telugu Font**: 'Noto Sans Telugu' for Telugu script
- **Font Sizes**: 
  - Headers: 1.8rem - 2rem
  - Body: 1rem - 1.1rem
  - Labels: 0.9rem
  - Captions: 0.8rem

#### Spacing and Layout
- **Touch Targets**: Minimum 44px × 44px
- **Padding**: 1rem standard, 1.5rem for containers
- **Margins**: 0.5rem - 2rem based on hierarchy
- **Border Radius**: 8px for cards, 12px for buttons, 50% for circular elements

### Component Specifications

#### Header Component
```css
.header {
  background: linear-gradient(135deg, #FF9933 0%, #ffffff 50%, #138808 100%);
  height: 80px;
  position: sticky;
  top: 0;
  z-index: 100;
}
```

**Features:**
- Indian flag gradient background
- Logo with tricolor accent
- Language selector dropdown
- Responsive collapse on mobile

#### Voice Interface Component
```css
.mic-button {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF9933 0%, #ff8c1a 100%);
  animation: gentlePulse 3s ease-in-out infinite;
}
```

**Features:**
- Large circular microphone button
- Continuous gentle pulsing animation
- Visual feedback during recording (red pulsing)
- Status text in user's language
- Voice waveform visualization during input

#### Price Ticker Component
```css
.price-ticker {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 2px solid rgba(255, 153, 51, 0.1);
  border-radius: 16px;
}
```

**Features:**
- Live scrolling news ticker
- Real-time price updates with color coding
- Timestamp indicators
- Offline data age warnings
- Touch-friendly price cards

#### Chat Interface Component
```css
.chat-window {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  min-height: 400px;
}
```

**Features:**
- Bilingual message display
- Farmer/buyer role identification
- Message translation on hover/tap
- Price highlighting and comparison
- Voice input integration

### Responsive Breakpoints

```css
/* Mobile First */
@media (min-width: 320px) { /* Small phones */ }
@media (min-width: 480px) { /* Large phones */ }
@media (min-width: 768px) { /* Tablets */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1200px) { /* Large desktop */ }
```

## Functional Design

### Translation Engine

#### Voice-to-Voice Translation Flow
1. **Audio Capture**: Web Speech API captures user speech
2. **Speech-to-Text**: Convert audio to text in source language
3. **Language Detection**: Automatically detect source language
4. **Translation**: Translate text to target language
5. **Text-to-Speech**: Convert translated text to audio
6. **Playback**: Play translated audio to recipient

#### Supported Language Pairs
- Hindi ↔ English, Tamil, Telugu, Bengali, Gujarati
- Tamil ↔ English, Hindi, Telugu
- Telugu ↔ English, Hindi, Tamil
- Bengali ↔ English, Hindi
- Gujarati ↔ English, Hindi

#### Offline Translation Strategy
```javascript
// Pseudo-code for offline translation
class OfflineTranslator {
  constructor() {
    this.commonPhrases = loadCommonPhrases();
    this.agriculturalTerms = loadAgriculturalTerms();
  }
  
  translate(text, sourceLang, targetLang) {
    // Check offline dictionary first
    // Fall back to cached translations
    // Queue for online processing if needed
  }
}
```

### Price Discovery System

#### Data Sources
- Government mandi APIs
- Agricultural market boards
- Commodity exchanges
- Local market feeds

#### Price Display Format
```javascript
const priceFormat = {
  commodity: "Wheat",
  price: 2150,
  unit: "per quintal",
  currency: "INR",
  location: "Delhi",
  timestamp: "2024-01-28T10:30:00Z",
  trend: "up", // up, down, stable
  change: "+2.5%" // percentage change
};
```

#### Update Mechanism
- Real-time updates every 30 minutes
- Push notifications for significant price changes
- Offline caching for last 24 hours of data
- Visual indicators for data freshness

### Negotiation Interface

#### Message Structure
```javascript
const message = {
  id: "msg_123",
  sender: "farmer", // farmer, buyer
  originalText: "मेरे पास अच्छे टमाटर हैं",
  originalLanguage: "hi",
  translatedText: "I have good tomatoes",
  targetLanguage: "en",
  timestamp: "2024-01-28T10:30:00Z",
  priceHighlights: [
    {
      text: "40 रुपये",
      amount: 40,
      currency: "INR",
      unit: "per kg"
    }
  ]
};
```

#### Price Intelligence
- Automatic price extraction from messages
- Market rate comparison and alerts
- Negotiation history tracking
- Fair price suggestions

## Accessibility Design

### Visual Accessibility
- **Contrast Ratio**: Minimum 4.5:1 for all text
- **Font Size**: Scalable from 16px to 24px base size
- **Color Independence**: No information conveyed by color alone
- **Focus Indicators**: Clear visual focus for keyboard navigation

### Motor Accessibility
- **Touch Targets**: Minimum 44px × 44px
- **Gesture Alternatives**: All swipe actions have button alternatives
- **Voice Control**: Complete voice navigation capability
- **Timeout Extensions**: Generous timeouts for all interactions

### Cognitive Accessibility
- **Simple Language**: Plain language in all interface text
- **Visual Hierarchy**: Clear information architecture
- **Error Prevention**: Confirmation dialogs for destructive actions
- **Help Context**: Contextual help for all major features

### Localization Support
- **Script Support**: Proper rendering for Devanagari, Tamil, Telugu
- **Text Direction**: Left-to-right text flow for all supported languages
- **Cultural Adaptation**: Culturally appropriate icons and imagery
- **Number Formats**: Indian numbering system (lakhs, crores)

## Performance Design

### Loading Strategy
```javascript
// Critical path loading
1. HTML structure (< 1s)
2. Essential CSS (< 2s)
3. Core JavaScript (< 3s)
4. Translation engine (< 5s)
5. Market data (< 8s)
```

### Caching Strategy
- **Static Assets**: 1 year cache for CSS/JS
- **Market Data**: 30 minutes cache
- **Translation Cache**: 24 hours for common phrases
- **User Preferences**: Persistent local storage

### Offline Capability
```javascript
// Service Worker strategy
const CACHE_STRATEGY = {
  'static': 'cache-first',
  'api': 'network-first',
  'translations': 'stale-while-revalidate',
  'prices': 'network-first-with-fallback'
};
```

## Security Design

### Data Protection
- **Voice Data**: Processed locally when possible, deleted after translation
- **Chat Messages**: Encrypted in transit, not stored permanently
- **User Preferences**: Stored locally, no server-side profile
- **Market Data**: Public information, no sensitive data

### Privacy Measures
- **No User Tracking**: No analytics or user behavior tracking
- **Minimal Data Collection**: Only essential functional data
- **Local Processing**: Translation and speech processing on-device when possible
- **Session-Based**: No persistent user accounts or data

## Testing Strategy

### Property-Based Testing Framework
We will use **fast-check** for JavaScript property-based testing to ensure correctness across the wide input space of multilingual content and various user scenarios.

### Correctness Properties

#### Translation Engine Properties

**Property 1.1: Voice Processing Performance**
```javascript
// Validates: Requirements 1.1, 10.1
fc.property(
  fc.string({ minLength: 1, maxLength: 200 }),
  fc.constantFrom('hi', 'ta', 'te', 'bn', 'gu'),
  async (text, language) => {
    const startTime = Date.now();
    const result = await voiceToText(simulateVoice(text, language));
    const endTime = Date.now();
    
    return (endTime - startTime) <= 3000 && result.text.length > 0;
  }
);
```

**Property 1.2: Translation Bidirectionality**
```javascript
// Validates: Requirements 1.3, 5.5
fc.property(
  fc.string({ minLength: 1, maxLength: 100 }),
  fc.constantFrom('hi', 'en', 'ta', 'te'),
  fc.constantFrom('hi', 'en', 'ta', 'te'),
  async (text, sourceLang, targetLang) => {
    if (sourceLang === targetLang) return true;
    
    const translated = await translate(text, sourceLang, targetLang);
    const backTranslated = await translate(translated, targetLang, sourceLang);
    
    // Semantic similarity should be maintained
    const similarity = calculateSimilarity(text, backTranslated);
    return similarity >= 0.7; // 70% semantic similarity threshold
  }
);
```

**Property 1.3: Translation Performance**
```javascript
// Validates: Requirements 1.2, 3.2
fc.property(
  fc.string({ minLength: 1, maxLength: 500 }),
  fc.constantFrom('hi', 'en', 'ta', 'te', 'bn', 'gu'),
  fc.constantFrom('hi', 'en', 'ta', 'te', 'bn', 'gu'),
  async (text, sourceLang, targetLang) => {
    const startTime = Date.now();
    const result = await translate(text, sourceLang, targetLang);
    const endTime = Date.now();
    
    return (endTime - startTime) <= 2000 && result.length > 0;
  }
);
```

#### Price Discovery Properties

**Property 2.1: Market Data Freshness**
```javascript
// Validates: Requirements 2.1, 2.4
fc.property(
  fc.constantFrom('wheat', 'onion', 'potato'),
  fc.constantFrom('delhi', 'mumbai', 'bangalore'),
  async (commodity, location) => {
    const startTime = Date.now();
    const priceData = await fetchMarketPrice(commodity, location);
    const endTime = Date.now();
    
    const isTimely = (endTime - startTime) <= 5000;
    const hasValidData = priceData.price > 0 && priceData.timestamp;
    const isRecent = (Date.now() - new Date(priceData.timestamp)) <= 4 * 60 * 60 * 1000; // 4 hours
    
    return isTimely && hasValidData && isRecent;
  }
);
```

**Property 2.2: Price Format Consistency**
```javascript
// Validates: Requirements 2.2
fc.property(
  fc.constantFrom('wheat', 'onion', 'potato'),
  fc.constantFrom('delhi', 'mumbai', 'bangalore', 'chennai'),
  async (commodity, location) => {
    const priceData = await fetchMarketPrice(commodity, location);
    
    const hasValidPrice = typeof priceData.price === 'number' && priceData.price > 0;
    const hasValidCurrency = priceData.currency === 'INR';
    const hasValidTimestamp = new Date(priceData.timestamp).getTime() > 0;
    const hasValidLocation = priceData.location === location;
    
    return hasValidPrice && hasValidCurrency && hasValidTimestamp && hasValidLocation;
  }
);
```

#### User Interface Properties

**Property 4.1: Touch Target Accessibility**
```javascript
// Validates: Requirements 4.1
fc.property(
  fc.constantFrom('.mic-button', '.send-button', '.action-button', '.language-selector'),
  (selector) => {
    const element = document.querySelector(selector);
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const minSize = 44; // pixels
    
    return rect.width >= minSize && rect.height >= minSize;
  }
);
```

**Property 4.2: Color Contrast Compliance**
```javascript
// Validates: Requirements 4.2
fc.property(
  fc.constantFrom('.header h1', '.price-item .commodity', '.message-content', '.status-text'),
  (selector) => {
    const element = document.querySelector(selector);
    if (!element) return false;
    
    const styles = getComputedStyle(element);
    const textColor = styles.color;
    const backgroundColor = styles.backgroundColor;
    
    const contrastRatio = calculateContrastRatio(textColor, backgroundColor);
    return contrastRatio >= 4.5;
  }
);
```

**Property 4.3: UI Responsiveness**
```javascript
// Validates: Requirements 4.3, 10.3
fc.property(
  fc.constantFrom('click', 'touch', 'keypress'),
  fc.constantFrom('.mic-button', '.send-button', '.action-button'),
  async (eventType, selector) => {
    const element = document.querySelector(selector);
    if (!element) return false;
    
    const startTime = performance.now();
    
    // Simulate user interaction
    const event = new Event(eventType);
    element.dispatchEvent(event);
    
    // Wait for visual feedback
    await new Promise(resolve => requestAnimationFrame(resolve));
    
    const endTime = performance.now();
    return (endTime - startTime) <= 200; // 200ms threshold
  }
);
```

#### Responsive Design Properties

**Property 6.1: Viewport Adaptability**
```javascript
// Validates: Requirements 6.1
fc.property(
  fc.integer({ min: 320, max: 1920 }),
  fc.integer({ min: 568, max: 1080 }),
  (width, height) => {
    // Simulate viewport resize
    Object.defineProperty(window, 'innerWidth', { value: width, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: height, writable: true });
    
    window.dispatchEvent(new Event('resize'));
    
    // Check for horizontal scrollbar
    const hasHorizontalScroll = document.body.scrollWidth > window.innerWidth;
    
    // Check that essential elements are visible
    const micButton = document.querySelector('.mic-button');
    const priceSection = document.querySelector('.price-ticker');
    
    const micVisible = micButton && micButton.offsetWidth > 0;
    const priceVisible = priceSection && priceSection.offsetWidth > 0;
    
    return !hasHorizontalScroll && micVisible && priceVisible;
  }
);
```

#### Offline Capability Properties

**Property 7.1: Data Caching Reliability**
```javascript
// Validates: Requirements 7.1, 7.5
fc.property(
  fc.array(fc.record({
    commodity: fc.constantFrom('wheat', 'onion', 'potato'),
    price: fc.integer({ min: 10, max: 5000 }),
    location: fc.constantFrom('delhi', 'mumbai', 'bangalore'),
    timestamp: fc.date()
  }), { minLength: 1, maxLength: 10 }),
  async (marketData) => {
    // Store data in cache
    await cacheManager.store('market-data', marketData);
    
    // Simulate offline condition
    navigator.onLine = false;
    
    // Retrieve cached data
    const cachedData = await cacheManager.retrieve('market-data');
    
    // Restore online condition
    navigator.onLine = true;
    
    return JSON.stringify(cachedData) === JSON.stringify(marketData);
  }
);
```

**Property 7.2: Offline Queue Management**
```javascript
// Validates: Requirements 7.3, 7.4
fc.property(
  fc.array(fc.record({
    text: fc.string({ minLength: 1, maxLength: 200 }),
    sourceLang: fc.constantFrom('hi', 'en', 'ta'),
    targetLang: fc.constantFrom('hi', 'en', 'ta'),
    timestamp: fc.date()
  }), { minLength: 1, maxLength: 5 }),
  async (messages) => {
    // Simulate offline condition
    navigator.onLine = false;
    
    // Queue messages
    for (const message of messages) {
      await offlineQueue.add('translation', message);
    }
    
    const queueSize = await offlineQueue.size('translation');
    
    // Simulate online condition
    navigator.onLine = true;
    
    // Process queue
    await offlineQueue.processAll('translation');
    
    const finalQueueSize = await offlineQueue.size('translation');
    
    return queueSize === messages.length && finalQueueSize === 0;
  }
);
```

#### Language Support Properties

**Property 5.1: Script Rendering Integrity**
```javascript
// Validates: Requirements 5.3
fc.property(
  fc.record({
    text: fc.string({ minLength: 1, maxLength: 100 }),
    language: fc.constantFrom('hi', 'ta', 'te', 'bn', 'gu'),
    script: fc.constantFrom('devanagari', 'tamil', 'telugu', 'bengali', 'gujarati')
  }),
  (testCase) => {
    const element = document.createElement('div');
    element.textContent = testCase.text;
    element.lang = testCase.language;
    document.body.appendChild(element);
    
    // Check if text is rendered (not showing as boxes or question marks)
    const computedStyle = getComputedStyle(element);
    const fontFamily = computedStyle.fontFamily;
    
    // Verify appropriate font is loaded
    const hasCorrectFont = fontFamily.includes('Noto Sans') || 
                          fontFamily.includes('system-ui');
    
    // Check character rendering
    const textWidth = element.offsetWidth;
    const hasRenderedText = textWidth > 0;
    
    document.body.removeChild(element);
    
    return hasCorrectFont && hasRenderedText;
  }
);
```

**Property 5.2: Language Switching Performance**
```javascript
// Validates: Requirements 5.2, 5.4
fc.property(
  fc.constantFrom('hi', 'en', 'ta', 'te', 'bn', 'gu'),
  fc.constantFrom('hi', 'en', 'ta', 'te', 'bn', 'gu'),
  async (fromLang, toLang) => {
    // Set initial language and state
    await setLanguage(fromLang);
    const initialState = captureApplicationState();
    
    const startTime = performance.now();
    await setLanguage(toLang);
    const endTime = performance.now();
    
    const finalState = captureApplicationState();
    
    const isTimely = (endTime - startTime) <= 1000; // 1 second
    const statePreserved = compareStates(initialState, finalState);
    
    return isTimely && statePreserved;
  }
);
```

#### Security Properties

**Property 9.1: Data Cleanup After Processing**
```javascript
// Validates: Requirements 9.1, 9.4
fc.property(
  fc.string({ minLength: 10, maxLength: 200 }),
  fc.constantFrom('hi', 'ta', 'te'),
  async (voiceText, language) => {
    // Process voice data
    const audioData = simulateVoiceRecording(voiceText, language);
    const translationResult = await processVoiceTranslation(audioData);
    
    // Check that temporary audio data is cleaned up
    const tempDataExists = checkForTempAudioFiles();
    const memoryCleared = checkVoiceDataInMemory();
    
    return !tempDataExists && !memoryCleared && translationResult.text.length > 0;
  }
);
```

### Unit Test Examples

#### Translation Accuracy Tests
```javascript
describe('Translation Engine', () => {
  test('should translate common agricultural terms correctly', () => {
    const terms = [
      { hi: 'गेहूं', en: 'wheat' },
      { hi: 'प्याज', en: 'onion' },
      { hi: 'टमाटर', en: 'tomato' },
      { hi: 'किसान', en: 'farmer' },
      { hi: 'बाज़ार', en: 'market' }
    ];
    
    terms.forEach(term => {
      const result = translate(term.hi, 'hi', 'en');
      expect(result.toLowerCase()).toContain(term.en);
    });
  });
});
```

#### Price Display Tests
```javascript
describe('Price Display', () => {
  test('should format Indian currency correctly', () => {
    const testCases = [
      { input: 1000, expected: '₹1,000' },
      { input: 100000, expected: '₹1,00,000' },
      { input: 10000000, expected: '₹1,00,00,000' }
    ];
    
    testCases.forEach(testCase => {
      const result = formatIndianCurrency(testCase.input);
      expect(result).toBe(testCase.expected);
    });
  });
});
```

#### Accessibility Tests
```javascript
describe('Accessibility', () => {
  test('should have sufficient color contrast', () => {
    const elements = document.querySelectorAll('.text-element');
    elements.forEach(element => {
      const contrast = getContrastRatio(element);
      expect(contrast).toBeGreaterThanOrEqual(4.5);
    });
  });
  
  test('should have appropriate touch targets', () => {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      const rect = button.getBoundingClientRect();
      expect(rect.width).toBeGreaterThanOrEqual(44);
      expect(rect.height).toBeGreaterThanOrEqual(44);
    });
  });
});
```

## Implementation Phases

### Phase 1: Core Infrastructure (Week 1-2)
- Basic HTML structure and responsive layout
- CSS design system implementation
- Language selector and basic localization
- Service worker setup for PWA

### Phase 2: Translation Engine (Week 3-4)
- Web Speech API integration
- Basic text translation functionality
- Voice-to-voice translation pipeline
- Offline translation capabilities

### Phase 3: Price Discovery (Week 5-6)
- Market data API integration
- Real-time price display
- Caching and offline support
- Price comparison features

### Phase 4: Chat Interface (Week 7-8)
- Bilingual chat implementation
- Message translation
- Price highlighting and extraction
- Negotiation history

### Phase 5: Testing and Optimization (Week 9-10)
- Property-based test implementation
- Performance optimization
- Accessibility testing and fixes
- User acceptance testing

## Success Metrics

### Performance Metrics
- **Translation Speed**: < 3 seconds for voice, < 2 seconds for text
- **Load Time**: < 8 seconds on 3G networks
- **UI Responsiveness**: < 200ms for all interactions
- **Offline Capability**: 90% functionality without internet

### Quality Metrics
- **Translation Accuracy**: > 85% for agricultural terminology
- **Accessibility Score**: WCAG 2.1 AA compliance
- **Cross-browser Support**: 95% functionality on major mobile browsers
- **Error Rate**: < 5% for core user flows

### User Experience Metrics
- **Task Completion**: > 90% success rate for primary user flows
- **User Satisfaction**: > 4.0/5.0 rating from rural user testing
- **Language Coverage**: Support for 5 major Indian languages
- **Cultural Appropriateness**: Positive feedback on design and iconography

This design document provides a comprehensive blueprint for implementing The Multilingual Mandi platform with a focus on accessibility, performance, and cultural appropriateness for the target audience of rural Indian vendors and farmers.