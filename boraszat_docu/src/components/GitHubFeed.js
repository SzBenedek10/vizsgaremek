import React, { useState, useEffect } from 'react';


export default function GitHubFeed() {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);


  const USERNAME = 'SzBenedek10';
  const REPO = 'vizsgaremek';

  useEffect(() => {
    fetch(`https://api.github.com/repos/${USERNAME}/${REPO}/commits?per_page=99`)
      .then(res => res.json())
      .then(data => {
        setCommits(data);
        setLoading(false);
      })
      .catch(err => console.error("Hiba a GitHub lekérésnél:", err));
  }, []);

  if (loading) return <p>Frissítések betöltése a GitHubról...</p>;

  return (
  <div style={{ 
    padding: '1rem', 
    background: '#f6f8fa', 
    borderRadius: '8px', 
    color: '#24292f' 
  }}>
    <h4> Projekt Fejlődési Idővonal</h4>
    <div style={{ 
      maxHeight: '500px', 
      overflowY: 'auto',   
      paddingRight: '10px'
    }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {commits.map(commit => (
          <li key={commit.sha} style={{ 
            marginBottom: '15px', 
            borderBottom: '1px solid #e1e4e8',
            paddingBottom: '10px'
          }}>
            <span style={{ fontSize: '0.85rem', color: '#57606a' }}>
              {new Date(commit.commit.author.date).toLocaleDateString('hu-HU')}
            </span>
            <div style={{ fontWeight: 'bold', margin: '5px 0' }}>
              {commit.commit.message}
            </div>
            <a href={commit.html_url} target="_blank" style={{ fontSize: '0.75rem' }}>
              <code>{commit.sha.substring(0, 7)}</code> kód megtekintése →
            </a>
          </li>
        ))}
      </ul>
    </div>
  </div>
);}