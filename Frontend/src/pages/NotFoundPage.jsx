import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="centered-page">
      <h2>404</h2>
      <p>Page not found.</p>
      <Link to="/">Back to dashboard</Link>
    </div>
  )
}

export default NotFoundPage
