import React, { useState, useEffect } from "react";
import axios from "axios";
import "./blog.css";
import postService from "../../services/post.service";

export const reloadPage = () => {
  window.location.reload();
};

const Blog = ({ user }) => {
  const [sellerProf, setShowSellerProfile] = useState(false);
  const [adminProf, setShowAdminProfile] = useState(false);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const [skin, setSkin] = useState("0");
  const [makeUp, setMakeUp] = useState("0");
  const [health, setHealth] = useState("0");
  const [recommendation, setRecommendation] = useState("0");
  const [hair, setHair] = useState("0");
  const [sun, setSun] = useState("0");
  const [perfume, setPerfume] = useState("0");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("");
  const [author, setAuthor] = useState(undefined);
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);

  useEffect(() => {
    const storedUser = user || JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setAuthor(storedUser.username);
      setShowSellerProfile(storedUser.roles.includes("ROLE_SELLER"));
      setShowAdminProfile(storedUser.roles.includes("ROLE_ADMIN"));
    }

    postService
      .getAllPosts()
      .then((response) => {
        setPosts(response.data.allPosts);
      })
      .catch((error) => {
        setError("An error occurred while fetching posts.");
        console.log(error);
      });
  }, []);

  useEffect(() => {
    postService
      .getSkincare()
      .then((response) => {
        setSkin(response.data.count);
      })
      .catch((error) => {
        setError("An error occurred while fetching skincare posts number.");
      });
  }, []);

  useEffect(() => {
    postService
      .getMakeUp()
      .then((response) => {
        setMakeUp(response.data.count);
      })
      .catch((error) => {
        setError("An error occurred while fetching make up posts number.");
      });
  }, []);

  useEffect(() => {
    postService
      .getHealth()
      .then((response) => {
        setHealth(response.data.count);
      })
      .catch((error) => {
        setError("An error occurred while fetching health posts number.");
      });
  }, []);

  useEffect(() => {
    postService
      .getRec()
      .then((response) => {
        setRecommendation(response.data.count);
      })
      .catch((error) => {
        setError(
          "An error occurred while fetching recommendation posts number."
        );
      });
  }, []);

  useEffect(() => {
    postService
      .getHair()
      .then((response) => {
        setHair(response.data.count);
      })
      .catch((error) => {
        setError("An error occurred while fetching hair posts number.");
      });
  }, []);

  useEffect(() => {
    postService
      .getSun()
      .then((response) => {
        setSun(response.data.count);
      })
      .catch((error) => {
        setError("An error occurred while fetching sun posts number.");
      });
  }, []);

  useEffect(() => {
    postService
      .getPerfumes()
      .then((response) => {
        setPerfume(response.data.count);
      })
      .catch((error) => {
        setError("An error occurred while fetching perfume posts number.");
      });
  }, []);

  function addPost(title, description, topic, author) {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user.accessToken;
    return axios
      .post(
        process.env.REACT_APP_BACKEND_ENDPOINT + "/api/create-post",
        {
          title,
          description,
          topic,
          author,
        },
        {
          headers: {
            "x-access-token": token,
          },
        }
      )
      .then((response) => {
        // update the state to include the new post
        setPosts([...posts, response.data.post]);
        return response;
      })
      .catch((error) => {
        if (error.response) {
          // If status code is 401, check the message
          if (error.response.status === 401) {
            if (error.response.data.message === "Token expired!") {
              // Handle token expiration...
              alert("Token expired. Please log in again.");
            } else {
              // Handle other 401 errors...
              alert("Unauthorized. Check your permissions.");
            }
          }
        } else if (error.request) {
          // The request was made but no response was received
          setError(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          setError("Error", error.message);
        }
        setError("Error adding post! ", error);
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
                  <h2 data-testid="createButton">Create New Post!</h2>

                  <div className="item-title">
                    <label htmlFor="title">Title</label>
                    <input
                      data-testid="Title"
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
                      data-testid="Description"
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
                      data-testid="Topic"
                      name="topic"
                      style={{ width: "30rem" }}
                      value={topic}
                      onChange={updatetopic}
                      required
                    >
                      <option value="">Select a topic</option>
                      <option value="Make-up">Make up</option>
                      <option value="Skincare">Skin Care</option>
                      <option value="Health">Health & Beauty</option>
                      <option value="Recommendation">
                        Product Recommendation
                      </option>
                      <option value="Hair">Hair & Hair Products</option>
                      <option value="Perfumes">Perfumes</option>
                      <option value="Sun">Sun & Tanning</option>
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
                  <button onClick={reloadPage}>Add More Blogs</button>
                </div>
              </div>
            )}
          </div>
        )}{" "}
      </div>
      <div className="categories">
        <div className="topic-item">
          Skin Care
           ({skin})
        </div>
        <div className="topic-item">
          Make up
           ({makeUp})
        </div>
        <div className="topic-item">
          Health & Beauty ({health})
        </div>
        <div className="topic-item">
          Recommendations  ({recommendation})
        </div>
        <div className="topic-item">
          Hair & Hair Products ({hair})
        </div>
        <div className="topic-item">
          Sun & Tanning  ({sun})
        </div>
        <div className="topic-item">
          Perfumes  ({perfume})
        </div>
      </div>

      <div className="blog-posts-container" data-testid="blog-posts-container">
        {posts.length === 0 && !(adminProf || sellerProf)? (
          <h2 id="no-blogs">No Blogs to Show</h2>
        ) : (
          posts.map((post) => (
            <div
              key={post.title}
              className="blog-posts"
              data-testid="blog-post"
            >
              <h2 className="blog-title">{post.title}</h2>
              <p className="blog-description">{post.description}</p>
              <p className="blog-topics">{post.topic}</p>
              <p className="blog-author">
                Author: {post.author} <br />
                <br />
                Date: {post.created}
              </p>
            </div>
          ))
        )}
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};
export default Blog;
