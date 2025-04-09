from flask import Blueprint, request, jsonify
import requests
import os
import json
from app import db
from app.models import WeatherRecord

weather_bp = Blueprint('weather', __name__)

@weather_bp.route('/api/weather', methods=['POST'])
def get_weather():
    try:
        data = request.get_json(force=True) #gives error if not JSON
        location = data.get('location')
        params = {
            'key': os.getenv('WEATHER_API_API_KEY'),
            'q': location
        }
        response = requests.get(f"{os.getenv('WEATHER_API_URL')}/current.json", params=params) #get weather data from weather API
        weather_data = response.json()

        #check if weather data is valid
        if weather_data.get('error'):
            return jsonify({"error": weather_data.get('error').get('message')}), 400
        
        print(json.dumps(weather_data, indent=4))
        return jsonify(weather_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@weather_bp.route('/api/historical', methods=['POST'])
def get_historical_weather():
    try:
        data = request.get_json(force=True)
        location = data.get('location')
        start_date = data.get('date')
        end_date = data.get('end_date')

        if not start_date or not end_date:
            return jsonify({"error": "Start and end date are required"}), 400

        params = {
            'q': location,
            'dt': start_date,
            'end_dt': end_date,
            'key': os.getenv('WEATHER_API_API_KEY')
        }

        response = requests.get(f"{os.getenv('WEATHER_API_URL')}/history.json", params=params)
        weather_data = response.json()

        if weather_data.get('error'):
            return jsonify({"error": weather_data.get('error').get('message')}), 400

        forecast_days = weather_data['forecast']['forecastday']
        location_info = weather_data['location']
        results = []
        print(f"Forecast Days: {forecast_days}")

        for day_data in forecast_days:
            results.append({
                "location": f"{location_info.get('name')}, {location_info.get('region')}, {location_info.get('country')}",
                "date": day_data['date'],
                "avg_temp_f": day_data['day']['avgtemp_f'],
                "condition": day_data['day']['condition']['text'],
                "icon": day_data['day']['condition']['icon']
            })
        


        return jsonify(results)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500