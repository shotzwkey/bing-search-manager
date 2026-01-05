import React, { useState, useEffect } from 'react';
import { historyAPI } from '../api';
import { useNavigate } from 'react-router-dom';

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await historyAPI.getAll();
      setHistory(response.data);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this search from history?')) return;
    
    try {
      await historyAPI.delete(id);
      loadHistory();
    } catch (error) {
      alert('Error deleting item');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Clear all search history?')) return;
    
    try {
      await historyAPI.clearAll();
      loadHistory();
    } catch (error) {
      alert('Error clearing history');
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/history/${id}`);
  };

  const handleSaveNotes = async (id) => {
    try {
      await historyAPI.update(id, { notes: editNotes });
      setEditingId(null);
      setEditNotes('');
      loadHistory();
    } catch (error) {
      alert('Error saving notes');
    }
  };

  const startEditNotes = (item) => {
    setEditingId(item._id);
    setEditNotes(item.notes || '');
  };

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Search History</h2>
        {history.length > 0 && (
          <button style={styles.clearButton} onClick={handleClearAll}>
            Clear All History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p style={styles.empty}>No search history yet. Start searching!</p>
      ) : (
        <div style={styles.list}>
          {history.map((item) => (
            <div key={item._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.query}>{item.query}</h3>
                <span style={styles.date}>
                  {new Date(item.searchedAt).toLocaleString()}
                </span>
              </div>
              
              <p style={styles.resultCount}>
                {item.results.length} results found
              </p>

              {editingId === item._id ? (
                <div style={styles.notesEdit}>
                  <textarea
                    style={styles.notesTextarea}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Add notes about this search..."
                  />
                  <div style={styles.notesButtons}>
                    <button style={styles.saveNotesButton} onClick={() => handleSaveNotes(item._id)}>
                      Save
                    </button>
                    <button style={styles.cancelButton} onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {item.notes && (
                    <p style={styles.notes}>
                      <strong>Notes:</strong> {item.notes}
                    </p>
                  )}
                </>
              )}

              <div style={styles.actions}>
                <button style={styles.viewButton} onClick={() => handleViewDetails(item._id)}>
                  View Results
                </button>
                <button style={styles.notesButton} onClick={() => startEditNotes(item)}>
                  {item.notes ? 'Edit Notes' : 'Add Notes'}
                </button>
                <button style={styles.deleteButton} onClick={() => handleDelete(item._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  clearButton: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  empty: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#666',
    marginTop: '40px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  card: {
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '10px',
  },
  query: {
    margin: 0,
    fontSize: '20px',
    color: '#333',
  },
  date: {
    fontSize: '12px',
    color: '#999',
  },
  resultCount: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '10px',
  },
  notes: {
    fontSize: '14px',
    color: '#555',
    backgroundColor: '#f8f9fa',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '10px',
  },
  notesEdit: {
    marginBottom: '10px',
  },
  notesTextarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    minHeight: '80px',
    boxSizing: 'border-box',
    marginBottom: '10px',
  },
  notesButtons: {
    display: 'flex',
    gap: '10px',
  },
  saveNotesButton: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  cancelButton: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  viewButton: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  notesButton: {
    padding: '8px 16px',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  deleteButton: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default History;
