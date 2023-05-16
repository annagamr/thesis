import React, { useState, useEffect, useCallback } from "react";
import UserService from "../../services/user.service";
import MessageModal from "./MessageModal";
import "./allStyles.css";
import axios from "axios";

const BoardAdmin = () => {
  const [content, setContent] = useState("");
  const [userCount, setUserCount] = useState(null);
  const [users, setUsers] = useState([]);
  const [shopCount, setshopCount] = useState(null);
  const [shops, setShops] = useState([]);
  const [productCount, setproductCount] = useState(null);
  const [productss, setProductss] = useState([]);
  const [blogCount, setblogCount] = useState(null);
  const [blogss, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [userRole, setUserRole] = useState(null);

  // Modal controllers
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const [showModal, setShowModal] = useState(false);

  const closeModal = (refresh = false) => {
    setShowModal(false);
    if (refresh) {
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  useEffect(() => {
    UserService.adminAccess().then(
      (response) => {
        setContent(response.data);
        console.log("fadfa")
        setUserRole("admin");
      },
      (error) => {
        setContent(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            error.message ||
            error.toString()
        );
        setUserRole("non-admin");
      }
    );
  }, []);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_BACKEND_ENDPOINT + "/api/user-count"
        );
        setUserCount(response.data.count);
        setUsers(response.data.users);
      } catch (error) {
        console.error(
          "An error occurred while fetching the user count:",
          error
        );
      }
    };
    const fetchShopCount = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_BACKEND_ENDPOINT + "/api/shops-count"
        );
        setshopCount(response.data.count);
        setShops(response.data.shops);
      } catch (error) {
        console.error(
          "An error occurred while fetching the seller count:",
          error
        );
      }
    };

    const fetchProductCount = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_BACKEND_ENDPOINT + "/api/products"
        );
        setproductCount(response.data.count);
        setProductss(response.data.products);
      } catch (error) {
        console.error(
          "An error occurred while fetching the products count:",
          error
        );
      }
    };

    const fetchPostsCount = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_BACKEND_ENDPOINT + "/api/posts"
        );
        setblogCount(response.data.count);
        setBlogs(response.data.allPosts);
      } catch (error) {
        console.error(
          "An error occurred while fetching the posts count:",
          error
        );
      }
    };

    fetchPostsCount();
    fetchProductCount();
    fetchShopCount();
    fetchUserCount();
  }, []);

  const updateRelatedItems = useCallback((userId) => {
    setFilteredProducts((prevProducts) =>
      prevProducts.filter((product) => product.user !== userId)
    );
    setFilteredBlogs((prevBlogs) =>
      prevBlogs.filter((blog) => blog.author !== userId)
    );
  }, []);

  function removeProductFromGuestCart(productId) {
    const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

    const updatedGuestCart = guestCart.filter(
      (item) => item.product !== productId
    );

    localStorage.setItem("guestCart", JSON.stringify(updatedGuestCart));
  }

  // Unified deletion handler
  const deleteHandler = useCallback(
    async (
      event,
      itemType,
      apiEndpoint,
      items,
      setItems,
      updateRelatedItems
    ) => {
      event.stopPropagation();
      const itemId = event.target.getAttribute("data-item-id");

      try {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_ENDPOINT +
            `/api/${apiEndpoint}/${itemId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();
        if (response.ok) {
          setModalMessage(result.message);
          setModalType("success");
          setShowModal(true);
          const updatedItems = items.filter((item) => item.id !== itemId);
          setItems(updatedItems);

          if (itemType === "user" && updateRelatedItems) {
            updateRelatedItems(itemId);
          }

          if (itemType === "product") {
            removeProductFromGuestCart(itemId);
          }

          if (itemType === "user") {
            setTimeout(() => {
              closeModal(true);
            }, 1000);
          }
        } else {
          setModalMessage(`Error: ${result.message}`);
          setModalType("error");
          setShowModal(true);
        }
      } catch (error) {
        console.error(`Error deleting ${itemType}:`, error);
        setModalMessage(`Error deleting ${itemType}: ${error}`);
        setModalType("error");
        setShowModal(true);
      }
    },
    []
  );

  // Unified useEffect
  useEffect(() => {
    setFilteredBlogs(blogss);
    setFilteredProducts(productss);
    setFilteredUsers(users);
    setFilteredShops(shops);
  }, [blogss, productss, users, shops]);

  return (
    <div>
      {userRole === "non-admin" && (
        <div className="container">
          <header className="jumbotron">
            <h3>{content}</h3>
          </header>
        </div>
      )}
      {userRole !== "non-admin" && (
        <div className="mainContainer">
          <MessageModal
            show={showModal}
            message={modalMessage}
            type={modalType}
            onClose={closeModal}
          />
          <div className="users">
            <h2>USERS and SHOPS</h2>
            <h3>
              Number of Users: {userCount}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              Number of Shops: {filteredShops?.length}
            </h3>
            <div className="lists">
              <div>
                <ol className="users-list">
                  {filteredUsers?.map((user) => (
                    <React.Fragment key={user.username}>
                      <li>
                        {user.username}{" "}
                        <button
                          className="delete-user-btn"
                          data-item-id={user._id}
                          onClick={(event) =>
                            deleteHandler(
                              event,
                              "user",
                              "users-delete",
                              filteredUsers,
                              setFilteredUsers,
                              updateRelatedItems
                            )
                          }
                        >
                          &times;
                        </button>
                      </li>
                    </React.Fragment>
                  ))}
                </ol>
              </div>
              <div>
                <ol className="shops-list">
                  {filteredShops?.map((shop) => (
                    <React.Fragment key={shop.username}>
                      <li>
                        {shop.username}{" "}
                        <button
                          className="delete-user-btn"
                          data-item-id={shop._id}
                          onClick={(event) =>
                            deleteHandler(
                              event,
                              "shop",
                              "users-delete",
                              filteredShops,
                              setFilteredShops,
                              updateRelatedItems
                            )
                          }
                        >
                          &times;
                        </button>
                      </li>
                    </React.Fragment>
                  ))}
                </ol>
              </div>
            </div>
          </div>
          <div className="right-container">
            <div className="products">
              <h2>PRODUCTS</h2>
              <h3>Number of Products: {productCount}</h3>
              <div className="products-listed">
                <ol className="products-list">
                  {filteredProducts?.map((product) => (
                    <React.Fragment key={product.id}>
                      <li>
                        <button
                          onClick={(event) =>
                            deleteHandler(
                              event,
                              "product",
                              "product-delete",
                              filteredProducts,
                              setFilteredProducts
                            )
                          }
                          className="delete-product-btn"
                          data-item-id={product.id}
                        >
                          &times;
                        </button>
                        {product.title} <br />
                        by {product.author}
                      </li>
                    </React.Fragment>
                  ))}
                </ol>
              </div>
            </div>
            <div className="blogs">
              <h2>BLOGS</h2>
              <h3>Number of Blogs: {blogCount}</h3>
              <div className="blogs-listed">
                <ol className="blogs-list">
                  {filteredBlogs?.map((blogs) => (
                    <React.Fragment key={blogs.id}>
                      <li>
                        {blogs.title}
                        <button
                          onClick={(event) =>
                            deleteHandler(
                              event,
                              "blog",
                              "post-delete",
                              filteredBlogs,
                              setFilteredBlogs
                            )
                          }
                          className="delete-blog-btn"
                          data-item-id={blogs.id}
                        >
                          &times;
                        </button>
                        <br />
                        by {blogs.author}
                      </li>
                    </React.Fragment>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardAdmin;
