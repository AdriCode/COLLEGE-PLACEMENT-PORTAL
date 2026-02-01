import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { BRANCHES } from '../constants/branches';

export default function NewJob() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [minCgpa, setMinCgpa] = useState('');
  const [eligibleBranches, setEligibleBranches] = useState([]);
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const toggleBranch = (branch) => {
    setEligibleBranches((prev) =>
      prev.includes(branch) ? prev.filter((b) => b !== branch) : [...prev, branch]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api('/jobs', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          eligibility,
          minCgpa: minCgpa ? Number(minCgpa) : undefined,
          eligibleBranches: eligibleBranches.length ? eligibleBranches : undefined,
          deadline: deadline || undefined,
        }),
      });
      navigate('/my-jobs');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '24px auto', padding: 24, background: 'white', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h1>Post a Job</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>Title *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>Eligibility</label>
          <input value={eligibility} onChange={(e) => setEligibility(e.target.value)} style={{ width: '100%', padding: 8 }} placeholder="e.g. CGPA >= 7.5" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>Minimum CGPA</label>
          <input type="number" min="0" max="10" step="0.01" value={minCgpa} onChange={(e) => setMinCgpa(e.target.value)} style={{ width: '100%', padding: 8 }} placeholder="e.g. 7.5 (optional)" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>Eligible branches (leave empty = all)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {BRANCHES.map((b) => (
              <label key={b} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                <input type="checkbox" checked={eligibleBranches.includes(b)} onChange={() => toggleBranch(b)} />
                <span>{b}</span>
              </label>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>Deadline</label>
          <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={{ width: '100%', padding: 8 }} />
        </div>
        <button type="submit" disabled={saving} style={{ padding: '10px 20px', cursor: saving ? 'not-allowed' : 'pointer' }}>{saving ? 'Posting...' : 'Post Job'}</button>
      </form>
    </div>
  );
}
