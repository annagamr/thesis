import React, { useState, useEffect } from "react";
import axios from "axios";
import "./blog.css";
import right from "./right.jpg";
import postService from "../../services/post.service";

const Blog = () => {
  const [sellerProf, setShowSellerProfile] = useState(false);
  const [adminProf, setShowAdminProfile] = useState(false);
  const [posts, setPosts] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [author, setAuthor] = useState(undefined);
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      setAuthor(user.username);
      setShowSellerProfile(user.roles.includes("ROLE_SELLER"));
      setShowAdminProfile(user.roles.includes("ROLE_ADMIN"));
    }

    postService
      .getAllPosts()
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function addPost(title, description, tags, author) {
    return axios
      .post("http://localhost:3002/api/create-post", {
        title,
        description,
        tags,
        author,
      })
      .then((response) => {
        // update the state to include the new post
        setPosts([...posts, response.data.post]);
        return response;
      })
      .catch((error) => {
        console.error("Error adding post: ", error);
        throw error;
      });
  }

  function updateTitle(e) {
    const newTitle = e.target.value;
    setTitle(newTitle);
  }

  function updateDescription(e) {
    const newDescription = e.target.value;
    const wordCount = newDescription.split(/\s+/).length;
    if (wordCount <= 200) {
      setDescription(newDescription);
    }
  }

  function updateTags(e) {
    const newTags = e.target.value.split(",");
    setTags(newTags);
  }

  const handlePost = (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);

    addPost(title, description, tags, author)
      .then((response) => {
        // When addPost() successfully returns data from the server
        setMessage(response.data.message);
        setSuccessful(true);
      })
      .catch((error) => {
        // When addPost() returns an error
        if (error.response) {
          setMessage(error.response.data.message);
        } else {
          setMessage(error.toString());
        }
        setSuccessful(false);
      });
  };

  return (
    <div className="blogContainer">
      <div className="blogPage">
        {(adminProf || sellerProf) && (
          <div>
            <form onSubmit={handlePost}>
              <h2>Create New Post!</h2>
              {!successful && (
                <div>
                  <div className="item-title">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      style={{ width: "30rem" }}
                      maxLength={40}
                      name="title"
                      value={title}
                      onChange={updateTitle}
                      required
                    />
                  </div>
                  <div className="item-description">
                    <label htmlFor="description">Description</label>
                    <textarea
                      rows="15"
                      style={{ width: "50rem" }}
                      name="description"
                      maxLength={1200}
                      value={description}
                      onChange={updateDescription}
                      required
                    ></textarea>
                  </div>

                  <div className="item-tags">
                    <label htmlFor="tags">Tags</label>
                    <input
                      type="text"
                      name="tags"
                      style={{ width: "30rem" }}
                      value={tags}
                      onChange={updateTags}
                      maxLength={40}
                      required
                    />
                  </div>
                  <div className="add-post">
                    <button>Add Post</button>
                  </div>
                </div>
              )}
              {successful && (
                <div>
                  <p>{message}</p>
                </div>
              )}
            </form>
            <div className="image-right">
              <img src={right} alt="" />
            </div>
          </div>
        )}
        <div>
          {posts.map((post) => (
            <div key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.description}</p>
              <p>{post.tags}</p>
              <p>{post.created}</p>
              <p>{post.author}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Blog;
