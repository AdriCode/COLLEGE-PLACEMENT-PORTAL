import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function MyJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/jobs?recruiterId=' + (user?.id || ''))
      .then(setJobs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (error) return <div style={{ padding: 24, color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h1>My Jobs</h1>
      <p><Link to="/jobs/new">Post a new job</Link></p>
      {jobs.length === 0 ? (
        <p>You have not posted any jobs yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {jobs.map((job) => (
            <li key={job._id} style={{ marginBottom: 16, padding: 16, background: 'white', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
              <Link to={`/jobs/${job._id}`} style={{ fontWeight: 'bold' }}>{job.title}</Link>
              <p style={{ margin: '8px 0 0' }}><Link to={`/jobs/${job._id}/applications`}>View applicants</Link></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
