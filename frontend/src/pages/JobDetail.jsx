import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    api(`/jobs/${id}`)
      .then(setJob)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    setError('');
    setApplying(true);
    try {
      await api('/applications', { method: 'POST', body: JSON.stringify({ jobId: id }) });
      setJob((j) => j && { ...j, applied: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (error && !job) return <div style={{ padding: 24, color: 'red' }}>{error}</div>;
  if (!job) return null;

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto', background: 'white', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <button type="button" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>Back</button>
      <h1>{job.title}</h1>
      {job.description && <p>{job.description}</p>}
      {job.eligibility && <p><strong>Eligibility:</strong> {job.eligibility}</p>}
      {job.deadline && <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user?.role === 'student' && (
        <button type="button" onClick={handleApply} disabled={applying} style={{ marginTop: 16, padding: '10px 20px', cursor: applying ? 'not-allowed' : 'pointer' }}>
          {applying ? 'Applying...' : 'Apply'}
        </button>
      )}
      {user?.role === 'recruiter' && String(job.recruiterId) === user.id && (
        <p style={{ marginTop: 16 }}><Link to={`/jobs/${id}/applications`}>View applicants</Link></p>
      )}
    </div>
  );
}
