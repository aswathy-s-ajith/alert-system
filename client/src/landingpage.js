// landingpage.js
import React from 'react';
import './landingpage.css';
import Hero from './hero';
import Video from './video';
import Features from './features';
import Contact from './contact';

function Landingpage() {
  return (
    <div className="landing-container">
      <Hero />
      <Video />
      <Features />
      <Contact />
    </div>
  );
}

export default Landingpage;