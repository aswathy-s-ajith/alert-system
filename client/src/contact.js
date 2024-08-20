import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

function Contact() {
  const [fullname, setFullname] = useState('');
  const [emailid, setEmailid] = useState('');
  const [message, setMessage] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();

    const serviceId = 'service_199vne7';
    const templateId = 'template_i272ivw';
    const userId = 'dvpy4HwSXrz0wWyTh';

    const templateParams = {
      from_name: fullname,
      to_name: 'Recipient Name', // Replace with recipient's name
      from_email: emailid,
      message: message
    };

    emailjs.send(serviceId, templateId, templateParams, userId)
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        // Handle success, e.g., show a success message
        setFullname(''); // clear fullname
        setEmailid(''); // clear emailid
        setMessage(''); // clear message
      })
      .catch((error) => {
        console.error('FAILED...', error);
        // Handle error, e.g., show an error message
      });
  };

  return (
    <form className="contact-form" onSubmit={sendEmail}>
      <h2 className="section-title">Get in Touch</h2>
      <input
        type="text"
        id="fullname"
        placeholder="Your Name"
        className="form-input"
        value={fullname}
        onChange={(e) => setFullname(e.target.value)}
      />
      <input
        type="email"
        id="emailid"
        placeholder="Your Email"
        className="form-input"
        value={emailid}
        onChange={(e) => setEmailid(e.target.value)}
      />
      <textarea
        placeholder="Your Message"
        id="message"
        className="form-textarea"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        className="cta-button"
      >Submit
      </button>
    </form>
  );
}

export default Contact;