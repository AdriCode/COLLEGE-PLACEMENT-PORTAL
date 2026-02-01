import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === 'student') {
    return (
      <div style={{ padding: 24 }}>
        <h1>Student Dashboard</h1>
        <p>Welcome, {user.email}. View jobs and track your applications.</p>
        <p><Link to="/jobs">Browse Jobs</Link> | <Link to="/applications">My Applications</Link> | <Link to="/profile">Profile</Link></p>
      </div>
    );
  }

  if (user.role === 'recruiter') {
    return (
      <div style={{ padding: 24 }}>
        <h1>Recruiter Dashboard</h1>
        <p>Welcome, {user.email}. Post jobs and manage applicants.</p>
        <p><Link to="/my-jobs">My Jobs</Link> | <Link to="/jobs">All Jobs</Link> | <Link to="/profile">Profile</Link></p>
      </div>
    );
  }

  if (user.role === 'admin') {
    return (
      <div style={{ padding: 24 }}>
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user.email}. Approve recruiters and view stats.</p>
        <p><Link to="/admin">Admin Panel</Link></p>
      </div>
    );
  }

  return null;
}
