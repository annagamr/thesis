import React, { createContext, useState, useEffect, useContext } from "react";
import UserContext from "./UserContext";
import axios from "axios";
import productService from "../../services/product.service";
import { useNavigate } from "react-router-dom";
import UserService from "../../services/user.service";

export const AddProductContext = createContext();

export const AddProductProvider = (props) => {
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
  const [userRole, setUserRole] = useState("");

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

  useEffect(() => {
    // console.log("here")
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser) {
      const userId = currentUser.id;
      // console.log(userId);
      UserService.sellerAccess(userId)
        .then((response) => {
          // console.log(response);
          setUserRole("seller");
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              logOut();
              navigate("/signin");
              window.location.reload();
            } else if (err.response.status === 403) {
              setUserRole("non-seller");
              console.log("Not a seller");
            }
          }
        });
    }
    setUserRole("non-seller");

    // eslint-disable-next-line
  }, []);

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

  const addProduct = async (
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
  ) => {
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

      const user=JSON.parse(localStorage.getItem('user'));
      const token = user.accessToken;
      console.log(token)
      const response = await axios.post(
        process.env.REACT_APP_BACKEND_ENDPOINT + "/api/add-product",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-access-token" : token
          },
        }
      );
      setProducts(response.data.post);
      return response;
    } catch (error) {
      console.error("Error adding product: ", error);
      if (error.response) {
        if (error.response.status === 401) {
          if (error.response.data.message === "Token expired!") {
            alert("Token expired");
            logOut();
            navigate("/signin");
          } else if (error.response.data.message === "Token is invalid") {
            alert("Token is invalid");
            logOut();
            navigate("/signin");
          }
        }
      }
      throw error;
    }
  };

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
    <AddProductContext.Provider
      value={{
        addProduct,
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
        validateForm,
        validBudapestZipCodes,
        userRole,
        successful,
        message,
        price,
        prodImageName,
        prodImageFile,
        author,
        contactNumber,
        zipCode,
        street,
        category,
        description,
        title,
        products,
        error,
      }}
    >
      {props.children}
    </AddProductContext.Provider>
  );
};
