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
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState(undefined);
  const [prodImageFile, setProdImageFile] = useState("");
  const [prodImageName, setProdImageName] = useState("");


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



  async function addProduct(prodImageFile, prodImageName, title, description, category, author, price) {
    try {
      const response = await axios.post(
        "http://localhost:3002/api/add-product",
        {
          prodImageFile,
          prodImageName,
          title,
          description,
          category,
          author,
          price,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
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



  function updateImage(e) {
    const file = e.target.files[0];
    setProdImageFile(file);
    setProdImageName(document.getElementById('prodImage').value);
  }

  function updateDescription(e) {
    const newDescription = e.target.value;
    const wordCount = newDescription.split(/\s+/).length;
    if (wordCount <= 200) {
      setDescription(newDescription);
    }
  }

  function updateCategory(e) {
    const newCategory = e.target.value;
    setCategory(newCategory);
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
        prodImageFile,
        prodImageName,
        title,
        description,
        category,
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
    <div className="product-container">
      <header className="jumbotron">
        <h3>{access}</h3>
      </header>

      {/* form */}
      <div className="add-product-page">
        <form onSubmit={handleProduct} encType="multipart/form-data">
          {!successful && <h2 id="header-add">Add New Product</h2>}
          {!successful && (
            <div>
              <div className="item-image">
                <label htmlFor="prodImage">Image</label>
                <input id="prodImage"
                  type="file"
                  name="prodImage"
                  accept=".jpg,.png"
                  onChange={updateImage}
                  required
                />
              </div>
              <div className="item-title">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  style={{ width: "30rem" }}
                  maxLength={25}
                  name="title"
                  value={title}
                  onChange={updateTitle}
                  required
                />
              </div>
              <div className="item-description">
                <label htmlFor="description">Description</label>
                <textarea
                  rows="5"
                  style={{ width: "30rem" }}
                  name="description"
                  maxLength={150}
                  value={description}
                  onChange={updateDescription}
                  required
                ></textarea>
              </div>

              <div className="item-category">
                <label htmlFor="category">Category</label>
                <select
                  name="category"
                  style={{ width: "30rem" }}
                  value={category}
                  onChange={updateCategory}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="skin care">Skin Care</option>
                  <option value="body care">Body Care</option>
                  <option value="sun care">Sun Care</option>
                  <option value="hair care">Hair Care</option>
                  <option value="make up">Make Up</option>
                  <option value="perfume">Perfume</option>
                </select>
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
            <div className="product-details">
              <h2>{message}</h2>

              <div className="added-details">
                <h3>Product Details:</h3>
                <p>Image:</p>
                <img id="image-id" src={URL.createObjectURL(prodImageFile)}/>

                <p>Title: {title}</p>
                <p>
                  Description: <div>{description}</div>
                </p>
                <p>Category: {category}</p>
                <p>Price: {price}</p>
              </div>
              <button onClick={() => window.location.reload()}>
                Add More Products
              </button>
            </div>
          )}
        </form>

        {/* <div>
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
        </div> */}
      </div>
    </div>
  );
};

export default AddProduct;
