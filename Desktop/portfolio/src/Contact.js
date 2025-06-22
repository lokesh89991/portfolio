import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import styles from "./App.module.css";

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "portfolio",         // Service ID
        "template_1peq7nd",  // Template ID
        form.current,
        "YQMq_Af1fUcQJZgB3"  // Public Key
      )
      .then(
        (result) => {
          alert("Message sent successfully!");
          form.current.reset();
        },
        (error) => {
          alert("Failed to send message. Please try again.");
        }
      );
  };

  return (
    <>
      <h2>Contact</h2>
      <div className={styles.contactContent}>
        <div className={styles.contactInfo}>
          <p><strong>Email:</strong> sailokeshpandu0@gmail.com</p>
          <p><strong>Phone:</strong> 8978300477</p>
        </div>
        <form ref={form} onSubmit={sendEmail} className={styles.contactForm}>
          <input type="text" name="user_name" placeholder="Your Name" required />
          <input type="email" name="user_email" placeholder="Your Email" required />
          <textarea name="message" placeholder="Your Message" required />
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Send</button>
        </form>
      </div>
    </>
  );
};

export default Contact; 