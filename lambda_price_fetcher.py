"""
AWS Lambda Function: Market Price Fetcher
Purpose: Fetch real-time agricultural commodity prices from government APIs
Runtime: Python 3.11
"""

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
            'api-key': 'YOUR_API_KEY',  # Replace with actual API key from environment
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
