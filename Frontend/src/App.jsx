
import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PublicOnlyRoute from './components/PublicOnlyRoute.jsx'
import RoleGate from './components/RoleGate.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import UsersPage from './pages/UsersPage.jsx'
import TenantsPage from './pages/TenantsPage.jsx'
import SubjectsPage from './pages/SubjectsPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import { ROLES } from './utils/constants.js'

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route
          path="/users"
          element={
            <RoleGate allow={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
              <UsersPage />
            </RoleGate>
          }
        />
        <Route
          path="/tenants"
          element={
            <RoleGate allow={[ROLES.SUPER_ADMIN]}>
              <TenantsPage />
            </RoleGate>
          }
        />
        <Route path="/subjects" element={<SubjectsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
