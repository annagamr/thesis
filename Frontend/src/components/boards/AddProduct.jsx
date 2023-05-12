import React, { useState, useEffect, useContext } from "react";
import UserService from "../../services/user.service";
import productService from "../../services/product.service";
import axios from "axios";
import "./AddProduct.css";
import { useNavigate } from "react-router-dom";
import UserContext from "./UserContext";

const AddProduct = () => {
  const [access, setAccess] = useState("");
  const [error, setError] = useState({});

  // vars for product
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [street, setStreet] = useState("");
  const [zipCode, setZip] = useState("");
  const [contactNumber, setContact] = useState("");

  const [author, setAuthor] = useState(undefined);
  const [prodImageFile, setProdImageFile] = useState("");
  const [prodImageName, setProdImageName] = useState("");

  const [price, setPrice] = useState(0);
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const { logOut } = useContext(UserContext);
  const navigate = useNavigate();

  //x vars for product x\\

  const validBudapestZipCodes = [
    1011, 1012, 1013, 1014, 1015, 1016, 1021, 1022, 1023, 1024, 1025, 1026,
    1027, 1028, 1029, 1031, 1032, 1033, 1034, 1035, 1036, 1037, 1041, 1042,
    1043, 1044, 1045, 1046, 1047, 1051, 1052, 1053, 1054, 1055, 1056, 1061,
    1062, 1063, 1064, 1065, 1066, 1067, 1068, 1071, 1072, 1073, 1074, 1075,
    1076, 1077, 1081, 1082, 1083, 1084, 1085, 1086, 1087, 1088, 1089, 1091,
    1092, 1093, 1094, 1095, 1096, 1097, 1098, 1101, 1102, 1103, 1104, 1105,
    1106, 1107, 1108, 1111, 1112, 1113, 1114, 1115, 1116, 1117, 1118, 1119,
    1121, 1122, 1123, 1124, 1125, 1126, 1131, 1132, 1133, 1134, 1135, 1136,
    1137, 1138, 1139, 1141, 1142, 1143, 1144, 1145, 1146, 1147, 1148, 1149,
    1151, 1152, 1153, 1154, 1155, 1156, 1157, 1158, 1161, 1162, 1163, 1164,
    1165, 1171, 1172, 1173, 1174, 1181, 1182, 1183, 1184, 1185, 1186, 1188,
    1191, 1192, 1193, 1194, 1195, 1201, 1202, 1203, 1204, 1205, 1211, 1212,
    1213, 1214, 1215, 1221, 1222, 1223, 1224, 1225, 1231, 1232, 1233, 1234,
    1235, 1236, 1237, 1238, 1239,
  ];

  //Only for sellers
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

        // Check if the error status is 401
        if (error.response && error.response.status === 401) {
          // Log out the user and navigate to /signin
          logOut();
          navigate("/signin");
          window.location.reload();
        }
      }
      setUserRole("non-seller");
    };
    fetchSellerAccess();
  }, []);
  //x Only for sellers x\\
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

    // Validation for street
    const streetPattern = /^\d+\s[a-zA-Z\s]+$/;
    if (!street || !streetPattern.test(street.trim())) {
      errors.street = "Street format should be like: '114 Random Street'";
    }
    //Zip code validation
    if (!validBudapestZipCodes.includes(Number(zipCode))) {
      errors.zipCode = "Invalid zip code for Budapest";
    }
    // Validation for contact number
    const phoneNumberPattern = /^\+36\d{9}$/;
    if (!contactNumber || !phoneNumberPattern.test(contactNumber.trim())) {
      errors.contact =
        "Phone number must start with +36 and have 9 more digits";
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
      const formData = new FormData();
      formData.append("prodImageFile", prodImageFile);
      formData.append("prodImageName", prodImageName);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("author", author);
      formData.append("price", price);
      formData.append("street", street);
      formData.append("city", city);
      formData.append("zipCode", zipCode);
      formData.append("contactNumber", contactNumber);

      const response = await axios.post(
        process.env.REACT_APP_BACKEND_ENDPOINT + "/api/add-product",
        formData,
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
          "Budapest",
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
    <div>
      {userRole === "non-seller" && (
        <div className="container">
          <header className="jumbotron" data-testid="header-add">
            <h3>{access}</h3>
          </header>
        </div>
      )}
      {userRole !== "non-seller" && (
        <div className="main-container">
          <div className="product-container">
            {/* form */}
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
                    {error.category && (
                      <p className="error">{error.category}</p>
                    )}

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
                        {/* <h3
                          style={{ marginTop: "50px", marginBottom: "-40px" }}
                        >
                          Product Details:
                        </h3> */}
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
