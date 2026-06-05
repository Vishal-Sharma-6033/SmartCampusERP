import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import Forbidden from './pages/Forbidden';

// Dashboards
import AdminDashboard from './pages/admin/Dashboard';
import TeacherDashboard from './pages/teacher/Dashboard';
import StudentDashboard from './pages/student/Dashboard';
import ParentDashboard from './pages/parent/Dashboard';

// Timetable Pages
import StudentTimetable from './pages/student/Timetable';
import TeacherTimetable from './pages/teacher/Timetable';
import AdminTimetable from './pages/admin/Timetable';

// Attendance Pages
import StudentAttendance from './pages/student/Attendance';
import MarkAttendance from './pages/teacher/MarkAttendance';

// Assignment Pages
import TeacherAssignments from './pages/teacher/Assignments';
import CreateAssignment from './pages/teacher/CreateAssignment';
import Submissions from './pages/teacher/Submissions';
import StudentAssignments from './pages/student/Assignments';
import SubmitAssignment from './pages/student/SubmitAssignment';

// Helper component to redirect root "/" to appropriate dashboard or login
const RootRedirect = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem',
        backgroundColor: 'var(--bg)'
      }}>
        <div className="spinner spinner-dark"></div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Loading, please wait...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/403" element={<Forbidden />} />

          {/* Protected Shell Layout Routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboards */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/dashboard"
              element={
                <ProtectedRoute allowedRoles={['TEACHER']}>
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/parent/dashboard"
              element={
                <ProtectedRoute allowedRoles={['PARENT']}>
                  <ParentDashboard />
                </ProtectedRoute>
              }
            />

            {/* Timetable Routes */}
            <Route
              path="/student/timetable"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentTimetable />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/timetable"
              element={
                <ProtectedRoute allowedRoles={['TEACHER']}>
                  <TeacherTimetable />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/timetable"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminTimetable />
                </ProtectedRoute>
              }
            />

            {/* Attendance Routes */}
            <Route
              path="/student/attendance"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/attendance"
              element={
                <ProtectedRoute allowedRoles={['TEACHER']}>
                  <MarkAttendance />
                </ProtectedRoute>
              }
            />

            {/* Assignment Routes */}
            <Route
              path="/teacher/assignments"
              element={
                <ProtectedRoute allowedRoles={['TEACHER']}>
                  <TeacherAssignments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/assignments/create"
              element={
                <ProtectedRoute allowedRoles={['TEACHER']}>
                  <CreateAssignment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/assignments/:assignmentId/submissions"
              element={
                <ProtectedRoute allowedRoles={['TEACHER']}>
                  <Submissions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/assignments"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentAssignments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/assignments/:assignmentId/submit"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <SubmitAssignment />
                </ProtectedRoute>
              }
            />

            {/* Parent Role Dummy Sub-routes */}
            <Route
              path="/parent/children"
              element={<Navigate to="/parent/dashboard" replace />}
            />
            <Route
              path="/parent/attendance"
              element={<Navigate to="/parent/dashboard" replace />}
            />
            <Route
              path="/parent/fees"
              element={<Navigate to="/parent/dashboard" replace />}
            />
            <Route
              path="/parent/results"
              element={<Navigate to="/parent/dashboard" replace />}
            />

            {/* Shared Placeholder Routes */}
            <Route
              path="/notifications"
              element={
                <div style={{ padding: '20px' }}>
                  <h1>Notifications</h1>
                  <p className="text-secondary">Notification details page (WIP for Task 8)</p>
                </div>
              }
            />
            <Route
              path="/notice-board"
              element={
                <div style={{ padding: '20px' }}>
                  <h1>Notice Board</h1>
                  <p className="text-secondary">Campus notices and calendar events (WIP for Task 9)</p>
                </div>
              }
            />
          </Route>

          {/* Root Redirect & Fallbacks */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
