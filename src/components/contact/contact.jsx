import React, { useState } from "react";
import illustration from "./contact-illustration.png";
import "./contact.css";
import { send } from "emailjs-com";

const ContactPage = () => {
  const initialToSendState = {
    full_name: "",
    email: "",
    message: "",
  };

  const [toSend, setToSend] = useState(initialToSendState);

  function sendMessage(event) {
    event.preventDefault();

    const serviceId = "service_jvegt0o";
    const templateId = "template_9cdjfd3";
    const userId = "DThCKNwGgXXDM_TXg";

    send(serviceId, templateId, toSend, userId);
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
    <div className="main">
      <div className="header">Contact Our Support Team</div>
      <div className="container">

      <div className="illustration">
        <img src={illustration} alt="Contact illustration" />
      </div>

      <div className="form-container">

        <form onSubmit={sendMessage}>
        <label htmlFor="full_name">Name: *</label>

          <input
            type="text"
            name="full_name"
            placeholder="John Doe"
            value={toSend.full_name}
            onChange={update}
            required
          />
          <label htmlFor="message">Message: *</label>
          <textarea rows="7" cols="50"
            name="message"
            placeholder="Describe your issue/Question"
            value={toSend.message}
            onChange={update}
            required
          />
          <label htmlFor="email">Email: *</label>

          <input
            type="text"
            name="email"
            placeholder="john.doe@gmail.com"
            value={toSend.email}
            onChange={update}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      </div>
    </div>
  );
};
export default ContactPage;
