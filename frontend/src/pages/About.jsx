import React from 'react';
import '../styles/About.css'; // Import your CSS file for styling

const About = () => {
  return (
    <div className="about-page">
      <section className="about-header">
        <h1>About AgriCircle</h1>
        <p>Your one-stop solution for efficient farming equipment sharing and rental.</p>
      </section>
      <section className="about-content">
        <div>
          <h2>Our Mission</h2>
          <p>
            At AgriCircle, our mission is to empower local farmers by providing a platform that simplifies 
            the process of renting and sharing farming equipment. We aim to reduce operational costs and 
            increase resource utilization in rural communities, fostering sustainable agriculture.
          </p>
        </div>

        <div>
          <h2>Our Vision</h2>
          <p>
            We envision a world where every farmer has access to the tools and resources they need to 
            maximize their productivity and profitability. Our platform is designed to be scalable and 
            adaptable, ensuring that it meets the needs of diverse agricultural practices across various 
            regions.
          </p>
        </div>
       
        <div>
          <h2>How It Works</h2>
          <p>
            AgriCircle connects farmers with equipment owners through a user-friendly portal. Farmers can 
            browse available equipment, check its availability, and make reservations online. Equipment 
            owners can list their tools, set rental prices, and manage bookings easily. Our system ensures 
            transparency, security, and reliability in every transaction.
          </p>
        </div>

        <div>
          <h2>Join Us</h2>
          <p>
            Be a part of the AgriCircle community today! Sign up to start renting or listing equipment, and 
            contribute to a more efficient and sustainable agricultural industry.
          </p>
        </div>

      </section>
    </div>
  );
};

export default About;
