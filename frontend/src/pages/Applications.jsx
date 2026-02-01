import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/students/applications')
      .then(setApplications)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Loading applications...</div>;
  if (error) return <div style={{ padding: 24, color: 'red' }}>{error}</div>;

  const statusColor = (s) => (s === 'shortlisted' ? 'green' : s === 'rejected' ? 'red' : '#666');

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h1>My Applications</h1>
      {applications.length === 0 ? (
        <p>You have not applied to any jobs yet. <Link to="/jobs">Browse jobs</Link></p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {applications.map((app) => (
            <li key={app._id} style={{ marginBottom: 16, padding: 16, background: 'white', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
              <Link to={`/jobs/${app.jobId?._id || app.jobId}`} style={{ fontWeight: 'bold' }}>{app.jobId?.title || 'Job'}</Link>
              <p style={{ margin: '8px 0 0', color: statusColor(app.status) }}>Status: {app.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
