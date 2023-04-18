import React, {useState,useEffect} from "react";
import UserService from "../../services/user.service";
import "./allStyles.css"

const BoardAdmin = () => {
    const [content, setContent] = useState("");
  
    useEffect(() => {
      UserService.adminAccess().then(
        (response) => {
          setContent(response.data);
        },
        (error) => {
          setContent(
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
              error.message ||
              error.toString()
          );
        }
      );
    }, []);
  
    return (
      <div className="mainContainer">
      <div className="container">
        <header className="jumbotron">
          <h3>{content}</h3>
        </header>
      </div>
      <div className="users">
        <h2>USERS and SHOPS</h2>
        <h3>Number of Users:</h3>
        <h3>Number of Shops:</h3>

      </div>
      <div className="right-container">
        <div className="products">
          <h2>PRODUCTS</h2>
        </div>
        <div className="blogs">
          <h2>BLOGS</h2>
        </div>
      </div>
      </div>
    );
  };
  
  export default BoardAdmin;