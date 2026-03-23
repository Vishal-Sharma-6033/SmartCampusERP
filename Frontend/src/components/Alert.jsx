const Alert = ({ type = 'error', message }) => {
  if (!message) return null

  return <p className={`alert ${type}`.trim()}>{message}</p>
}

export default Alert
