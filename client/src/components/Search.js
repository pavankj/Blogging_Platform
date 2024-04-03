import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {  Typography, Paper, Divider, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Search() {
  const location = useLocation();
  const searchQuery = location.state?.query;
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/blog/searchblog', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: searchQuery }),
        });

        if (!response.ok) {
          throw new Error('Search request failed');
        }

        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Failed to fetch search results:', error);
        setResults([]);
      }
    };

    if (searchQuery) {
      fetchResults();
    }
  }, [searchQuery]);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom style={{ color: '#2196f3' }}>
          Matches for your search "{searchQuery}"
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/')} style={{ color: '#2196f3', borderColor: '#2196f3' }}>
          Main
        </Button>
      </div>
      {results.length > 0 ? (
        results.map((result, index) => (
          <Paper elevation={2} style={{ margin: '20px 0', padding: '15px', backgroundColor: '#e3f2fd' }} key={index}>
            <Typography variant="h6" component="h2" style={{ color: '#2196f3' }}>
              {result.title}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom style={{ color: '#2196f3' }}>
              Author: {result.author}
            </Typography>
            <Divider style={{ margin: '10px 0', backgroundColor: '#2196f3' }} />
            <Typography variant="body1" component="p" style={{ color: '#000' }}>
              {result.content}
            </Typography>
          </Paper>
        ))
      ) : (
        <Typography variant="subtitle1" style={{ color: '#000' }}>
          We couldn't find anything matching your search criteria. Try using different keywords or broadening your search terms.
        </Typography>
      )}
    </div>
  );
}

export default Search;
