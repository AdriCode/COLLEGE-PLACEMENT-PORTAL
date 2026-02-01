import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileFetched, setProfileFetched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    api(`/jobs/${id}`)
      .then(setJob)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user?.role !== 'student') {
      setProfileFetched(true);
      return;
    }
    api('/students/profile')
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setProfileFetched(true));
  }, [user?.role]);

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

  const hasMinCgpa = job != null && job.minCgpa != null;
  const studentCgpa = profile?.cgpa;
  const eligibleByCgpa = !hasMinCgpa || (studentCgpa != null && studentCgpa >= job.minCgpa);
  const hasEligibleBranches = job != null && Array.isArray(job.eligibleBranches) && job.eligibleBranches.length > 0;
  const studentBranch = profile?.branch ? String(profile.branch).trim().toUpperCase() : null;
  const allowedBranches = hasEligibleBranches ? job.eligibleBranches.map((b) => String(b).trim().toUpperCase()) : [];
  const eligibleByBranch = !hasEligibleBranches || (studentBranch && allowedBranches.includes(studentBranch));
  const showNotEligibleCgpa = user?.role === 'student' && profileFetched && hasMinCgpa && !eligibleByCgpa;
  const showNotEligibleBranch = user?.role === 'student' && profileFetched && hasEligibleBranches && !eligibleByBranch;
  const showNotEligible = showNotEligibleCgpa || showNotEligibleBranch;

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (error && !job) return <div style={{ padding: 24, color: 'red' }}>{error}</div>;
  if (!job) return null;

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto', background: 'white', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <button type="button" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>Back</button>
      <h1>{job.title}</h1>
      {job.description && <p>{job.description}</p>}
      {job.eligibility && <p><strong>Eligibility:</strong> {job.eligibility}</p>}
      {job.minCgpa != null && <p><strong>Minimum CGPA:</strong> {job.minCgpa}</p>}
      {hasEligibleBranches && <p><strong>Eligible branches:</strong> {job.eligibleBranches.join(', ')}</p>}
      {job.deadline && <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>}
      {showNotEligibleCgpa && (
        <p style={{ color: '#c00', fontWeight: 'bold', marginTop: 12 }}>
          Not eligible: minimum CGPA required is {job.minCgpa}.{studentCgpa != null ? ` Your CGPA is ${studentCgpa}.` : ' Add your CGPA in Profile.'}
        </p>
      )}
      {showNotEligibleBranch && (
        <p style={{ color: '#c00', fontWeight: 'bold', marginTop: 12 }}>
          Not eligible: this job is for branches {job.eligibleBranches.join(', ')}.{studentBranch ? ` Your branch is ${profile.branch}.` : ' Add your branch in Profile.'}
        </p>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user?.role === 'student' && (
        <button type="button" onClick={handleApply} disabled={applying || showNotEligible} style={{ marginTop: 16, padding: '10px 20px', cursor: applying || showNotEligible ? 'not-allowed' : 'pointer' }}>
          {applying ? 'Applying...' : showNotEligible ? 'Not eligible' : 'Apply'}
        </button>
      )}
      {user?.role === 'recruiter' && String(job.recruiterId) === user.id && (
        <p style={{ marginTop: 16 }}><Link to={`/jobs/${id}/applications`}>View applicants</Link></p>
      )}
    </div>
  );
}
