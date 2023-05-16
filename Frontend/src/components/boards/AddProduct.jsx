import React, { useState, useEffect, useContext } from "react";
import UserService from "../../services/user.service";
import productService from "../../services/product.service";
import axios from "axios";
import "./AddProduct.css";
import { useNavigate } from "react-router-dom";
import UserContext from "./UserContext";
import { AddProductContext } from "./AddProductContext";

const AddProduct = () => {
  const {
    handleProduct,
    resetForm,
    updateContact,
    updateZip,
    updateStreet,
    updatePrice,
    updateCategory,
    updateDescription,
    updateImage,
    updateTitle,
    successful,
    message,
    price,
    prodImageFile,
    contactNumber,
    zipCode,
    street,
    category,
    description,
    title,
    error,
    userRole
  } = useContext(AddProductContext);


  return (
    <div>
      {userRole === "non-seller" && (
        
      <div className="container">

          <header className="jumbotron" data-testid="header-add">
            <h3>No Access for Non-Seller Users</h3>
          </header>
        </div>
      )}
      {userRole === "seller" && (
      <div className="main-container">
        <div className="product-container">
          <div className="add-product-page">
            <form onSubmit={handleProduct} encType="multipart/form-data">
              {!successful && <h2>Add New Product</h2>}
              {!successful && (
                <div>
                  <div className="item-image">
                    <label htmlFor="prodImage">Image</label>
                    <input
                      id="prodImage"
                      type="file"
                      name="prodImage"
                      accept=".png"
                      onChange={updateImage}
                      required
                    />
                  </div>
                  <div className="item-title">
                    <label htmlFor="title">Title</label>
                    <input
                      id="title"
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
                      id="description"
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
                      id="category"
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
                      id="price"
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
                    <label htmlFor="street">
                      Address (Street name, House No./Apt No.):
                    </label>
                    <input
                      id="street"
                      type="text"
                      style={{ width: "30rem" }}
                      maxLength={40}
                      name="street"
                      value={street}
                      onChange={updateStreet}
                      required
                    />
                  </div>
                  {error.street && <p className="error">{error.street}</p>}

                  <div className="item-city">
                    <label htmlFor="city">City: </label>
                    <select name="city" id="city">
                      <option value="">Budapest</option>
                    </select>
                  </div>

                  <div className="item-zip">
                    <label htmlFor="zipCode">Zip Code: </label>
                    <input
                      id="zipCode"
                      type="text"
                      style={{ width: "30rem" }}
                      maxLength={40}
                      name="zipCode"
                      value={zipCode}
                      onChange={updateZip}
                      required
                    />
                  </div>
                  {error.zipCode && <p className="error">{error.zipCode}</p>}

                  <div className="item-contact">
                    <label htmlFor="contactNumber">Phone Number: </label>
                    <input
                      id="contactNumber"
                      type="text"
                      style={{ width: "30rem" }}
                      maxLength={40}
                      name="contactNumber"
                      value={contactNumber}
                      onChange={updateContact}
                      required
                    />
                  </div>
                  {error.contact && <p className="error">{error.contact}</p>}

                  <div className="add-post">
                    <button
                      role="button"
                      aria-label="Add Product"
                      data-testid="submit-button"
                    >
                      Add Product
                    </button>{" "}
                  </div>
                </div>
              )}
              {successful && (
                <div>
                  <div className="product-details">
                    <h2 data-testid="success-message">{message}</h2>
                    <div className="added-details">
                      <p style={{ marginTop: "70px" }}>Image:</p>
                      <img
                        id="image-id"
                        src={URL.createObjectURL(prodImageFile)}
                        alt=""
                      />

                      <p style={{ marginTop: "20px", marginBottom: "-40px" }}>
                        <b>Title:</b> {title}
                      </p>
                      <p style={{ marginTop: "70px" }}>
                        <b>Description:</b> {description}
                      </p>
                      <p style={{ marginTop: "70px", marginBottom: "-40px" }}>
                        <b>Category:</b> {category}
                      </p>
                      <p style={{ marginTop: "70px", marginBottom: "-40px" }}>
                        <b>Price:</b> {price} HUF
                      </p>
                    </div>
                  </div>
                  <button id="add-more-prod" onClick={resetForm}>
                    Add More Products
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default AddProduct;
