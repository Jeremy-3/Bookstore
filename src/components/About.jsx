import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { NavLink } from "react-router-dom";
const About = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      offset: 120,
    });
  }, []);
  return (
    <div className="about-page">
      {/* Header Section */}
      <header className="about-header">
        <div className="about-container">
          <h1 className="about-logo">Our Story</h1>
          <p className="tagline">Empowering Creativity, Inspiring Readers</p>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Mission Section */}
        <section className="mission-section">
          <div className="about-container">
            <h2>Our Mission</h2>
            <p>
              At <em>WebBookstore</em>, we believe in the transformative power of
              storytelling. Our mission is to provide a platform where authors
              can share their work with the world and readers can discover new
              voices.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section
          className="story-section"
          data-aos="fade-down"
          data-aos-duration="2000"
        >
          <div className="about-container">
            <div className="story-content">
              <div className="story-text">
                <h2>Our Journey</h2>
                <p>
                  Founded in 2023 by a group of passionate book lovers, WebBookstore started as a small project to support
                  independent authors. Today, we have grown into a thriving
                  community that connects readers and writers from around the
                  globe.
                </p>
              </div>
              <div className="story-image">
                <img
                  src="https://plus.unsplash.com/premium_photo-1661767467261-4a4bed92a507?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGVhbXxlbnwwfHwwfHx8MA%3D%3D"
                  alt="Our Team"
                  className="responsive-img"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section
          className="team-section"
          data-aos="fade-down"
          data-aos-duration="1000"
        >
          <div className="about-container">
            <h2>Meet the Team</h2>
            <div className="team-grid">
              {/* Team Member 1 */}
              <div className="team-member">
                <img
                  src="https://images.unsplash.com/photo-1745604472047-13bb1b5e6ea8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDMzfHRvd0paRnNrcEdnfHxlbnwwfHwwfHx8fA%3D%3D"
                  alt="Jane Doe"
                  className="member-avatar"
                />
                <h3>Jane Doe</h3>
                <p>Founder & CEO</p>
                <p className="bio">
                  A lifelong reader and advocate for independent authors, Jane
                  founded WebBookstore to create a space where
                  creativity thrives.
                </p>
              </div>

              {/* Team Member 2 */}
              <div className="team-member">
                <img
                  src="https://images.unsplash.com/photo-1745853707137-bde430b762aa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDI2fHRvd0paRnNrcEdnfHxlbnwwfHwwfHx8fA%3D%3D"
                  alt="John Smith"
                  className="member-avatar"
                />
                <h3>John Smith</h3>
                <p>Lead Developer</p>
                <p className="bio">
                  With a passion for technology and storytelling, John ensures
                  our platform is intuitive and user-friendly.
                </p>
              </div>

              {/* Team Member 3 */}
              <div className="team-member">
                <img
                  src="https://plus.unsplash.com/premium_photo-1664541336896-b3d5f7dec9a3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDV8dG93SlpGc2twR2d8fGVufDB8fHx8fA%3D%3D"
                  alt="Emily Johnson"
                  className="member-avatar"
                />
                <h3>Emily Johnson</h3>
                <p>Marketing Specialist</p>
                <p className="bio">
                  Emily helps authors reach their audience and grow their
                  readership through creative marketing strategies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <div className="about-container heartbeat">
            <h2>What Our Users Say</h2>
            <div className="testimonial-slider">
              {/* Testimonial 1 */}
              <div className="testimonial">
                <p className="quote">
                  "Thanks to WebBookstore, I published my first novel
                  and gained thousands of readers!"
                </p>
                <p className="author">— Sarah L., Author</p>
              </div>

              {/* Testimonial 2 */}
              <div className="testimonial heartbeat">
                <p className="quote">
                  "This platform has transformed the way I discover books."
                </p>
                <p className="author">— Mark T., Reader</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="cta-section">
          <div className="about-container">
            <h2>Join Our Community</h2>
            <p>
              Whether you're an author or a reader, we invite you to be part of
              our growing community.
            </p>
            <NavLink to="/signup" className="cta-button vibrate-1">
              Get Started
            </NavLink>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="about-container">
          <p>&copy; 2023 WebBookstore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
