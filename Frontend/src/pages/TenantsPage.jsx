import Card from '../components/Card.jsx'
import Alert from '../components/Alert.jsx'

const TenantsPage = () => {
  return (
    <section className="stack-gap">
      <Card title="Tenant Management" subtitle="Tenant creation is currently unavailable">
        <Alert message="Tenant APIs are disabled in backend right now. This screen is read-only until tenant routes are re-enabled." />
      </Card>
    </section>
  )
}

export default TenantsPage
