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
  const [topic, setTopic] = useState("");
  const [author, setAuthor] = useState(undefined);
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

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

  function addPost(title, description, topic, author) {
    return axios
      .post("http://localhost:3002/api/create-post", {
        title,
        description,
        topic,
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

  function updatetopic(e) {
    const newTopic = e.target.value;
    setTopic(newTopic);
  }

  const handlePost = (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);

    addPost(title, description, topic, author)
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
              {!successful && (
                <div>
                  <h2>Create New Post!</h2>

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
                      minLength={800}
                      maxLength={1000}
                      value={description}
                      onChange={updateDescription}
                      required
                    ></textarea>
                  </div>

                  <div className="item-category">
                    <label htmlFor="topic">Topic</label>

                    <select
                      name="topic"
                      style={{ width: "30rem" }}
                      value={topic}
                      onChange={updatetopic}
                      required
                    >
                      <option value="">Select a topic</option>
                      <option value="makeUp">Make up</option>
                      <option value="skinCare">Skin Care</option>
                      <option value="healthNbeauty">Health & Beauty</option>
                      <option value="productRecommendation">
                        Product Recommendation
                      </option>
                      <option value="hair">Hair & Hair Products</option>
                      <option value="perfumes">Perfumes</option>
                      <option value="tanning">Sun & Tanning</option>
                    </select>
                  </div>
                  <div className="add-post">
                    <button>Add Post</button>
                  </div>
                </div>
              )}
            </form>
            {successful && (
              <div className="if-success">
                <h2 style={{ color: "blue" }}>{message}</h2>{" "}
                <div className="add-post">
                  <button onClick={() => window.location.reload()}>
                    Add More Blogs
                  </button>
                </div>
              </div>
            )}
          </div>
        )}{" "}
      </div>

      <div className="blog-posts-container">
        {posts.map((post) => (
          <div key={post.id} className="blog-posts">
            <h2 className="blog-title">{post.title}</h2>
            <p className="blog-author">Author: {post.author}, Date: {post.created}</p>
            <p className="blog-description">{post.description}</p>
            <p className="blog-topics">{post.topic}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Blog;
