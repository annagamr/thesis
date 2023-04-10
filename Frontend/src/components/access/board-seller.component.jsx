import React, { useState, useEffect } from "react";
import UserService from "../../services/user.service";
import productService from "../../services/product.service";
import axios from "axios";
import AuthService from "../../services/auth.service";


const AddProduct = () => {
  const [access, setAccess] = useState("");

  // vars for product
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [author, setAuthor] = useState(undefined);
  const [price, setPrice] = useState(0);
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);
  //x vars for product x\\

  //Only for users
  useEffect(() => {
    UserService.getSellerBoard().then(
      (response) => {
        setAccess(response.data);
      },
      (error) => {
        setAccess(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            error.message ||
            error.toString()
        );
      }
    );
  }, []);
  //x Only for users x\\

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setAuthor(user.username);
    }

    productService
      .getAllProducts()
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function addProduct(title, description, tags, author, price) {
    return axios
      .post("http://localhost:3002/api/add-product", {
        title,
        description,
        tags,
        author,
        price,
      })
      .then((response) => {
        // update the state to include the new post
        setProducts([...products, response.data.post]);
        return response;
      })
      .catch((error) => {
        console.error("Error adding product: ", error);
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

  function updatePrice(e) {
    const newPrice = e.target.value;
    setPrice(newPrice);
  }

  const handleProduct = (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);

    addProduct(title, description, tags, author, price)
      .then((response) => {
        // When addProduct() successfully returns data from the server
        setMessage(response.data.message);
        setSuccessful(true);
      })
      .catch((error) => {
        // When addProduct() returns an error
        if (error.response) {
          setMessage(error.response.data.message);
        } else {
          setMessage(error.toString());
        }
        setSuccessful(false);
      });
  };
  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{access}</h3>
      </header>

      {/* form */}
      <div>
            <form onSubmit={handleProduct}>
              <h2>Add New Product</h2>
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
                  <div className="item-price">
                    <label htmlFor="price">Price</label>
                    <input
                      type="number"
                      style={{ width: "30rem" }}
                      maxLength={40}
                      name="price"
                      value={price}
                      onChange={updatePrice}
                      required
                    />
                  </div>
                  <div className="add-post">
                    <button>Add Product</button>
                  </div>
                </div>
              )}
              {successful && (
                <div>
                  <p>{message}</p>
                </div>
              )}
            </form>
         
          </div>
    </div>
  );
};

export default AddProduct;
