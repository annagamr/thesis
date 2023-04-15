import React, { useState } from "react";

import axios from 'axios';

const Forgot = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/api/forgot-password', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        
        <label htmlFor="email">Enter Email: </label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};
export default Forgot;
