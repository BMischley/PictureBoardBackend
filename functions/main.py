# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn, options
from firebase_admin import initialize_app, firestore, storage
import os
import openai
from google.cloud import secretmanager
import json
import requests
import concurrent.futures
import re


initialize_app()

options.set_global_options(max_instances=10)

def get_openai_key():
    client = secretmanager.SecretManagerServiceClient()

    secret_name = f"projects/pictureboard-3cac7/secrets/OPENAI_API_KEY/versions/latest"
    response = client.access_secret_version(name=secret_name)

    return response.payload.data.decode('UTF-8')


# @https_fn.on_request()
# def generate_image(req: https_fn.Request) -> https_fn.Response:
#     headers = {
#     'Access-Control-Allow-Origin': '*',
#     'Access-Control-Allow-Methods': 'POST, OPTIONS',
#     'Access-Control-Allow-Headers': 'Content-Type, Authorization',  # Include Authorization here
#     'Access-Control-Max-Age': '3600'
# }

#     if req.method == 'OPTIONS':
#         return https_fn.Response('', status=204, headers=headers)

#     print("Generating image")

#     if req.method != 'POST' or not req.is_json:
#         return https_fn.Response('Invalid request', status=400, headers=headers)

#     try:
#         prompt = req.get_json()["data"]["prompt"]
#     except Exception as e:
#         print(f"Error extracting prompt: {e}")
#         return https_fn.Response('Invalid payload', status=400, headers=headers)

#     if not prompt:
#         return https_fn.Response('Prompt is required', status=400, headers=headers)

#     openai.api_key = get_openai_key()
#     print("Got API key")

#     try:
#         res = openai.Image.create(prompt=prompt, n=1, size="256x256")
#         url = res["data"][0]["url"]
        
#     except Exception as e:
#         print(f"Error calling OpenAI API: {e}")
#         return https_fn.Response('Error generating image', status=500, headers=headers)

#     return https_fn.Response(json.dumps({'data': {'url': url}}), status=200, headers=headers, content_type='application/json')


# Initialize Firestore and Storage
db = firestore.client()

@https_fn.on_request()
def generate_image(req: https_fn.Request) -> https_fn.Response:
    headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',  # Include Authorization here
    'Access-Control-Max-Age': '3600'
}

    if req.method == 'OPTIONS':
        return https_fn.Response('', status=204, headers=headers)

    print("Generating image")

    if req.method != 'POST' or not req.is_json:
        return https_fn.Response('Invalid request', status=400, headers=headers)

    try:
        prompts = req.get_json()["data"]["prompts"]
        language = req.get_json()["data"]["language"]
        selfDescription = req.get_json()["data"]["selfDescription"]
        use_self_description = req.get_json()["data"]["useSelfDescription"]
        user_auth = req.get_json()["data"]["uidAuth"]
        style = req.get_json()["data"]["style"]
    except Exception as e:
        print(f"Error extracting prompt: {e}")
        return https_fn.Response('Invalid payload', status=400, headers=headers)
    print(prompts)
    if not prompts:
        return https_fn.Response('Prompt is required', status=400, headers=headers)

    openai.api_key = get_openai_key()
    print("Got API key")
    prompts_map = {f'{index}': inner for index, inner in enumerate(prompts)}
    print(prompts_map)
    doc_ref, new_doc = db.collection('pictureboards').add({
        'prompts': prompts_map,
        'uidAuth': user_auth,
        'selfDescription': selfDescription,
        'language': language,
        'useSelfDescription': use_self_description,
    })

    folder_name = new_doc.id   # Use get() to wait for the operation to complete

    # Get the document ID
    print(f"Created document with ID: {folder_name}")
    # Initialize Storage
    bucket = storage.bucket()


    # Prepare a list of image creation tasks
    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = []
        for prompt_array in prompts:
            for prompt in prompt_array:
                slugified_prompt = slugify(prompt)
                # Submit tasks to the executor pool
                print(style)
                if(style['style'] == "minimalistic"):
                    prompt = f"Design a single sticker featuring {prompt}. illustrated in a minamalistic cartoon style with colors and bold outlines, with no background. The characters should be arranged in a coherent scene that captures a cheerful, child-friendly aesthetic. The illustration should capture a sense of fun and be suitable for printing as a sticker for a child-friendly audience."
                elif(style['style'] == "realistic"):
                    prompt = f"Design a single sticker featuring {prompt}. Photo-captured in a hyperrealistic style with life-life colors and styling, with no background. The characters should be arranged in a coherent scene that captures a normal life-like scene. The illustration should capture a sense of education and be suitable for printing as a sticker."
                elif(style['style'] == "cartoon"):
                    prompt = f"Design a single sticker featuring {prompt}. illustrated in a simplified cartoon style with bright colors and bold outlines, with no background. The characters should be arranged in a coherent scene that captures a cheerful, child-friendly aesthetic. The illustration should capture a sense of fun and be suitable for printing as a sticker for a child-friendly audience."
                
                if(style['isBlackAndWhite']):
                    prompt = f"{prompt} no color and in Black and White"

                futures.append(executor.submit(create_image_and_upload, slugified_prompt, prompt, bucket, folder_name))
        
        # Wait for all futures to complete
        results = [future.result() for future in concurrent.futures.as_completed(futures)]

    # Return the Firestore document ID
    return https_fn.Response(json.dumps({'data': {'uid': folder_name}}), status=200, headers=headers, content_type='application/json')
   

def create_image_and_upload(slugified_prompt, prompt, bucket, doc_id):
    try:
        response = openai.Image.create(prompt=prompt, n=1, size="1024x1024", model="dall-e-3")
        image_url = response["data"][0]["url"]
        
        image_response = requests.get(image_url)
        if image_response.status_code != 200:
            raise Exception("Failed to download image from OpenAI")

        image_data = image_response.content

      
        blob = bucket.blob(f"pictureboards/{doc_id}/{slugified_prompt}.png")
        
        blob.upload_from_string(image_data, content_type="image/png")

        blob.make_public()

        # Return the public URL of the image
        return blob.public_url

    except Exception as e:
        print(f"Error generating or uploading image: {e}")
        return None
    
def slugify(text):
    # Convert text to lowercase
    text = text.lower()
    # Replace non-word (word here stands for alphanumeric) characters and spaces with hyphens
    text = re.sub(r'[\W\s]+', '-', text)
    # Remove leading and trailing hyphens
    text = text.strip('-')
    return text



@https_fn.on_request()
def regen_image(req: https_fn.Request) -> https_fn.Response:
    headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',  # Include Authorization here
    'Access-Control-Max-Age': '3600'
}

    if req.method == 'OPTIONS':
        return https_fn.Response('', status=204, headers=headers)

    print("Generating image")

    if req.method != 'POST' or not req.is_json:
        return https_fn.Response('Invalid request', status=400, headers=headers)

    try:
        prompt = req.get_json()["data"]["prompt"]
        id = req.get_json()["data"]["id"]
        
    except Exception as e:
        print(f"Error extracting prompt: {e}")
        return https_fn.Response('Invalid payload', status=400, headers=headers)
    print(prompt)
    if not prompt:
        return https_fn.Response('Prompt is required', status=400, headers=headers)

    openai.api_key = get_openai_key()
    print("Got API key")

    # Access the document using the id then get language, selfDescription, useSelfDescription
    try:
        doc_ref = db.collection('pictureboards').document(id)
        doc = doc_ref.get()
        if doc.exists:
            doc_data = doc.to_dict()
            language = doc_data.get('language')
            selfDescription = doc_data.get('selfDescription')
            useSelfDescription = doc_data.get('useSelfDescription')
            # Use these variables as needed
        else:
            return https_fn.Response('Document not found', status=404, headers=headers)
    except Exception as e:
        print(f"Error accessing Firestore: {e}")
        return https_fn.Response('Error accessing Firestore', status=500, headers=headers)

    # Delete the prompt from the storage bucket then regenerate it with the new image

    bucket = storage.bucket()
    slugified_prompt = slugify(prompt)  # You need a function to 'slugify' the prompt
# Delete existing image if necessary
    delete_image(slugified_prompt, bucket, id)  # Make sure this function is properly defined
    # Create and upload the new image
    

    new_image_url = create_image_and_upload(slugified_prompt, prompt, bucket, id)

    if new_image_url:
        return https_fn.Response(json.dumps({'data': {'url': new_image_url}}), status=200, headers=headers)
    else:
        return https_fn.Response(json.dumps({'data': {'url': new_image_url}}), status=500, headers=headers)


   

    
def delete_image(slugified_prompt, bucket, doc_id):

    try:
        blob = bucket.blob(f"pictureboards/{doc_id}/{slugified_prompt}.png")
        blob.delete()
        print(f"Image deleted: {slugified_prompt}.png")
    except Exception as e:
        print(f"Error deleting image: {e}")
        return None 
   