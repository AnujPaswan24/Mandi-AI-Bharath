"""
AWS Lambda Function: AI Agricultural Advisor
Purpose: Provide AI-powered agricultural advice using Amazon Bedrock
Runtime: Python 3.11
"""

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
        small-scale Indian farmers. Keep responses concise (under 200 words)."""
        
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

# Alternative: Using Amazon Titan model
def invoke_titan_model(prompt):
    """Alternative implementation using Amazon Titan"""
    
    model_id = "amazon.titan-text-express-v1"
    
    request_body = {
        "inputText": prompt,
        "textGenerationConfig": {
            "maxTokenCount": 1000,
            "temperature": 0.7,
            "topP": 0.9
        }
    }
    
    try:
        response = bedrock_runtime.invoke_model(
            modelId=model_id,
            body=json.dumps(request_body)
        )
        
        response_body = json.loads(response['body'].read())
        advice_text = response_body['results'][0]['outputText']
        
        return advice_text
        
    except Exception as e:
        print(f"Titan invocation error: {str(e)}")
        return "Unable to generate advice at this time."
