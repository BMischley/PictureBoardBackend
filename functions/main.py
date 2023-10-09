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

options.set_global_options(max_instances=10)

def get_openai_key():
    client = secretmanager.SecretManagerServiceClient()

    secret_name = f"projects/pictureboard-3cac7/secrets/OPENAI_API_KEY/versions/latest"
    response = client.access_secret_version(name=secret_name)

    return response.payload.data.decode('UTF-8')


@https_fn.on_request()
def generate_image(req: https_fn.Request) -> https_fn.Response:
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600'
    }

    if req.method == 'OPTIONS':
        return https_fn.Response('', status=204, headers=headers)

    print("Generating image")

    if req.method != 'POST' or not req.is_json:
        return https_fn.Response('Invalid request', status=400, headers=headers)

    try:
        prompt = req.get_json()["data"]["prompt"]
    except Exception as e:
        print(f"Error extracting prompt: {e}")
        return https_fn.Response('Invalid payload', status=400, headers=headers)

    if not prompt:
        return https_fn.Response('Prompt is required', status=400, headers=headers)

    openai.api_key = get_openai_key()
    print("Got API key")

    try:
        res = openai.Image.create(prompt=prompt, n=1, size="256x256")
        url = res["data"][0]["url"]
        
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return https_fn.Response('Error generating image', status=500, headers=headers)

    return https_fn.Response(json.dumps({'data': {'url': url}}), status=200, headers=headers, content_type='application/json')
