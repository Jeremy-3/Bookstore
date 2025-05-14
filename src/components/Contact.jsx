import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "", 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting feedback:", formData);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), 
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit feedback.");
      }

      alert("Feedback submitted successfully!");
      setFormData({ name: "", email: "", message: "" }); 
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert(`Error: ${err.message}`);
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      offset: 120,
    });
  }, []);

  return (
    <div>
      {/* Header */}
      <header className="cont-header">
        <div className="cont-container">
          <h1 className="cont-logo">Contact Us</h1>
          <p className="cont-tagline">We'd love to hear from you!</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="contact-page">
        {/* Feedback Form */}
        <section
          className="contact-form-section"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <div className="cont-container">
            <h2>Send Us a Message</h2>
            <form id="contact-form" className="contact-form" onSubmit={handleSubmit}>
              {/* Name Field */}
              <label className="cont-form-label">
                Your Name:
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  required
                  className="form-input"
                  onChange={handleChange}
                  value={formData.name}
                />
              </label>

              {/* Email Field */}
              <label className="cont-form-label">
                Your Email:
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  className="form-input"
                  onChange={handleChange}
                  value={formData.email}
                />
              </label>

              {/* Subject Field (Commented Out Temporarily) */}
              {/* <label className="cont-form-label">
                Subject:
                <input
                  type="text"
                  name="subject"
                  placeholder="Enter the subject"
                  required
                  className="form-input"
                  onChange={handleChange}
                  value={formData.subject}
                />
              </label> */}

              {/* Message Field */}
              <label className="cont-form-label">
                Message:
                <textarea
                  name="message"
                  placeholder="Write your message here"
                  required
                  className="form-textarea"
                  onChange={handleChange}
                  value={formData.message}
                ></textarea>
              </label>

              {/* Submit Button */}
              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </section>

        {/* Admin Contact Section */}
        <section
          className="admin-contact-section"
          data-aos="fade-left"
          data-aos-duration="1000"
        >
          <div className="cont-container">
            <h2>Contact the Admin</h2>
            <div className="contact-info">
              <p>
                <strong>Email:</strong> jamy@pokemail.net
              </p>
              <p>
                <strong>Phone:</strong> +123 456 7890
              </p>
              <p>
                <strong>Office Hours:</strong> 9:00 AM - 5:00 PM (Mon-Fri)
              </p>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section
          className="map-section"
          data-aos="zoom-in"
          data-aos-duration="1000"
        >
          <div className="cont-container">
            <h2>Find Us on the Map</h2>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.671512353371!2d-73.99400068458748!3d40.75001297932771!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e1c0a44c067!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1682974550356!5m2!1sen!2sus"
                width="100%"
                height="400"
                style={{ border: "0" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="cont-footer">
        <div className="cont-container">
          <p>&copy; 2023 WebBookstore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;