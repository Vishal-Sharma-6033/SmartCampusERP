import { Link, NavLink, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'
import { ROLES } from '../utils/constants.js'

const AppShell = () => {
  const { user, logout, tenantId, hasRole } = useAuth()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="brand">SmartCampus ERP</Link>
        <nav>
          <NavLink to="/">Dashboard</NavLink>
          {hasRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]) ? <NavLink to="/users">Users</NavLink> : null}
          {hasRole([ROLES.SUPER_ADMIN]) ? <NavLink to="/tenants">Tenants</NavLink> : null}
          <NavLink to="/subjects">Academic</NavLink>
        </nav>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <div className="topbar-main">
            <h1>Campus Workspace</h1>
            <p>
              Signed in as <strong>{user?.name || 'Unknown user'}</strong> ({user?.role || 'No role'})
            </p>
          </div>

          <div className="topbar-actions">
            <input className="quick-search" type="search" placeholder="Search" aria-label="Search" />
            <span className="tenant-pill">Tenant: {tenantId || 'Not set'}</span>
            <button className="btn btn-muted" type="button" onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppShell
