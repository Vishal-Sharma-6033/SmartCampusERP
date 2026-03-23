import { useEffect, useMemo, useState } from 'react'
import Alert from '../components/Alert.jsx'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import InputField from '../components/InputField.jsx'
import Loader from '../components/Loader.jsx'
import useAuth from '../hooks/useAuth.js'
import {
  createUser,
  deleteUser,
  getUsers,
  linkParentToStudent,
  updateUser,
} from '../services/user.service.js'
import { getApiErrorMessage } from '../utils/error.js'

const defaultCreate = {
  name: '',
  email: '',
  password: '',
  role: 'STUDENT',
}

const UsersPage = () => {
  const { user: currentUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [createForm, setCreateForm] = useState(defaultCreate)
  const [linkForm, setLinkForm] = useState({ parentId: '', studentId: '' })
  const [editingId, setEditingId] = useState('')
  const [editingRole, setEditingRole] = useState('STUDENT')

  const loadUsers = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await getUsers()
      const payload = response?.data
      const nextUsers = Array.isArray(payload?.users)
        ? payload.users
        : Array.isArray(payload)
          ? payload
          : []
      setUsers(nextUsers)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to fetch users'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const countsByRole = useMemo(() => {
    return users.reduce((acc, item) => {
      const role = item.role || 'UNKNOWN'
      acc[role] = (acc[role] || 0) + 1
      return acc
    }, {})
  }, [users])

  const onCreate = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      await createUser(createForm)
      setCreateForm(defaultCreate)
      setSuccess('User created successfully')
      await loadUsers()
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to create user'))
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (id) => {
    setError('')
    setSuccess('')

    try {
      await deleteUser(id)
      setSuccess('User removed')
      await loadUsers()
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to delete user'))
    }
  }

  const onRoleUpdate = async (id) => {
    setError('')
    setSuccess('')

    try {
      await updateUser(id, { role: editingRole })
      setEditingId('')
      setSuccess('User role updated')
      await loadUsers()
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to update role'))
    }
  }

  const onLinkParent = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    try {
      await linkParentToStudent(linkForm)
      setLinkForm({ parentId: '', studentId: '' })
      setSuccess('Parent linked to student')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to link parent'))
    }
  }

  if (loading) return <Loader text="Loading users..." />

  return (
    <section className="stack-gap">
      <Card title="User Management" subtitle={`Current operator: ${currentUser?.role || 'UNKNOWN'}`}>
        <Alert message={error} />
        <Alert type="success" message={success} />

        <div className="chips-row">
          {Object.keys(countsByRole).map((role) => (
            <span key={role} className="chip">
              {role}: {countsByRole[role]}
            </span>
          ))}
        </div>
      </Card>

      <Card title="Create User">
        <form className="form-grid cols-4" onSubmit={onCreate}>
          <InputField
            label="Name"
            name="name"
            value={createForm.name}
            onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={createForm.email}
            onChange={(event) => setCreateForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            value={createForm.password}
            onChange={(event) => setCreateForm((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
          <label className="field">
            <span>Role</span>
            <select
              value={createForm.role}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, role: event.target.value }))}
            >
              <option value="STUDENT">STUDENT</option>
              <option value="TEACHER">TEACHER</option>
              <option value="PARENT">PARENT</option>
              <option value="ADMIN">ADMIN</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            </select>
          </label>

          <Button type="submit" disabled={saving}>
            {saving ? 'Creating...' : 'Create User'}
          </Button>
        </form>
      </Card>

      <Card title="All Users">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>
                    {editingId === item._id ? (
                      <select value={editingRole} onChange={(event) => setEditingRole(event.target.value)}>
                        <option value="STUDENT">STUDENT</option>
                        <option value="TEACHER">TEACHER</option>
                        <option value="PARENT">PARENT</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      </select>
                    ) : (
                      item.role
                    )}
                  </td>
                  <td className="row-actions">
                    {editingId === item._id ? (
                      <>
                        <Button variant="secondary" onClick={() => onRoleUpdate(item._id)}>
                          Save Role
                        </Button>
                        <Button variant="muted" onClick={() => setEditingId('')}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setEditingId(item._id)
                            setEditingRole(item.role)
                          }}
                        >
                          Edit Role
                        </Button>
                        <Button variant="danger" onClick={() => onDelete(item._id)}>
                          Delete
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Link Parent To Student" subtitle="Admin-only backend action">
        <form className="form-grid cols-3" onSubmit={onLinkParent}>
          <InputField
            label="Parent User ID"
            name="parentId"
            value={linkForm.parentId}
            onChange={(event) => setLinkForm((prev) => ({ ...prev, parentId: event.target.value }))}
            required
          />
          <InputField
            label="Student User ID"
            name="studentId"
            value={linkForm.studentId}
            onChange={(event) => setLinkForm((prev) => ({ ...prev, studentId: event.target.value }))}
            required
          />

          <Button type="submit">Link</Button>
        </form>
      </Card>
    </section>
  )
}

export default UsersPage
