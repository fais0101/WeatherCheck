# Weather Check App

A full-stack weather application built with Flask backend and React frontend, featuring real-time weather data, location-based search, and YouTube travel video integration.

## Project Structure
```
project-root/
├── backend/
│   ├── .venv/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── models.py
│   │   └── routes/
│   │       ├── weather.py
│   │       ├── records.py
│   │       └── youtube.py
│   ├── app.py
│   ├── .env
│   └── requirements.txt
└── frontend/
    ├── node_modules/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Weather/
    │   │   ├── Records/
    │   │   └── YouTube/
    │   ├── pages/
    │   ├── App.js
    │   ├── App.css
    │   ├── App.test.js
    │   ├── index.js
    │   ├── index.css
    │   ├── setupTests.js
    │   ├── reportWebVitals.js
    │   └── logo.svg
    ├── package.json
    ├── package-lock.json
    └── README.md
```

## Features
- **Weather Information**
  - Real-time current weather data for any location
  - Historical weather data with date range selection
  - Detailed weather metrics including:
    - Temperature (current and feels like)
    - Humidity
    - Wind speed and direction
    - Pressure
    - Visibility
    - UV index
  - Weather condition icons and descriptions
  - Local time display for searched locations

- **Location Features**
  - City name, zip code, or coordinates search
  - Current location detection with geolocation
  - Region and country information display

- **Weather Records**
  - Save and track weather search history
  - Edit and delete saved records
  - Export records in JSON or CSV format
  - View detailed record information including:
    - Location
    - Date range
    - Temperature
    - Custom notes

- **Travel Integration**
  - Related YouTube travel videos for searched locations
  - Embedded video player for easy viewing
  - Top 3 relevant travel videos per location

- **User Interface**
  - Modern, responsive design with dark theme
  - Tab-based navigation (Current/Historical weather)
  - Interactive weather cards with hover effects
  - Animated transitions and loading states
  - Error handling and user feedback
  - Mobile-friendly layout
  - Custom styling with CSS variables
  - Gradient effects and modern UI elements

## Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.x
- Node.js and npm
- Git (for version control)
- MySQL Server and MySQL Workbench

## Database Setup

1. **Install MySQL Server**
   - Download and install MySQL Server from [MySQL official website](https://dev.mysql.com/downloads/mysql/)
   - During installation, note down your root password

2. **Create Database in MySQL Workbench**
   ```sql
   CREATE DATABASE weather;
   USE weather;
   ```

3. **Configure Database Connection**
   - Open MySQL Workbench
   - Create a new connection if not already done
   - Test the connection to ensure it works

## Installation

### Backend Setup
1. Create and activate virtual environment
```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate
```

2. Install Python dependencies
```bash
pip install -r requirements.txt
```

3. Set up environment variables
Create a `.env` file in the backend directory with the following variables:
```
# Database Configuration
DATABASE_URL=mysql+mysqlconnector://username:password@localhost/weather
# Format: mysql+mysqlconnector://username:password@host/database_name

# Weather API Configuration
WEATHER_API_API_KEY=your_weatherapi_key
WEATHER_API_URL=http://api.weatherapi.com/v1

# YouTube API Configuration
YOUTUBE_DATA_API_KEY=your_youtube_api_key
YOUTUBE_DATA_API_URL=https://www.googleapis.com/youtube/v3/search
```

4. Initialize the Database
```bash
flask shell
>>> from app import create_app, db
>>> app = create_app()
>>> with app.app_context():
...     db.create_all()
```

### Frontend Setup
1. Install dependencies
```bash
cd frontend
npm install
```

## Running the Application

### Start Backend Server
```bash
cd backend
flask run
# Server will start on http://localhost:8080
```

### Start Frontend Development Server
```bash
cd frontend
npm start
# Server will start on http://localhost:3000
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/weather` | POST | Get weather data for a location |
| `/api/records` | GET | Get weather search history |
| `/api/youtube` | POST | Get related travel videos |

## Technologies Used
- **Backend**
  - Flask
  - Flask-SQLAlchemy
  - Flask-CORS
  - Python-dotenv
  - Requests
  - MySQL
- **Frontend**
  - React.js
  - Axios
  - React Router DOM
  - CSS Modules

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Contact
Your Name - fsayedegy@gmail.com
Project Link: [https://github.com/fais0101/WeatherCheck]
