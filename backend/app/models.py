from . import db
from datetime import datetime

class WeatherRecord(db.Model):
    __tablename__ = 'weather_record'

    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    temperature = db.Column(db.Float)
    notes = db.Column(db.String(255))

    def to_dict(self):
        return {
            "id": self.id,
            "location": self.location,
            "start_date": self.start_date.strftime('%Y-%m-%d %H:%M') if self.start_date else None,
            "end_date": self.end_date.strftime('%Y-%m-%d %H:%M') if self.end_date else None,
            "temperature": self.temperature,
            "notes": self.notes
        }
    
    # Weather Record  
# +---------------+---------------+----------+
# | Column        | Type          | Nullable |
# +---------------+---------------+----------+
# | id            | Integer       | No (PK)  |
# | location      | String(100)   | No       |
# | start_date    | Date          | Yes      |
# | end_date      | Date          | Yes      |
# | temperature   | Float         | Yes      |
# | notes         | String(255)   | Yes      |
# +---------------+---------------+----------+
