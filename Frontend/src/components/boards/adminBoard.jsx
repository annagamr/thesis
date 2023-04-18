import React, { useState, useEffect, useCallback } from "react";
import UserService from "../../services/user.service";
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

  useEffect(() => {
    UserService.adminAccess().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        setContent(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            error.message ||
            error.toString()
        );
      }
    );
  }, []);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/api/user-count"
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
          "http://localhost:3002/api/shops-count"
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
        const response = await axios.get("http://localhost:3002/api/products");
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
        const response = await axios.get("http://localhost:3002/api/posts");
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
          `http://localhost:3002/api/${apiEndpoint}/${itemId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();
        if (response.ok) {
          alert(result.message);
          const updatedItems = items.filter((item) => item.id !== itemId);
          console.log(`Updated ${itemType}s:`, updatedItems);
          setItems(updatedItems);

          // Update products and blogs after user deletion
          if (itemType === "user" && updateRelatedItems) {
            updateRelatedItems(itemId);
          }
        // Refresh the page after 3 seconds if user is deleted successfully
        if (itemType === "user") {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error);
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
  }, [blogss, productss,users,shops]);

  return (
    <div className="mainContainer">
      <div className="container">
        <header className="jumbotron">
          <h3>{content}</h3>
        </header>
      </div>
      <div className="users">
        <h2>USERS and SHOPS</h2>
        <h3>
          Number of Users: {userCount}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          Number of Shops: {filteredShops.length}
        </h3>
        <div className="lists">
          <div>
            <ol className="users-list">
              {filteredUsers.map((user) => (
                <React.Fragment key={user._id}>
                  <li key={user._id}>
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
              {filteredShops.map((shop) => (
                <React.Fragment key={shop._id}>
                  <li key={shop._id}>
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
              {filteredProducts.map((product) => (
                <React.Fragment key={product._id}>
                  <li key={product._id}>
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
              {filteredBlogs.map((blogs) => (
                <React.Fragment key={blogs._id}>
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
  );
};

export default BoardAdmin;