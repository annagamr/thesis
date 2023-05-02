import React from "react";
import "./allStyles.css";

const MessageModal = ({ show, message, type, onClose }) => {
  return (
    <>
      {show && (
        <div className="message-modal">
          <div className={`modal-content ${type}`}>
            <span className="close" onClick={onClose}>
              &times;
            </span>
            <p>{message}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageModal;