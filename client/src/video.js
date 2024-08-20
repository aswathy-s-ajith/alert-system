import React from 'react'

function Video() {
  return (
    <section className="video-section">
        <div className="left-column">
          <div className="video-container">
            <iframe
              className="responsive-iframe"
              src="https://www.youtube.com/embed/kA3q7thOQ68"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        <div className="right-column">
          <h3 className='section-title'>About the System</h3>
          <div className='info'>
           <p>
           Our system leverages cutting-edge computer vision and AI-driven analytics to detect animals and accidents in real-time, ensuring prompt alerts and responses. Seamlessly integrating with existing systems, it enhances road safety and reduces collision risks, offering scalable solutions for both urban and remote environments. With instant notifications and 24/7 monitoring, authorities and drivers are equipped with the tools needed for quick accident prevention. Additionally, the system protects wildlife by minimizing animal-vehicle collisions, all through a user-friendly interface that provides real-time alerts and detailed reports. Designed to be cost-effective and future-proof, it evolves with AI advancements to continuously improve road safety.
           </p>
           <p>
            Watch the video to see how it works and the impact it can have on road safety and wildlife preservation.
           </p>
          </div>
        </div>
      </section>
  )
};

export default Video;