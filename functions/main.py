# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn, options
from firebase_admin import initialize_app
import os
import openai
from google.cloud import secretmanager
import json

initialize_app()
#
# @https_fn.on_request()
# def on_request_example(req: https_fn.Request) -> https_fn.Response:
#     return https_fn.Response("Hello world!")


options.set_global_options(max_instances=10)

def get_openai_key():
    # Create the Secret Manager client.
    client = secretmanager.SecretManagerServiceClient()

    # Access the secret.
    secret_name = f"projects/pictureboard-3cac7/secrets/OPENAI_API_KEY/versions/latest"
    response = client.access_secret_version(name=secret_name)

    # Return the decoded payload of the secret.
    return response.payload.data.decode('UTF-8')


@https_fn.on_request()
def generate_image(req: https_fn.Request) -> https_fn.Response:
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600'
    }

    # Handle preflight CORS requests
    if req.method == 'OPTIONS':
        return https_fn.Response('', status=204, headers=headers)

    print("Generating image")

    # Ensure you are receiving a POST request with valid JSON payload
    if req.method != 'POST' or not req.is_json:
        return https_fn.Response('Invalid request', status=400, headers=headers)

    # Extract the prompt from the request body
    try:
        prompt = req.get_json()["data"]["prompt"]
    except Exception as e:
        print(f"Error extracting prompt: {e}")
        return https_fn.Response('Invalid payload', status=400, headers=headers)

    # Ensure prompt is not empty or None
    if not prompt:
        return https_fn.Response('Prompt is required', status=400, headers=headers)

    # Set your OpenAI API key and call the API (you may want to handle exceptions here as well)
    openai.api_key = get_openai_key()
    print("Got API key")

    try:
        
        res = openai.Image.create(prompt=prompt, n=1, size="256x256")
        url = res["data"][0]["url"]
        
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return https_fn.Response('Error generating image', status=500, headers=headers)

    # Return the image URL in the response
    return https_fn.Response(json.dumps({'data': {'url': url}}), status=200, headers=headers, content_type='application/json')
