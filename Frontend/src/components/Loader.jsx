const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="loader-wrap" role="status" aria-live="polite">
      <span className="loader-dot" />
      <span>{text}</span>
    </div>
  )
}

export default Loader
