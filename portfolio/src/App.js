import React, { useState } from 'react';
import styles from './App.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import modernNotepadImg from './assets/06_343bfe50-4825-4d04-85ae-1ada79c135f7_1800x1800.webp';
import expenseTrackerImg from './assets/How-To-Make-A-Budget.jpg';

// Updated skills list
const skills = ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Python', 'MySQL', 'AI/ML', 'Java', 'SQL', 'UI/UX', 'PHP', 'C', 'C++'];

// Updated project data with links and imported images
const projects = [
  { id: 1, title: 'Modern Notepad', description: 'A feature-rich web-based notepad with user authentication and rich text editing, built with PHP and MySQL.', link: 'https://github.com/lokesh89991/Modern-Notepad', image: modernNotepadImg },
  { id: 2, title: 'Expense Tracker', description: 'A PHP application to track income and expenses, helping users manage their personal finances effectively.', link: 'https://github.com/lokesh89991/Expense-Tracker', image: expenseTrackerImg },
];

const githubProfile = {
  id: 'github',
  title: 'Explore More on GitHub',
  description: 'See all my repositories, contributions, and coding activity on my GitHub profile.',
  link: 'https://github.com/lokesh89991',
}

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const Modal = ({ project, closeModal }) => {
  if (!project) return null;

  return (
    <motion.div 
      className={styles.modalBackdrop}
      onClick={closeModal}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }}
        exit={{ scale: 0.8, y: 50, opacity: 0 }}
      >
        <img src={project.image} alt={project.title} className={styles.modalImage} />
        <h2>{project.title}</h2>
        <p>{project.description}</p>
        <a href={project.link} target="_blank" rel="noopener noreferrer" className={`${styles.btn} ${styles.btnPrimary}`}>
          View on GitHub
        </a>
        <button onClick={closeModal} className={styles.closeModalBtn}>&times;</button>
      </motion.div>
    </motion.div>
  );
};

function App() {
  const [selectedProject, setSelectedProject] = useState(null);

  const openModal = (project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  return (
    <div className={styles.app}>
      <motion.header 
        className={styles.header}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.logo}>Sai Lokesh</div>
        <nav className={styles.nav}>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="https://drive.google.com/file/d/11BtaxOTgGCtj_6HO60Z1WtzCqOOlzA3I/view?usp=drive_link" target="_blank" rel="noopener noreferrer">Resume</a>
          <a href="#contact">Contact</a>
        </nav>
      </motion.header>

      <main>
        <section id="home" className={styles.hero}>
          <motion.div 
            className={styles.heroContent}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h1>Welcome to My Portfolio</h1>
            <p>I'm a Full Stack Developer</p>
            <div className={styles.heroButtons}>
              <a href="#projects" className={`${styles.btn} ${styles.btnPrimary}`}>View My Work</a>
              <a href="#contact" className={`${styles.btn} ${styles.btnSecondary}`}>Contact Me</a>
            </div>
          </motion.div>
        </section>

        <motion.section 
          id="about" 
          className={styles.about}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          <h2>About Me</h2>
          <div className={styles.aboutContent}>
            <div className={styles.aboutText}>
              <p>Hello! I'm Sai Lokesh, a final-year B.Tech student specializing in Information Technology. I have a strong interest in Full Stack Development and enjoy crafting clean, responsive, and user-friendly web interfaces using technologies like HTML, CSS, JavaScript, and React.</p>
              <p>In addition to web development, I'm also exploring the world of Artificial Intelligence. I've worked with various AI tools and have a growing interest in how machine learning can solve real-world challenges.</p>
              <h3>Skills</h3>
              <div className={styles.skills}>
                {skills.map((skill, index) => 
                  <motion.span 
                    key={skill} 
                    className={styles.skillTag}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.5 }}
                    variants={{ visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.05 } }}}
                  >
                    {skill}
                  </motion.span>
                )}
              </div>
            </div>
            <div className={styles.aboutImage}>
              {/* Add your image here. For now, it's a placeholder. */}
              <div className={styles.imagePlaceholder}></div>
            </div>
          </div>
        </motion.section>

        <motion.section 
          id="projects" 
          className={styles.projects}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          <h2>My Projects</h2>
          <div className={styles.projectsGrid}>
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                onClick={() => openModal(project)}
                className={styles.projectCard}
                custom={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView="visible"
                viewport={{ once: false, amount: 0.5 }}
                whileHover={{ scale: 1.05, y: -10 }}
                variants={{
                  visible: i => ({
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: i * 0.2,
                    },
                  }),
                }}
              >
                {project.image && <img src={project.image} alt={project.title} className={styles.projectImage} />}
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </motion.div>
            ))}
             <motion.a 
                key={githubProfile.id}
                href={githubProfile.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.projectCard} ${styles.githubCard}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0, transition: { delay: projects.length * 0.2 } }}
                whileHover={{ scale: 1.05, y: -10 }}
                viewport={{ once: false, amount: 0.5 }}
              >
                <h3>{githubProfile.title}</h3>
                <p>{githubProfile.description}</p>
              </motion.a>
          </div>
        </motion.section>

        <motion.section 
          id="contact" 
          className={styles.contact}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          <h2>Contact</h2>
          <div className={styles.contactContent}>
            <div className={styles.contactInfo}>
              <p><strong>Email:</strong> sailokeshpandu0@gmail.com</p>
              <p><strong>Phone:</strong> 8978300477</p>
            </div>
            <form name="contact" method="POST" data-netlify="true" className={styles.contactForm}>
              <input type="hidden" name="form-name" value="contact" />
              <input type="text" name="name" placeholder="Your Name" required />
              <input type="email" name="email" placeholder="Your Email" required />
              <textarea name="message" placeholder="Your Message" rows="5" required></textarea>
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Send Message</button>
            </form>
          </div>
        </motion.section>
      </main>

      <AnimatePresence>
        {selectedProject && <Modal project={selectedProject} closeModal={closeModal} />}
      </AnimatePresence>

       <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Sai Lokesh. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
