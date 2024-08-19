import React from 'react'

function Contact() {
  return (
    <section className="contact-section">
     <h2 className="section-title">Get in Touch</h2>
     <form className="contact-form">
      <input type="text" placeholder="Your Name" className="form-input" />
      <input type="email" placeholder="Your Email" className="form-input" />
      <textarea placeholder="Your Message" className="form-textarea"></textarea>
      <button type="submit" className="cta-button">Send Message</button>
     </form>
   </section>
  )
}

export default Contact
