import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import InputField from '../components/InputField.jsx'
import Alert from '../components/Alert.jsx'
import useAuth from '../hooks/useAuth.js'
import { getApiErrorMessage } from '../utils/error.js'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login, setTenantId } = useAuth()

  const [form, setForm] = useState({
    tenantId: '',
    email: '',
    password: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      setTenantId(form.tenantId)
      await login(form)
      navigate('/')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Login failed'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <Card title="Welcome Back" subtitle="Sign in to your SmartCampus workspace">
        <form className="form-grid" onSubmit={onSubmit}>
          <InputField
            label="Tenant ID"
            name="tenantId"
            value={form.tenantId}
            onChange={onChange}
            required
            placeholder="Mongo Tenant ObjectId"
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
            placeholder="Your password"
          />

          <Alert message={error} />

          <Button type="submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Login'}
          </Button>

          <p className="auth-switch">
            Need an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </Card>
    </div>
  )
}

export default LoginPage
