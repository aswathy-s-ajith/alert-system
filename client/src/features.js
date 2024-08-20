import React from 'react'

function Features() {
  return (
    <section className="features-section">
    <h2 className="section-title">Key Features</h2>
    <div className="features-grid">
      <div className="feature-card">
        <i className="fas fa-bolt feature-icon"></i>
        <h3>Real-Time Detection</h3>
        <p>Instant identification of incidents as they occur.</p>
      </div>
      <div className="feature-card">
        <i className="fas fa-bell feature-icon"></i>
        <h3>Instant Alerts</h3>
        <p>Instant Web Push Notifications for Subscribers .</p>
      </div>
      <div className="feature-card">
        <i className="fas fa-chart-line feature-icon"></i>
        <h3>Detailed Reporting</h3>
        <p>Comprehensive data reports on detected incidents.</p>
      </div>
    </div>
  </section>
  )
}

export default Features