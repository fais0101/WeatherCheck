from flask import Blueprint, request, jsonify
import requests
import os
from dotenv import load_dotenv
from flask_cors import CORS
load_dotenv()

youtube_bp = Blueprint('youtube', __name__)
CORS(youtube_bp)


@youtube_bp.route('/api/youtube', methods=['POST'])
def search_youtube():

    try:
        data = request.get_json()
        location = data.get('location')
        if not location:
            return jsonify({'error': 'Location is required'}), 400
        
        api_key = os.getenv('YOUTUBE_DATA_API_KEY')
        search_url = os.getenv('YOUTUBE_DATA_API_URL')

        params = {
            "part": "snippet",
            "q": f"{location} travel",
            "type": "video",
            "maxResults": 3,
            "key": api_key
        }

        response = requests.get(search_url, params=params)
        videos = response.json()

        return jsonify(videos)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500

