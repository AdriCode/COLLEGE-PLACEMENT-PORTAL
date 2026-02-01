import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [profileFetched, setProfileFetched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/jobs')
      .then(setJobs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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

  if (loading) return <div style={{ padding: 24 }}>Loading jobs...</div>;
  if (error) return <div style={{ padding: 24, color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h1>Job Openings</h1>
      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {jobs.map((job) => {
            const hasMinCgpa = job.minCgpa != null;
            const studentCgpa = profile?.cgpa;
            const notEligibleByCgpa = user?.role === 'student' && profileFetched && hasMinCgpa && (studentCgpa == null || studentCgpa < job.minCgpa);
            return (
              <li key={job._id} style={{ marginBottom: 16, padding: 16, background: 'white', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
                <Link to={`/jobs/${job._id}`} style={{ fontWeight: 'bold', fontSize: 18 }}>{job.title}</Link>
                {job.eligibility && <p style={{ margin: '8px 0 0', color: '#666' }}>Eligibility: {job.eligibility}</p>}
                {job.minCgpa != null && <p style={{ margin: '4px 0 0', color: '#666' }}>Min CGPA: {job.minCgpa}</p>}
                {notEligibleByCgpa && (
                  <span style={{ display: 'inline-block', marginTop: 8, padding: '4px 8px', background: '#fee', color: '#c00', borderRadius: 4, fontSize: 14 }}>Not eligible (CGPA)</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
