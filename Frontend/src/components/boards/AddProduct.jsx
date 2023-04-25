import React, { useState, useEffect, useCallback } from "react";
import UserService from "../../services/user.service";
import productService from "../../services/product.service";
import axios from "axios";
import "./AddProduct.css";

const AddProduct = () => {
  const [access, setAccess] = useState("");
  const [error, setError] = useState({});
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    author: undefined,
    prodImageFile: "",
    prodImageName: "",
    price: 0,
  });
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);

  const fetchSellerAccess = useCallback(async () => {
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
  }, []);

  const fetchProducts = useCallback(async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      setForm((prevForm) => ({ ...prevForm, author: user.username }));
    }

    try {
      const response = await productService.getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchSellerAccess();
    fetchProducts();
  }, [fetchSellerAccess, fetchProducts]);

  async function addProduct(
    prodImageFile,
    prodImageName,
    title,
    description,
    category,
    author,
    price
  ) {
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
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProducts((prevProducts) => [...prevProducts, response.data.post]);
      return response;
    } catch (error) {
      console.error("Error adding product: ", error);
      throw error;
    }
  }

  function validateForm() {
    const errors = {};

    if (!form.title || form.title.trim().length === 0) {
      errors.title = "Title is required";
    }

    if (!form.description || form.description.trim().length === 0) {
      errors.description = "Description is required";
    }

    if (!form.category) {
      errors.category = "Category is required";
    }

    if (!form.price || form.price <= 0) {
      errors.price = "Price must be a positive number";
    }

    return errors;
  }

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      category: "",
      author: undefined,
      prodImageFile: "",
      prodImageName: "",
      price: 0,
    });
    setMessage("");
    setSuccessful(false);
    setError({});
  };

  const handleProduct = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);

    const errors = validateForm();
    setError(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const response = await addProduct(
          form.prodImageFile,
          form.prodImageName,
          form.title,
          form.description,
          form.category,
          form.author,
          form.price
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
    }
  };

  function updateForm(event) {
    const { name, value, files } = event.target;
    setForm((prevForm) => {
      if (name === "prodImage") {
        return {
          ...prevForm,
          prodImageFile: files[0],
          prodImageName: document.getElementById("prodImage").value,
        };
      }

      return {
        ...prevForm,
        [name]: value,
      };
    });
  }

  return (
    <div className="main-container">
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
                  <input
                    id="prodImage"
                    type="file"
                    name="prodImage"
                    accept=".jpg,.png"
                    onChange={updateForm}
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
                    value={form.title}
                    onChange={updateForm}
                    required
                  />
                </div>
                {error.title && <p className="error">{error.title}</p>}

                <div className="item-description">
                  <label htmlFor="description">Description</label>
                  <textarea
                    rows="5"
                    style={{ width: "30rem" }}
                    name="description"
                    maxLength={150}
                    value={form.description}
                    onChange={updateForm}
                    required
                  ></textarea>
                </div>
                {error.description && (
                  <p className="error">{error.description}</p>
                )}

                <div className="item-category">
                  <label htmlFor="category">Category</label>
                  <select
                    name="category"
                    style={{ width: "30rem" }}
                    value={form.category}
                    onChange={updateForm}
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
                {error.category && <p className="error">{error.category}</p>}

                <div className="item-price">
                  <label htmlFor="price">Price</label>
                  <input
                    type="number"
                    style={{ width: "30rem" }}
                    maxLength={40}
                    name="price"
                    value={form.price}
                    onChange={updateForm}
                    required
                  />
                </div>
                {error.price && <p className="error">{error.price}</p>}

                <div className="add-post">
                  <button>Add Product</button>
                </div>
              </div>
            )}
            {successful && (
              <div>
                <div className="product-details">
                  <h2>{message}</h2>
                  <div className="added-details">
                    <h3>Product Details:</h3>
                    <p>Image:</p>
                    <img
                      id="image-id"
                      src={URL.createObjectURL(form.prodImageFile)}
                    />{" "}
                    <p>Title: {form.title}</p>
                    <p>Description: {form.description}</p>
                    <p>Category: {form.category}</p>
                    <p>Price: {form.price}</p>
                  </div>
                </div>
                <button onClick={resetForm}>Add More Products</button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
