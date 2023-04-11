import React, { useState, useEffect } from "react";
import UserService from "../../services/user.service";
import productService from "../../services/product.service";
import axios from "axios";
import "./AddProduct.css";

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
    const fetchSellerAccess = async () => {
      try {
        const response = await UserService.sellerAccess();
        setAccess(response.data);
      } catch (error) {
        const errorMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setAccess(errorMessage);
      }
    };
    fetchSellerAccess();
  }, []);
  //x Only for users x\\

  useEffect(() => {
    const fetchProducts = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      if (user) {
        setAuthor(user.username);
      }

      try {
        const response = await productService.getAllProducts();
        setProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  async function addProduct(title, description, tags, author, price) {
    try {
      const response = await axios.post(
        "http://localhost:3002/api/add-product",
        {
          title,
          description,
          tags,
          author,
          price,
        }
      );
      setProducts([...products, response.data.post]);
      return response;
    } catch (error) {
      console.error("Error adding product: ", error);
      throw error;
    }
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

  const handleProduct = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);

    try {
      const response = await addProduct(
        title,
        description,
        tags,
        author,
        price
      );
      setMessage(response.data.message);
      setSuccessful(true);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage(error.toString());
      }
      setSuccessful(false);
    }
  };

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{access}</h3>
      </header>

      {/* form */}
      <div className="add-product-page">
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

        <div>
          {products.map((product) => (
            <div key={product.id}>
              <h2>{product.title}</h2>
              <p>{product.description}</p>
              <p>{product.tags}</p>
              <p>{product.added}</p>
              <p>{product.price}</p>
              <p>{product.author}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
