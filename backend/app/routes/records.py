from flask import Blueprint, request, jsonify, make_response
from app import db
from app.models import WeatherRecord
from datetime import datetime
import csv, io, json

records_bp = Blueprint('records', __name__)

@records_bp.route('/api/records', methods=['POST'])
def create_record():
    try:
        data = request.get_json(force=True)
        print(f"Received data: {data}")  # Debug print

        # Try different time formats
        start_date_str = data.get('start_date')
        if start_date_str:
            try:
                # Try HH:MM:SS format first
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d %H:%M:%S')
            except ValueError:
                try:
                    # Try HH:MM format
                    start_date = datetime.strptime(start_date_str, '%Y-%m-%d %H:%M')
                except ValueError:
                    print(f"Error parsing date: {start_date_str}")
                    return jsonify({'error': f'Invalid date format: {start_date_str}'}), 400
        else:
            start_date = None

        record = WeatherRecord(
            location=data['location'],
            start_date=start_date,
            temperature=data.get('temperature'),
            notes=data.get('notes')
        )

        db.session.add(record)
        db.session.commit()
        print(f"Record created: {record.to_dict()}")  # Debug print
        return jsonify(record.to_dict()), 201

    except Exception as e:
        print(f"Error creating record: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
@records_bp.route('/api/records', methods=['GET'])
def get_records():
    try:
        records = WeatherRecord.query.all()
        return jsonify([record.to_dict() for record in records])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


@records_bp.route('/api/records/<int:record_id>', methods=['DELETE'])
def delete_record(record_id):
    try:
        record = WeatherRecord.query.get(record_id)
        db.session.delete(record)
        db.session.commit()
        return jsonify({'message': 'Record deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

    
        
@records_bp.route('/api/records/<int:record_id>', methods=['PUT'])
def update_record(record_id):
    try:
        data = request.get_json(force=True)
        record = WeatherRecord.query.get(record_id)

        if not record:
            return jsonify({'error': 'Record not found'}), 404

        # Update only relevant fields 
        record.notes = data.get('notes', record.notes)

        db.session.commit()

        return jsonify(record.to_dict())

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@records_bp.route('/api/records/export', methods=['GET'])
def export_records():
    format = request.args.get('format', 'json').lower()
    records = WeatherRecord.query.all()

    if format == 'json':
        return jsonify([r.to_dict() for r in records])
    elif format == 'csv':
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(['id', 'location', 'temperature', 'start_date', 'notes'])

        for r in records:
            writer.writerow([r.id, r.location, r.temperature,r.start_date,r.notes])
        
        response = make_response(output.getvalue())
        response.headers['Content-Disposition'] = 'attachment; filename=records.csv'
        response.headers['Content-Type'] = 'text/csv'
        return response
    else:
        return jsonify({'error': 'Invalid format. Supported: json, csv'}), 400
    
    