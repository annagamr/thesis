import React, { useState, useEffect } from "react";
import AuthService from "../../services/auth.service";
import axios from "axios";

function addPost(title, description, tags, author) {
  return axios.post("http://localhost:3002/api/create-post", {
    title,
    description,
    tags,
    author,
  });
}

const Blog = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [author, setAuthor] = useState(undefined);
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);
  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setAuthor(user.username);
    }
  }, []);

  function updateTitle(e) {
    const newTitle = e.target.value;
    setTitle(newTitle);
  }

  function updateDescription(e) {
    const newDescription = e.target.value;
    setDescription(newDescription);
  }

  function updateTags(e) {
    const newTags = e.target.value;
    newTags.split(", ");
    setTags(newTags);
  }

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);

    addPost(title, description, tags, author)
      .then((response) => {
        // When register() successfully returns data from the server
        setMessage(response.data.message);
        setSuccessful(true);
      })
      .catch((error) => {
        // When register() returns an error
        if (error.response) {
          setMessage(error.response.data.message);
        } else {
          setMessage(error.toString());
        }
        setSuccessful(false);
      });
  };

  return (
    <div>
      dadadfafafafafaf
      <form onSubmit={handleRegister}>
        {!successful && (
          <div>
            <div className="item-title">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={updateTitle}
                required
              />
            </div>

            <div className="item-description">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                name="description"
                value={description}
                onChange={updateDescription}
                required
              />
            </div>

            <div className="item-password">
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                name="tags"
                value={tags}
                onChange={updateTags}
                required
              />
            </div>
            <div className="signup-button">
              <button>Add Post</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
export default Blog;
