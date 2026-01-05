import React, { useState, useEffect } from 'react';
import { historyAPI } from '../api';
import { useParams, useNavigate } from 'react-router-dom';

function HistoryDetail() {
  const [historyItem, setHistoryItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadHistoryItem();
  }, [id]);

  const loadHistoryItem = async () => {
    try {
      const response = await historyAPI.getOne(id);
      setHistoryItem(response.data);
    } catch (error) {
      console.error('Error loading history item:', error);
      alert('Item not found');
      navigate('/history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  if (!historyItem) {
    return <div style={styles.container}>Item not found</div>;
  }

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigate('/history')}>
        ← Back to History
      </button>

      <div style={styles.header}>
        <div>
          <h2 style={styles.query}>{historyItem.query}</h2>
          <p style={styles.date}>
            Searched on: {new Date(historyItem.searchedAt).toLocaleString()}
          </p>
        </div>
      </div>

      {historyItem.notes && (
        <div style={styles.notesBox}>
          <strong>Notes:</strong> {historyItem.notes}
        </div>
      )}

      <h3 style={styles.resultsTitle}>
        Search Results ({historyItem.results.length})
      </h3>

      <div style={styles.results}>
        {historyItem.results.map((result, index) => (
          <div key={index} style={styles.resultCard}>
            <a href={result.url} target="_blank" rel="noopener noreferrer" style={styles.resultTitle}>
              {result.name}
            </a>
            <p style={styles.resultUrl}>{result.url}</p>
            <p style={styles.resultSnippet}>{result.snippet}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    marginBottom: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '20px',
  },
  query: {
    margin: '0 0 10px 0',
    fontSize: '28px',
  },
  date: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  notesBox: {
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  resultsTitle: {
    marginBottom: '15px',
  },
  results: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  resultCard: {
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  resultTitle: {
    fontSize: '18px',
    color: '#1a0dab',
    textDecoration: 'none',
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '5px',
  },
  resultUrl: {
    fontSize: '14px',
    color: '#006621',
    margin: '0 0 10px 0',
  },
  resultSnippet: {
    fontSize: '14px',
    color: '#545454',
    lineHeight: '1.5',
    margin: 0,
  },
};

export default HistoryDetail;