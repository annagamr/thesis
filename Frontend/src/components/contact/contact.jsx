import React, { useState } from "react";
import "./contact.css";
import { send } from "emailjs-com";
import * as images from "../../assets/assets";

const ContactPage = () => {
  const initialToSendState = {
    full_name: "",
    email: "",
    message: "",
  };

  const [toSend, setToSend] = useState(initialToSendState);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function sendMessage(event) {
    event.preventDefault();

    const serviceId = "service_jvegt0o";
    const templateId = "template_9cdjfd3";
    const userId = "DThCKNwGgXXDM_TXg";

    send(serviceId, templateId, toSend, userId)
      .then(() => {
        setIsSubmitted(true);
        setToSend(initialToSendState);
      })
      .catch((error) => {
        console.error("Failed to send message", error);
        setIsSubmitted(false);
      });
  }

  function update(event) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    setToSend((prevState) => {
      const updatedToSend = {
        ...prevState,
        [fieldName]: fieldValue,
      };
      return updatedToSend;
    });
  }

  return (
    <div className="contact-page">
      <div className="main">
        <div className="header">CONTACT US</div>
        <div className="container">
          <div className="illustration">
            <img src={images.contact} alt="Contact illustration" />
          </div>

          <div className="form-container">
            {!isSubmitted && (
              <form onSubmit={sendMessage}>
                <label htmlFor="full_name">Name: *</label>
                <input
                  id="full_name"
                  type="text"
                  name="full_name"
                  placeholder="John Doe"
                  value={toSend.full_name}
                  onChange={update}
                  required
                />
                <label htmlFor="message">Message: *</label>
                <textarea
                  id="message"
                  rows="7"
                  cols="50"
                  name="message"
                  placeholder="Describe your issue/Question"
                  value={toSend.message}
                  onChange={update}
                  required
                />
                <label htmlFor="email">Email: *</label>
                <input
                  id="email"
                  type="text"
                  name="email"
                  placeholder="john.doe@gmail.com"
                  value={toSend.email}
                  onChange={update}
                  required
                />{" "}
                <button type="submit">Submit</button>
              </form>
            )}
            {isSubmitted && (
              <div className="success-message" data-testid="success">
                Submitted successfully! We will get back to you soon.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ContactPage;
