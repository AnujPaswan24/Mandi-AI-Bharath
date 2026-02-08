# Design Document: Mandi AI - Bharat ka Bazaar

## Project Overview

**Track:** Student Track  
**Category:** AI for Communities, Access & Public Impact  
**Hackathon:** AWS AI for Bharat Hackathon

Mandi AI is an AWS-powered progressive web application designed to bridge language barriers and information gaps in Indian agricultural markets. The system leverages Amazon Bedrock for AI-powered natural language processing, AWS Lambda for serverless backend operations, and API Gateway for seamless API management, providing real-time voice and text translation, live market pricing, AI-driven agricultural advisory, and bilingual negotiation tools through an accessible, mobile-first, voice-first interface optimized for rural users with limited technical literacy.

**Impact:** Empowering 120+ million Indian farmers with fair market access, transparent pricing, and AI-powered agricultural guidance in their native languages.

## AWS-First Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend Layer (User Device)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Voice-First  │  │  Responsive  │  │   Offline    │         │
│  │     UI       │  │   Web App    │  │    Cache     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                    AWS API Gateway Layer                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  REST API Endpoints                                       │  │
│  │  • /prices/{crop}        • /translate                    │  │
│  │  • /ai-advice            • /market-trends                │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    AWS Lambda Functions                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Price      │  │  Translation │  │  AI Advisory │         │
│  │   Fetcher    │  │   Service    │  │   Service    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Amazon Bedrock                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Foundation Models                                        │  │
│  │  • Natural Language Understanding                        │  │
│  │  • Multilingual Translation                              │  │
│  │  • Agricultural Knowledge Base                           │  │
│  │  • Context-Aware Responses                               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Government  │  │   Weather    │  │   Market     │         │
│  │  Mandi APIs  │  │     APIs     │  │  Data APIs   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### Detailed Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                     │
├─────────────────────────────────────────────────────────────┤
│  Voice-First UI  │  Mobile Interface  │  Chat Interface    │
├─────────────────────────────────────────────────────────────┤
│                   Application Layer                         │
├─────────────────────────────────────────────────────────────┤
│ Bedrock Client │ API Gateway Client │ Offline Manager      │
├─────────────────────────────────────────────────────────────┤
│                    AWS Service Layer                        │
├─────────────────────────────────────────────────────────────┤
│   API Gateway     │   Lambda Functions   │  Amazon Bedrock │
├─────────────────────────────────────────────────────────────┤
│                    Integration Layer                        │
├─────────────────────────────────────────────────────────────┤
│  Market APIs      │   Weather APIs    │   Storage Service  │
├─────────────────────────────────────────────────────────────┤
│                    Data Layer                               │
├─────────────────────────────────────────────────────────────┤
│  Local Storage    │  Cache Manager   │   Session Store     │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- HTML5, CSS3, JavaScript (ES6+)
- Web Speech API for voice input/output
- Responsive Design (Mobile-First)
- Progressive Web App (PWA) capabilities

**AWS Backend:**
- **Amazon Bedrock**: Foundation models for NLP, translation, and agricultural AI advisory
- **AWS Lambda**: Serverless functions (Python 3.11) for business logic
- **API Gateway**: RESTful API management and routing
- **CloudWatch**: Logging and monitoring

**External Integrations:**
- Government Mandi APIs (data.gov.in)
- Agricultural market data providers
- Weather APIs for farming insights

**Storage & Caching:**
- LocalStorage for offline capability
- IndexedDB for structured data caching
- Session Storage for temporary state

**Development & Deployment:**
- Git for version control
- AWS SAM/CloudFormation for infrastructure as code
- GitHub for repository hosting

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

### AWS Lambda Functions

#### Lambda Function 1: Price Fetcher (Python 3.11)

**Purpose:** Fetch real-time market prices for agricultural commodities

**File:** `lambda_price_fetcher.py`

```python
import json
import boto3
import requests
from datetime import datetime
from decimal import Decimal

def lambda_handler(event, context):
    """
    Fetch market prices for specified crop
    
    API Gateway Event Structure:
    {
        "pathParameters": {
            "crop": "wheat"
        },
        "queryStringParameters": {
            "location": "delhi"
        }
    }
    """
    
    try:
        # Extract parameters
        crop_name = event.get('pathParameters', {}).get('crop', '').lower()
        location = event.get('queryStringParameters', {}).get('location', 'all')
        
        if not crop_name:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Crop name is required',
                    'message': 'Please provide a crop name in the path'
                })
            }
        
        # Fetch data from government Mandi API
        mandi_api_url = f"https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
        
        params = {
            'api-key': 'YOUR_API_KEY',  # Replace with actual API key
            'format': 'json',
            'filters[commodity]': crop_name.capitalize(),
            'limit': 10
        }
        
        if location != 'all':
            params['filters[market]'] = location.capitalize()
        
        response = requests.get(mandi_api_url, params=params, timeout=5)
        response.raise_for_status()
        
        data = response.json()
        records = data.get('records', [])
        
        if not records:
            # Return mock data for demo purposes
            records = generate_mock_data(crop_name, location)
        
        # Process and format the data
        processed_data = process_market_data(records, crop_name)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'max-age=1800'  # Cache for 30 minutes
            },
            'body': json.dumps(processed_data, default=decimal_default)
        }
        
    except requests.exceptions.RequestException as e:
        print(f"API Request Error: {str(e)}")
        return {
            'statusCode': 503,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Service Unavailable',
                'message': 'Unable to fetch market data. Please try again later.'
            })
        }
    
    except Exception as e:
        print(f"Unexpected Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Internal Server Error',
                'message': 'An unexpected error occurred'
            })
        }

def process_market_data(records, crop_name):
    """Process and structure market data"""
    
    prices_by_location = {}
    
    for record in records:
        location = record.get('market', 'Unknown')
        modal_price = record.get('modal_price', 0)
        min_price = record.get('min_price', 0)
        max_price = record.get('max_price', 0)
        
        if location not in prices_by_location:
            prices_by_location[location] = {
                'location': location,
                'commodity': crop_name.capitalize(),
                'modal_price': float(modal_price) if modal_price else 0,
                'min_price': float(min_price) if min_price else 0,
                'max_price': float(max_price) if max_price else 0,
                'unit': 'per quintal',
                'currency': 'INR',
                'timestamp': datetime.now().isoformat(),
                'source': 'Government Mandi API'
            }
    
    return {
        'commodity': crop_name.capitalize(),
        'prices': list(prices_by_location.values()),
        'fetched_at': datetime.now().isoformat(),
        'total_markets': len(prices_by_location)
    }

def generate_mock_data(crop_name, location):
    """Generate mock data for demonstration"""
    
    mock_prices = {
        'wheat': {'delhi': 2150, 'mumbai': 2200, 'punjab': 2100},
        'onion': {'nasik': 25, 'bangalore': 30, 'kolkata': 28},
        'potato': {'agra': 18, 'delhi': 20, 'mumbai': 22},
        'tomato': {'chennai': 35, 'hyderabad': 32, 'pune': 38},
        'rice': {'delhi': 3500, 'mumbai': 3600, 'kolkata': 3400}
    }
    
    crop_data = mock_prices.get(crop_name.lower(), {'delhi': 100})
    
    records = []
    for market, price in crop_data.items():
        records.append({
            'market': market.capitalize(),
            'modal_price': price,
            'min_price': price - 50,
            'max_price': price + 50
        })
    
    return records

def decimal_default(obj):
    """JSON serializer for Decimal objects"""
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError
```

**Lambda Configuration:**
- Runtime: Python 3.11
- Memory: 256 MB
- Timeout: 10 seconds
- Environment Variables: API_KEY, REGION

#### Lambda Function 2: AI Advisory Service (Amazon Bedrock Integration)

**Purpose:** Provide AI-powered agricultural advice using Amazon Bedrock

**File:** `lambda_ai_advisor.py`

```python
import json
import boto3
from datetime import datetime

# Initialize Bedrock client
bedrock_runtime = boto3.client('bedrock-runtime', region_name='us-east-1')

def lambda_handler(event, context):
    """
    Process agricultural queries using Amazon Bedrock
    
    Event Structure:
    {
        "body": {
            "query": "What is the best time to plant wheat?",
            "language": "hi",
            "context": {
                "location": "Punjab",
                "season": "winter"
            }
        }
    }
    """
    
    try:
        # Parse request body
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        else:
            body = event.get('body', {})
        
        user_query = body.get('query', '')
        language = body.get('language', 'en')
        context_info = body.get('context', {})
        
        if not user_query:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Query is required',
                    'message': 'Please provide a query in the request body'
                })
            }
        
        # Prepare prompt for Bedrock
        system_prompt = """You are an expert agricultural advisor for Indian farmers. 
        Provide practical, actionable advice in simple language. Consider regional 
        variations, seasonal factors, and traditional farming practices. Focus on:
        - Crop selection and rotation
        - Planting and harvesting schedules
        - Pest and disease management
        - Irrigation and water management
        - Fertilizer recommendations
        - Market timing and price trends
        - Weather-based guidance
        
        Always provide answers that are culturally appropriate and practical for 
        small-scale Indian farmers."""
        
        user_prompt = f"""
        Farmer's Question: {user_query}
        Location: {context_info.get('location', 'India')}
        Season: {context_info.get('season', 'current')}
        Language: {language}
        
        Please provide a helpful, concise answer in {language} language.
        """
        
        # Call Amazon Bedrock
        response = invoke_bedrock_model(system_prompt, user_prompt)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'query': user_query,
                'advice': response,
                'language': language,
                'timestamp': datetime.now().isoformat(),
                'source': 'Amazon Bedrock AI'
            })
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Internal Server Error',
                'message': str(e)
            })
        }

def invoke_bedrock_model(system_prompt, user_prompt):
    """Invoke Amazon Bedrock foundation model"""
    
    # Using Claude 3 Sonnet model (adjust model ID as needed)
    model_id = "anthropic.claude-3-sonnet-20240229-v1:0"
    
    request_body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 1000,
        "system": system_prompt,
        "messages": [
            {
                "role": "user",
                "content": user_prompt
            }
        ],
        "temperature": 0.7,
        "top_p": 0.9
    }
    
    try:
        response = bedrock_runtime.invoke_model(
            modelId=model_id,
            body=json.dumps(request_body)
        )
        
        response_body = json.loads(response['body'].read())
        advice_text = response_body['content'][0]['text']
        
        return advice_text
        
    except Exception as e:
        print(f"Bedrock invocation error: {str(e)}")
        return "I apologize, but I'm unable to provide advice at this moment. Please try again later."
```

**Lambda Configuration:**
- Runtime: Python 3.11
- Memory: 512 MB
- Timeout: 30 seconds
- IAM Role: Permissions for bedrock:InvokeModel

### Frontend API Integration

#### JavaScript API Client (script.js)

```javascript
// API Configuration
const API_CONFIG = {
    baseUrl: 'https://YOUR_API_GATEWAY_ID.execute-api.us-east-1.amazonaws.com/prod',
    endpoints: {
        prices: '/prices',
        aiAdvice: '/ai-advice',
        translate: '/translate'
    }
};

// Fetch market prices for a specific crop
async function fetchMarketPrices(cropName, location = 'all') {
    try {
        const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.prices}/${cropName}?location=${location}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Error fetching market prices:', error);
        
        // Return cached data if available
        const cachedData = getCachedPrices(cropName);
        if (cachedData) {
            return cachedData;
        }
        
        throw error;
    }
}

// Get AI-powered agricultural advice
async function getAIAdvice(query, language = 'hi', context = {}) {
    try {
        const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.aiAdvice}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: query,
                language: language,
                context: context
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Error getting AI advice:', error);
        throw error;
    }
}

// Update UI with market prices
async function updatePricesUI() {
    const crops = ['wheat', 'onion', 'potato', 'tomato', 'rice'];
    
    for (const crop of crops) {
        try {
            const priceData = await fetchMarketPrices(crop);
            displayPrices(crop, priceData);
            
            // Cache the data
            cachePrices(crop, priceData);
            
        } catch (error) {
            console.error(`Failed to fetch prices for ${crop}:`, error);
            showPriceError(crop);
        }
    }
}

// Handle voice query for AI advice
async function handleVoiceQuery(transcript, language) {
    try {
        // Show loading state
        updateStatus('processing');
        
        // Get AI advice
        const response = await getAIAdvice(transcript, language, {
            location: getUserLocation(),
            season: getCurrentSeason()
        });
        
        // Display the advice
        displayAIAdvice(response.advice, language);
        
        // Speak the response
        speakText(response.advice, language);
        
        updateStatus('micReady');
        
    } catch (error) {
        console.error('Error processing voice query:', error);
        updateStatus('error');
        showErrorMessage('Unable to process your query. Please try again.');
    }
}

// Cache management
function cachePrices(crop, data) {
    const cacheKey = `prices_${crop}`;
    const cacheData = {
        data: data,
        timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
}

function getCachedPrices(crop) {
    const cacheKey = `prices_${crop}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return null;
    
    const cacheData = JSON.parse(cached);
    const age = Date.now() - cacheData.timestamp;
    
    // Cache valid for 30 minutes
    if (age < 30 * 60 * 1000) {
        return cacheData.data;
    }
    
    return null;
}

// Helper functions
function getUserLocation() {
    return localStorage.getItem('userLocation') || 'India';
}

function getCurrentSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 5) return 'summer';
    if (month >= 6 && month <= 9) return 'monsoon';
    return 'winter';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updatePricesUI();
    setInterval(updatePricesUI, 30 * 60 * 1000); // Update every 30 minutes
});
```

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

### Phase 1: AWS Infrastructure Setup (Week 1)
- Set up AWS account and configure IAM roles
- Create API Gateway REST API
- Deploy Lambda functions for price fetching
- Configure Amazon Bedrock access
- Set up CloudWatch logging and monitoring
- Create basic HTML structure and responsive layout

### Phase 2: Frontend Development (Week 2-3)
- Implement voice-first UI with Web Speech API
- Build responsive CSS design system
- Create language selector and localization
- Implement offline caching with Service Worker
- Build chat interface components

### Phase 3: AWS Lambda Integration (Week 4)
- Complete price fetcher Lambda function
- Integrate government Mandi APIs
- Implement error handling and retry logic
- Add caching mechanisms
- Test API Gateway endpoints

### Phase 4: Amazon Bedrock AI Integration (Week 5-6)
- Set up Bedrock foundation model access
- Implement AI advisory Lambda function
- Create multilingual prompt engineering
- Build translation service using Bedrock
- Test AI responses for accuracy

### Phase 5: Frontend-Backend Integration (Week 7)
- Connect frontend to API Gateway
- Implement fetch() calls for all endpoints
- Add loading states and error handling
- Build real-time price updates
- Integrate voice queries with AI advisor

### Phase 6: Multilingual Support (Week 8)
- Implement language detection
- Add support for Hindi, Tamil, Telugu, Bengali, Gujarati
- Test script rendering (Devanagari, Tamil, Telugu)
- Implement voice output in regional languages
- Validate translation accuracy

### Phase 7: Testing and Optimization (Week 9)
- Performance testing and optimization
- Accessibility testing (WCAG 2.1 AA)
- Cross-browser and device testing
- Load testing for Lambda functions
- Security audit

### Phase 8: Documentation and Deployment (Week 10)
- Complete technical documentation
- Create user guides in multiple languages
- Prepare hackathon presentation
- Deploy to production
- Final testing and bug fixes

## Success Metrics

### Technical Performance Metrics
- **AI Response Time**: < 5 seconds for Amazon Bedrock queries
- **Lambda Execution**: < 3 seconds for price fetching
- **API Gateway Latency**: < 500ms for routing
- **Frontend Load Time**: < 8 seconds on 3G networks
- **UI Responsiveness**: < 200ms for all interactions
- **Offline Capability**: 90% functionality without internet

### Quality Metrics
- **Translation Accuracy**: > 90% for agricultural terminology (Amazon Bedrock)
- **AI Advice Relevance**: > 85% user satisfaction rating
- **Accessibility Score**: WCAG 2.1 AA compliance
- **Cross-browser Support**: 95% functionality on major mobile browsers
- **Error Rate**: < 5% for core user flows
- **AWS Uptime**: 99.5% availability

### User Experience Metrics
- **Task Completion**: > 90% success rate for primary user flows
- **User Satisfaction**: > 4.0/5.0 rating from rural user testing
- **Language Coverage**: Support for 6 languages (Hindi, Tamil, Telugu, Bengali, Gujarati, English)
- **Voice-First Adoption**: > 70% of users prefer voice over text input
- **Cultural Appropriateness**: Positive feedback on design and iconography

### Impact Metrics (Student Track Focus)
- **Farmers Reached**: Target 1000+ farmers in pilot phase
- **Fair Price Awareness**: 80% of users report better price knowledge
- **Language Barrier Reduction**: 90% of users can access information in native language
- **AI Advisory Usage**: 60% of users actively seek agricultural advice
- **Community Impact**: Measurable improvement in farmer income through better price negotiation

## AWS Cost Optimization

### Estimated Monthly Costs (Student/Development)
- **API Gateway**: ~$3.50 (1M requests)
- **Lambda**: ~$5.00 (compute time)
- **Amazon Bedrock**: ~$20.00 (foundation model usage)
- **CloudWatch**: ~$2.00 (logging and monitoring)
- **Total**: ~$30.50/month for development

### Cost Optimization Strategies
- Use Lambda free tier (1M requests/month)
- Implement aggressive caching (30-minute TTL)
- Optimize Bedrock token usage
- Use CloudWatch Logs Insights sparingly
- Implement request throttling

## Security and Compliance

### AWS Security Best Practices
- IAM roles with least privilege access
- API Gateway with API keys and throttling
- Lambda environment variables for secrets
- HTTPS/TLS 1.3 for all communications
- CloudWatch for security monitoring

### Data Privacy
- No PII storage in AWS services
- Voice data processed and immediately deleted
- Session-based interactions only
- GDPR-compliant data handling
- Transparent data usage policies

This design document provides a comprehensive blueprint for implementing Mandi AI with AWS-first architecture, specifically tailored for the Student Track of the AWS AI for Bharat Hackathon, focusing on community impact and accessibility for rural Indian farmers.