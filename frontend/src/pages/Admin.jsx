import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function Admin() {
  const [pending, setPending] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api('/recruiters/pending'), api('/admin/stats')])
      .then(([p, s]) => {
        setPending(p);
        setStats(s);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const approve = async (id) => {
    try {
      await api(`/recruiters/${id}/approve`, { method: 'PUT' });
      setPending((prev) => prev.filter((r) => r._id !== id));
      if (stats) setStats({ ...stats, approvedRecruiters: stats.approvedRecruiters + 1 });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (error) return <div style={{ padding: 24, color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h1>Admin Panel</h1>
      {stats && (
        <div style={{ marginBottom: 24, padding: 16, background: 'white', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2>Statistics</h2>
          <p>Jobs: {stats.jobs} | Applications: {stats.applications} | Students: {stats.students} | Approved Recruiters: {stats.approvedRecruiters}</p>
        </div>
      )}
      <h2>Pending Recruiter Approvals</h2>
      {pending.length === 0 ? (
        <p>No pending approvals.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {pending.map((r) => (
            <li key={r._id} style={{ marginBottom: 12, padding: 16, background: 'white', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{r.companyName} ({r.userId?.email || r.userId})</span>
              <button type="button" onClick={() => approve(r._id)}>Approve</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
