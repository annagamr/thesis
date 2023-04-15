import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Reset = () => {
  const [newPass, setNewPassword] = useState("");
  const [username, setUsername] = useState("");
  const [successfull, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const { token } = useParams();
//   console.log(token) //token is correct here
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessful(false);

    try {
      const response = await axios.post("http://localhost:3002/api/reset-password", {
        token,
        newPass,
        username
      });

      setMessage(response.data.message);
      setSuccessful(true);

    } catch (error) {
      setMessage(error.response.data.error);
      setSuccessful(false);

    }
  };

  return (
    <div>
      {!successfull && (<form onSubmit={handleSubmit}>
      <label htmlFor="username">Enter Username: </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="newPassword">New Password: </label>
        <input
          type="password"
          value={newPass}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit">Reset Password</button>
      </form>)}
      {successfull && (
              <div className="if-success">
                <h2 style={{ color: "blue" }}>{message}</h2>{" "}
                
              </div>
            )}    </div>
  );
};

export default Reset;