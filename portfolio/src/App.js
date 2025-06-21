import React from 'react';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.app}>
      {/* Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>Sai Lokesh</div>
        <ul className={styles.navLinks}>
          <li><a href="#hero">Home</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="https://drive.google.com/file/d/11BtaxOTgGCtj_6HO60Z1WtzCqOOlzA3I/view?usp=drive_link" target="_blank" rel="noopener noreferrer">Resume</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
      {/* Hero Section */}
      <section id="hero" className={styles.heroSection}>
        <div className={styles.heroText}>
          <h1>Hi, I'm Sai Lokesh</h1>
          <div className={styles.aboutBio}>
            <p>Hello! I'm Sai Lokesh, a final-year B.Tech student specializing in Information Technology. I have a strong interest in Full Stack Development and enjoy crafting clean, responsive, and user-friendly web interfaces using technologies like HTML, CSS, JavaScript, and React.</p>
            <p style={{marginTop: '1em'}}>In addition to web development, I'm also exploring the world of Artificial Intelligence. I've worked with various AI tools and have a growing interest in how machine learning can solve real-world challenges.</p>
            <p style={{marginTop: '1em'}}>I'm a quick learner, always curious, and love taking on new challenges. Whether it's building a dynamic website or experimenting with an AI project, I'm passionate about creating digital experiences that are both functional and impactful.</p>
            <p style={{marginTop: '1em'}}>Outside of coding, I enjoy learning new technologies, participating in hackathons, and collaborating on innovative ideas. I'm actively seeking opportunities to grow as a developer and contribute to meaningful tech-driven projects.</p>
          </div>
        </div>
        <div className={styles.heroImage}>
          {/* Add your image here */}
        </div>
      </section>
      {/* Projects Section */}
      <section id="projects" className={styles.projectsSection}>
        <h2>Projects</h2>
        <div className={styles.projectsGrid}>
          <p>For a detailed look at my work and contributions, please visit my GitHub profile linked below.</p>
          <a 
            href="https://github.com/lokesh89991"
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.projectLink}
          >
            See My Projects on GitHub
          </a>
        </div>
      </section>
      {/* Contact Section */}
      <section id="contact" className={styles.contactSection}>
        <h2>Contact</h2>
        <p>Email: your.email@example.com</p>
        <p>Phone: 8978300477</p>
      </section>
      {/* Footer */}
      <footer className={styles.footer}>
        <span>&copy; {new Date().getFullYear()} Sai Lokesh</span>
      </footer>
    </div>
  );
}

export default App;
