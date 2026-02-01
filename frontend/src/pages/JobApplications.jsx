import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function JobApplications() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api(`/jobs/${id}`)
      .then((job) => {
        setJobTitle(job.title);
        return api(`/jobs/${id}/applications`);
      })
      .then(setApplications)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (appId, status) => {
    try {
      await api(`/applications/${appId}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
      setApplications((prev) => prev.map((a) => (a._id === appId ? { ...a, status } : a)));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (error && applications.length === 0) return <div style={{ padding: 24, color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: 24, maxWidth: 700, margin: '0 auto' }}>
      <button type="button" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>Back</button>
      <h1>Applicants: {jobTitle}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {applications.map((app) => (
            <li key={app._id} style={{ marginBottom: 16, padding: 16, background: 'white', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
              <p><strong>Email:</strong> {app.studentId?.email || app.studentId}</p>
              <p style={{ color: app.status === 'shortlisted' ? 'green' : app.status === 'rejected' ? 'red' : '#666' }}>Status: {app.status}</p>
              {app.status === 'applied' && (
                <div style={{ marginTop: 8 }}>
                  <button type="button" onClick={() => updateStatus(app._id, 'shortlisted')} style={{ marginRight: 8 }}>Shortlist</button>
                  <button type="button" onClick={() => updateStatus(app._id, 'rejected')}>Reject</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
