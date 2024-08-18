import React from 'react';
import './landingpage.css';
import Hero from './hero.js';
import Video from './video.js';
import Features from './features.js';
import Contact from './contact.js';

function Landingpage() {
  return (
    <div className="landing-container">
      <Hero></Hero>
      <Video></Video>
      <Features></Features> 
      <Contact></Contact>
    </div>
  );
}

export default Landingpage;
