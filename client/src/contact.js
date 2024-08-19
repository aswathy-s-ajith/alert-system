import React, { useState } from 'react';
import emailjs from '@emailjs/browser';


function sendEmail(e) {
  e.preventDefault();

  const serviceId = 'service_199vne7';
  const templateId = 'template_i272ivw';
  const userId = 'dvpy4HwSXrz0wWyTh';

  const templateParams = {
    from_name: e.target.fullname.value,
    to_name: 'Recipient Name', // Replace with recipient's name
    from_email: e.target.emailid.value,
    message: e.target.message.value
  };

  emailjs.send(serviceId, templateId, templateParams, userId)
    .then((response) => {
      console.log('SUCCESS!', response.status, response.text);
      // Handle success, e.g., show a success message
    })
    .catch((error) => {
      console.error('FAILED...', error);
      // Handle error, e.g., show an error message
    });
}

function Contact() {
  return (
   
    <form className="contact-form" onSubmit={sendEmail}>
        <h2 className="section-title">Get in Touch</h2>
          <input
            type="text"
            id="fullname"
            placeholder="Your Name"
            className="form-input"
    
          />
          <input
            type="email"
            id="emailid"
            placeholder="Your Email"
            className="form-input"

          />
          <textarea
            placeholder="Your Message"
            id="message"
            className="form-textarea"
           
          />
          <button
            type="submit"
            className="cta-button"
          >Submit
          </button>
    
        </form>
   
    );
  };
  
  export default Contact;
