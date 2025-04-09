import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Records.css';

const Records = () => {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedNote, setEditedNote] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/records');
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      setError('Failed to fetch records');
    }
  };
  const addRecord = async(record)=>{
    try{
      const res = await fetch('http://localhost:8080/api/records', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(record),
      });
      fetchRecords();
    } catch (err) {
      setError('Failed to add record');
    }
  };

  const deleteRecord = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/records/${id}`, {
        method: 'DELETE',
      });
      fetchRecords();
    } catch (err) {
      setError('Failed to delete record');
    }
  };

  const updateRecord = async (id, notes) => {
    try {
      await fetch(`http://localhost:8080/api/records/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      fetchRecords();
      setEditingId(null);
    } catch (err) {
      setError('Failed to update record');
    }
  };

  const startEditing = (record) => {
    setEditingId(record.id);
    setEditedNote(record.notes);
  };

  return (
    <div className="records">
      <button className="back-button" onClick={() => navigate('/')}>
        ⬅️ Back to Weather
      </button>
      
      {error && <p className="error">{error}</p>}

      {records.length === 0 ? (
        <p>No records yet.</p>
      ) : (
        <table className="records-table">
          <thead>
            <tr>
              <th>Location</th>
              <th>Start</th>
              <th>End</th>
              <th>Temp</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec.id}>
                <td>{rec.location}</td>
                <td>{rec.start_date}</td>
                <td>{rec.end_date}</td>
                <td>{rec.temperature ?? '-'}°F</td>
                <td>
                  {editingId === rec.id ? (
                    <input
                      type="text"
                      value={editedNote}
                      onChange={(e) => setEditedNote(e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    rec.notes
                  )}
                </td>
                <td>
                  {editingId === rec.id ? (
                    <button onClick={() => updateRecord(rec.id, editedNote)}>💾</button>
                  ) : (
                    <>
                      <button onClick={() => startEditing(rec)}>✏️</button>
                      <button onClick={() => deleteRecord(rec.id)}>🗑️</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Records;
