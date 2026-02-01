import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/jobs')
      .then(setJobs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Loading jobs...</div>;
  if (error) return <div style={{ padding: 24, color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h1>Job Openings</h1>
      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {jobs.map((job) => (
            <li key={job._id} style={{ marginBottom: 16, padding: 16, background: 'white', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
              <Link to={`/jobs/${job._id}`} style={{ fontWeight: 'bold', fontSize: 18 }}>{job.title}</Link>
              {job.eligibility && <p style={{ margin: '8px 0 0', color: '#666' }}>Eligibility: {job.eligibility}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
