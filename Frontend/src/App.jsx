import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import ErrorBoundary from './components/ErrorBoundary';
import SkeletonLoader from './components/SkeletonLoader';

// Lazy load pages
const Login = lazy(() => import('./pages/Login'));
const Forbidden = lazy(() => import('./pages/Forbidden'));

// Dashboards
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const TeacherDashboard = lazy(() => import('./pages/teacher/Dashboard'));
const StudentDashboard = lazy(() => import('./pages/student/Dashboard'));
const ParentDashboard = lazy(() => import('./pages/parent/Dashboard'));

// Timetable Pages
const StudentTimetable = lazy(() => import('./pages/student/Timetable'));
const TeacherTimetable = lazy(() => import('./pages/teacher/Timetable'));
const AdminTimetable = lazy(() => import('./pages/admin/Timetable'));

// Attendance Pages
const StudentAttendance = lazy(() => import('./pages/student/Attendance'));
const MarkAttendance = lazy(() => import('./pages/teacher/MarkAttendance'));

// Assignment Pages
const TeacherAssignments = lazy(() => import('./pages/teacher/Assignments'));
const CreateAssignment = lazy(() => import('./pages/teacher/CreateAssignment'));
const Submissions = lazy(() => import('./pages/teacher/Submissions'));
const StudentAssignments = lazy(() => import('./pages/student/Assignments'));
const SubmitAssignment = lazy(() => import('./pages/student/SubmitAssignment'));

// Exam Pages
const Exams = lazy(() => import('./pages/student/Exams'));
const HallTicket = lazy(() => import('./pages/student/HallTicket'));
const Results = lazy(() => import('./pages/student/Results'));
const AdminExams = lazy(() => import('./pages/admin/Exams'));
const CreateExam = lazy(() => import('./pages/admin/CreateExam'));

// Fee Pages
const StudentFees = lazy(() => import('./pages/student/Fees'));
const AdminFees = lazy(() => import('./pages/admin/Fees'));

// Library Pages
const StudentLibrary = lazy(() => import('./pages/student/Library'));
const StudentMyBooks = lazy(() => import('./pages/student/MyBooks'));
const AdminLibrary = lazy(() => import('./pages/admin/Library'));

// LMS & Global Pages (Task 8)
const StudentStudyMaterial = lazy(() => import('./pages/student/StudyMaterial'));
const StudentBookmarks = lazy(() => import('./pages/student/Bookmarks'));
const TeacherUploadContent = lazy(() => import('./pages/teacher/UploadContent'));
const AdminContent = lazy(() => import('./pages/admin/Content'));
const SearchPage = lazy(() => import('./pages/Search'));
const NotificationsPage = lazy(() => import('./pages/Notifications'));

// Notice Board, AI Tutor, & Profile (Task 9)
const NoticeBoard = lazy(() => import('./pages/NoticeBoard'));
const CreateNotice = lazy(() => import('./pages/admin/CreateNotice'));
const AITutor = lazy(() => import('./pages/student/AITutor'));
const MyPerformance = lazy(() => import('./pages/student/MyPerformance'));
const Profile = lazy(() => import('./pages/student/Profile'));

// Admin User, Logs & Settings (Task 10)
const Users = lazy(() => import('./pages/admin/Users'));
const CreateUser = lazy(() => import('./pages/admin/CreateUser'));
const AuditLogs = lazy(() => import('./pages/admin/AuditLogs'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

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
      <ErrorBoundary>
        <Router>
          <Suspense fallback={
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
          }>
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

            {/* Exam Routes */}
            <Route
              path="/student/exams"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <Exams />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/hallticket"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <HallTicket />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/results"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <Results />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/exams"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminExams />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/exams/create"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <CreateExam />
                </ProtectedRoute>
              }
            />

            {/* Fee Routes */}
            <Route
              path="/student/fees"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentFees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/fees"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminFees />
                </ProtectedRoute>
              }
            />

            {/* Library Routes */}
            <Route
              path="/student/library"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentLibrary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/my-books"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentMyBooks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/library"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminLibrary />
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

            {/* Shared Realtime Notifications & Search */}
            <Route
              path="/notifications"
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']}>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']}>
                  <SearchPage />
                </ProtectedRoute>
              }
            />

            {/* LMS Study Content Routes */}
            <Route
              path="/student/study-material"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentStudyMaterial />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/bookmarks"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentBookmarks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/upload-content"
              element={
                <ProtectedRoute allowedRoles={['TEACHER']}>
                  <TeacherUploadContent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/content"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminContent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notice-board"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']}>
                  <NoticeBoard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/notices/create"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']}>
                  <CreateNotice />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/ai-tutor"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <AITutor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/performance"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <MyPerformance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Admin User, Logs, Settings Routes */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/create"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <CreateUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/logs"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AuditLogs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Root Redirect & Fallbacks */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  </ErrorBoundary>
</AuthProvider>
);
}

export default App;
