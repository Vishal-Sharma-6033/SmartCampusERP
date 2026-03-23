import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import InputField from '../components/InputField.jsx'
import Alert from '../components/Alert.jsx'
import useAuth from '../hooks/useAuth.js'
import { getApiErrorMessage } from '../utils/error.js'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      })
      setSuccess('Registration successful. Please login.')
      setTimeout(() => navigate('/login'), 800)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Registration failed'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <Card title="Create Account" subtitle="Create your SmartCampus account">
        <form className="form-grid" onSubmit={onSubmit}>
          <InputField
            label="Full Name"
            name="name"
            value={form.name}
            onChange={onChange}
            required
            placeholder="John Doe"
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
            placeholder="you@campus.edu"
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            required
            placeholder="Set a strong password"
          />

          <label className="field">
            <span>Role</span>
            <select name="role" value={form.role} onChange={onChange}>
              <option value="STUDENT">STUDENT</option>
              <option value="TEACHER">TEACHER</option>
              <option value="PARENT">PARENT</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>

          <Alert message={error} />
          <Alert type="success" message={success} />

          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Register'}
          </Button>

          <p className="auth-switch">
            Already registered? <Link to="/login">Login</Link>
          </p>
        </form>
      </Card>
    </div>
  )
}

export default RegisterPage
