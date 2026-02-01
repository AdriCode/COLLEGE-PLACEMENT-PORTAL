import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Applications from './pages/Applications';
import MyJobs from './pages/MyJobs';
import JobApplications from './pages/JobApplications';
import NewJob from './pages/NewJob';
import Admin from './pages/Admin';

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute roles={['student', 'recruiter']}>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/jobs"
        element={
          <PrivateRoute>
            <Jobs />
          </PrivateRoute>
        }
      />
      <Route
        path="/jobs/new"
        element={
          <PrivateRoute roles={['recruiter']}>
            <NewJob />
          </PrivateRoute>
        }
      />
      <Route
        path="/jobs/:id/applications"
        element={
          <PrivateRoute roles={['recruiter']}>
            <JobApplications />
          </PrivateRoute>
        }
      />
      <Route
        path="/jobs/:id"
        element={
          <PrivateRoute>
            <JobDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <PrivateRoute roles={['student']}>
            <Applications />
          </PrivateRoute>
        }
      />
      <Route
        path="/my-jobs"
        element={
          <PrivateRoute roles={['recruiter']}>
            <MyJobs />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute roles={['admin']}>
            <Admin />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
