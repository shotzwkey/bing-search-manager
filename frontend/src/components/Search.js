import React, { useState } from 'react';
import { searchAPI, historyAPI } from '../api';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setSearched(true);
    try {
      const response = await searchAPI.search(query, 10);
      setResults(response.data.results);
    } catch (error) {
      alert('Error searching. Please check your SerpAPI key.');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToHistory = async () => {
    try {
      await historyAPI.add({
        query,
        results
      });
      alert('Search saved to history!');
    } catch (error) {
      alert('Error saving to history');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Search the Web</h2>
      
      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="Enter your search query..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button style={styles.searchButton} type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {searched && results.length > 0 && (
        <div style={styles.saveContainer}>
          <button style={styles.saveButton} onClick={handleSaveToHistory}>
            Save to History
          </button>
          <p style={styles.resultCount}>{results.length} results found</p>
        </div>
      )}

      {loading && <p style={styles.loading}>Loading results...</p>}

      <div style={styles.results}>
        {results.map((result, index) => (
          <div key={index} style={styles.resultCard}>
            <a href={result.url} target="_blank" rel="noopener noreferrer" style={styles.resultTitle}>
              {result.name}
            </a>
            <p style={styles.resultUrl}>{result.url}</p>
            <p style={styles.resultSnippet}>{result.snippet}</p>
          </div>
        ))}
      </div>

      {searched && results.length === 0 && !loading && (
        <p style={styles.noResults}>No results found. Try a different search.</p>
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
  heading: {
    marginBottom: '20px',
  },
  searchForm: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  searchInput: {
    flex: 1,
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  searchButton: {
    padding: '12px 30px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  saveContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
  },
  saveButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  resultCount: {
    margin: 0,
    color: '#666',
    fontSize: '14px',
  },
  loading: {
    textAlign: 'center',
    color: '#666',
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
  noResults: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#666',
    marginTop: '40px',
  },
};

export default Search;