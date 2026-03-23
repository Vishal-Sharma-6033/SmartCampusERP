const Card = ({ title, subtitle, actions, children }) => {
  return (
    <section className="card">
      {(title || subtitle || actions) && (
        <header className="card-header">
          <div>
            {title ? <h3>{title}</h3> : null}
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          {actions ? <div className="card-actions">{actions}</div> : null}
        </header>
      )}
      <div className="card-body">{children}</div>
    </section>
  )
}

export default Card
