import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { BRANCHES } from '../constants/branches';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', branch: '', cgpa: '', resumeUrl: '', companyName: '' });

  useEffect(() => {
    let cancelled = false;
    const path = user?.role === 'student' ? '/students/profile' : '/recruiters/profile';
    api(path)
      .then((data) => {
        if (!cancelled) {
          setProfile(data);
          if (user?.role === 'student') {
            setForm({ name: data.name || '', branch: data.branch || '', cgpa: data.cgpa ?? '', resumeUrl: data.resumeUrl || '' });
          } else {
            setForm({ companyName: data.companyName || '' });
          }
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [user?.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const path = user?.role === 'student' ? '/students/profile' : '/recruiters/profile';
    try {
      const body = user?.role === 'student'
        ? { name: form.name, branch: form.branch, cgpa: form.cgpa ? Number(form.cgpa) : undefined, resumeUrl: form.resumeUrl }
        : { companyName: form.companyName };
      const data = await api(path, { method: 'PUT', body: JSON.stringify(body) });
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user || (user.role !== 'student' && user.role !== 'recruiter')) {
    return <div style={{ padding: 24 }}>Access denied.</div>;
  }

  if (loading) return <div style={{ padding: 24 }}>Loading profile...</div>;

  return (
    <div style={{ maxWidth: 500, margin: '24px auto', padding: 24, background: 'white', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h1>Profile</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {user.role === 'student' && (
          <>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Name</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} style={{ width: '100%', padding: 8 }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Branch</label>
              <select value={form.branch} onChange={(e) => setForm((f) => ({ ...f, branch: e.target.value }))} style={{ width: '100%', padding: 8 }}>
                <option value="">Select branch</option>
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>CGPA</label>
              <input type="number" step="0.01" value={form.cgpa} onChange={(e) => setForm((f) => ({ ...f, cgpa: e.target.value }))} style={{ width: '100%', padding: 8 }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Resume URL</label>
              <input value={form.resumeUrl} onChange={(e) => setForm((f) => ({ ...f, resumeUrl: e.target.value }))} style={{ width: '100%', padding: 8 }} placeholder="https://..." />
            </div>
          </>
        )}
        {user.role === 'recruiter' && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Company Name</label>
            <input value={form.companyName} onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))} style={{ width: '100%', padding: 8 }} />
            {profile?.approved === false && <p style={{ color: 'orange', marginTop: 8 }}>Your account is pending approval. You can post jobs after admin approval.</p>}
          </div>
        )}
        <button type="submit" disabled={saving} style={{ padding: '10px 20px', cursor: saving ? 'not-allowed' : 'pointer' }}>{saving ? 'Saving...' : 'Save'}</button>
      </form>
    </div>
  );
}
