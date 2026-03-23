import { useEffect, useMemo, useState } from 'react'
import Card from '../components/Card.jsx'
import Loader from '../components/Loader.jsx'
import useAuth from '../hooks/useAuth.js'
import { getUsers } from '../services/user.service.js'
import { getSubjects } from '../services/academic.service.js'
import { getApiErrorMessage } from '../utils/error.js'

const DashboardPage = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [usersCount, setUsersCount] = useState(0)
  const [subjectsCount, setSubjectsCount] = useState(0)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')

      try {
        const [usersRes, subjectsRes] = await Promise.allSettled([getUsers(), getSubjects()])

        if (usersRes.status === 'fulfilled') {
          const usersData = usersRes.value?.data
          const users = Array.isArray(usersData?.users) ? usersData.users : Array.isArray(usersData) ? usersData : []
          setUsersCount(users.length)
        }

        if (subjectsRes.status === 'fulfilled') {
          const subjects = Array.isArray(subjectsRes.value?.data) ? subjectsRes.value.data : []
          setSubjectsCount(subjects.length)
        }
      } catch (err) {
        setError(getApiErrorMessage(err, 'Unable to load dashboard metrics'))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

  if (loading) return <Loader text="Loading dashboard..." />

  return (
    <section className="stack-gap">
      <Card>
        <h2 className="page-title">{greeting}, {user?.name || 'User'}</h2>
        <p className="muted">A fast overview of your SmartCampus workspace.</p>
      </Card>

      {error ? <p className="alert error">{error}</p> : null}

      <div className="metrics-grid">
        <Card title="Users" subtitle="Visible from your role">
          <p className="metric-value">{usersCount}</p>
        </Card>
        <Card title="Subjects" subtitle="Academic module">
          <p className="metric-value">{subjectsCount}</p>
        </Card>
        <Card title="Current Role" subtitle="Access scope">
          <p className="metric-value role">{user?.role || 'UNKNOWN'}</p>
        </Card>
      </div>
    </section>
  )
}

export default DashboardPage
