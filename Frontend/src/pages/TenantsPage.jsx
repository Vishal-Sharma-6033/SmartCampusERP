import { useState } from 'react'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import InputField from '../components/InputField.jsx'
import Alert from '../components/Alert.jsx'
import { createTenant } from '../services/tenant.service.js'
import { getApiErrorMessage } from '../utils/error.js'

const TenantsPage = () => {
  const [name, setName] = useState('')
  const [status, setStatus] = useState('ACTIVE')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [latestTenant, setLatestTenant] = useState(null)

  const onSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const response = await createTenant({ name, status })
      setLatestTenant(response?.data || null)
      setName('')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to create tenant'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="stack-gap">
      <Card title="Tenant Management" subtitle="Create new tenant workspaces">
        <form className="form-grid" onSubmit={onSubmit}>
          <InputField
            label="Tenant Name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Engineering Campus"
            required
          />

          <label className="field">
            <span>Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </label>

          <Alert message={error} />

          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Tenant'}
          </Button>
        </form>
      </Card>

      {latestTenant ? (
        <Card title="Last Created Tenant" subtitle="Use this ID for login/register tenant field">
          <div className="inline-kv">
            <span>Name</span>
            <strong>{latestTenant.name}</strong>
          </div>
          <div className="inline-kv">
            <span>Status</span>
            <strong>{latestTenant.status}</strong>
          </div>
          <div className="inline-kv">
            <span>Tenant ID</span>
            <strong>{latestTenant._id}</strong>
          </div>
        </Card>
      ) : null}
    </section>
  )
}

export default TenantsPage
