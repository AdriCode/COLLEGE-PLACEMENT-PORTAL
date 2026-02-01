import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav style={{ padding: '12px 24px', background: '#1976d2', color: 'white', display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Link to="/dashboard" style={{ color: 'white', fontWeight: 'bold' }}>Placement Portal</Link>
      <Link to="/dashboard" style={{ color: 'white' }}>Dashboard</Link>
      <Link to="/jobs" style={{ color: 'white' }}>Jobs</Link>
      {(user.role === 'student' || user.role === 'recruiter') && (
        <Link to="/profile" style={{ color: 'white' }}>Profile</Link>
      )}
      {user.role === 'student' && (
        <Link to="/applications" style={{ color: 'white' }}>My Applications</Link>
      )}
      {user.role === 'recruiter' && (
        <Link to="/my-jobs" style={{ color: 'white' }}>My Jobs</Link>
      )}
      {user.role === 'admin' && (
        <Link to="/admin" style={{ color: 'white' }}>Admin</Link>
      )}
      <span style={{ marginLeft: 'auto' }}>{user.email} ({user.role})</span>
      <button type="button" onClick={handleLogout} style={{ padding: '6px 12px', cursor: 'pointer' }}>Logout</button>
    </nav>
  );
}
