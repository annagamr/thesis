import React, { useState, useEffect } from "react";
import UserService from "../../services/user.service";
import productService from "../../services/product.service";
import axios from "axios";
import "./AddProduct.css";

const AddProduct = () => {
  const [access, setAccess] = useState("");
  const [error, setError] = useState({});

  // vars for product
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZip] = useState("");
  const [contactNumber, setContact] = useState("");

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
  const validateForm = () => {
    const errors = {};

    if (!title || title.trim().length === 0) {
      errors.title = "Title is required";
    }

    if (!description || description.trim().length === 0) {
      errors.description = "Description is required";
    }

    if (!category) {
      errors.category = "Category is required";
    }

    if (!price || price <= 0) {
      errors.price = "Price must be a positive number";
    }

    return errors;
  };

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

  async function addProduct(
    prodImageFile,
    prodImageName,
    title,
    description,
    category,
    author,
    price,
    street,
    city,
    zipCode,
    contactNumber
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
          street,
          city,
          zipCode,
          contactNumber
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProducts(response.data.post);
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
    setProdImageName(document.getElementById("prodImage").value);
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

  function updateStreet(e) {
    const newStreet = e.target.value;
    setStreet(newStreet);
  }

  function updateCity(e) {
    const newCity = e.target.value;
    setCity(newCity);
  }

  function updateZip(e) {
    const newZip = e.target.value;
    setZip(newZip);
  }

  function updateContact(e) {
    const newPhone = e.target.value;
    setContact(newPhone);
  }


  const resetForm = () => {
    setProdImageFile("");
    setProdImageName("");
    setTitle("");
    setDescription("");
    setCategory("");
    setStreet("");
    setCity("");
    setZip("");
    setContact("");
    setPrice(0);
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
          prodImageFile,
          prodImageName,
          title,
          description,
          category,
          author,
          price,
          street,
          city,
          zipCode,
          contactNumber
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
                {error.title && <p className="error">{error.title}</p>}

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
                {error.description && (
                  <p className="error">{error.description}</p>
                )}

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
                {error.category && <p className="error">{error.category}</p>}

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
                {error.price && <p className="error">{error.price}</p>}
                <div className="item-street">
                  <label htmlFor="street">Address (Street name, House No./Apt No.):</label>
                  <input
                    type="text"
                    style={{ width: "30rem" }}
                    maxLength={40}
                    name="street"
                    value={street}
                    onChange={updateStreet}
                    required
                  />
                </div>

                <div className="item-city">
                  <label htmlFor="city">City: </label>
                  <input
                    type="text"
                    style={{ width: "30rem" }}
                    maxLength={40}
                    name="city"
                    value={city}
                    onChange={updateCity}
                    required
                  />
                </div>

                <div className="item-zip">
                  <label htmlFor="zipCode">Zip Code: </label>
                  <input
                    type="text"
                    style={{ width: "30rem" }}
                    maxLength={40}
                    name="zipCode"
                    value={zipCode}
                    onChange={updateZip}
                    required
                  />
                </div>

                <div className="item-contact">
                  <label htmlFor="contactNumber">Phone Number: </label>
                  <input
                    type="text"
                    style={{ width: "30rem" }}
                    maxLength={40}
                    name="contactNumber"
                    value={contactNumber}
                    onChange={updateContact}
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
                <div className="product-details">
                  <h2>{message}</h2>
                  <div className="added-details">
                    <h3>Product Details:</h3>
                    <p>Image:</p>
                    <img
                      id="image-id"
                      src={URL.createObjectURL(prodImageFile)}
                    />

                    <p>Title: {title}</p>
                    <p>Description: {description}</p>
                    <p>Category: {category}</p>
                    <p>Price: {price}</p>
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
