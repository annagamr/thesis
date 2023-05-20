const jwt = require("jsonwebtoken");  // JSON Web Tokens for secure transmission of information
const secret = "my-secret-key"  // Secret key to sign and verify JWTs

const User = require("../Models/user.model");  // User model

// Middleware to verify if incoming requests are accompanied by a valid token
const verifyToken = async (req, res, next) => {
  const token = req.headers["x-access-token"];  // Retrieve token from headers

  if (!token) {
    // If token is not provided, return an error
    return res.status(403).send({ message: "Token was not provided" });
  }

  try {
    const decoded = jwt.verify(token, secret);  // Try to verify the token
    req.userId = decoded.id;  // Attach the decoded id to the request object
    next();  // Continue to the next middleware or route handler
  } catch (err) {
    // Catch and handle errors
    // If the token is expired, send an error message
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).send({ message: "Token expired!" });
    }
    // If the token is invalid, send an error message
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).send({ message: "Token is invalid!" });
    }
    // If any other error occurs, log it and send a general error message
    console.error("Could not verify token:", err);
    return res.status(500).send({ message: "Could not verify token" });
  }
};

// Middleware to verify if the user is an admin
const isAdmin = async (req, res, next) => {
  const userId = req.headers['user-id'];
  // console.log(userId)
  if (!userId) {
    return res.status(400).send({ message: "User ID was not provided" });
  }

  try {
    const user = await User.findById(userId).populate("roles");

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isAdmin = user.roles.some((role) => role.name === "admin");

    if (isAdmin) {
      return res.status(200).send({ message: "User is an admin" });
    } else {
      return res.status(403).send({ message: "Access not granted for non-admin users" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};

// Middleware to verify if the user is a seller
const isSeller = async (req, res, next) => {
  const userId = req.headers['user-id'];
  // console.log(userId)
  if (!userId) {
    return res.status(400).send({ message: "User ID was not provided" });
  }

  try {
    const user = await User.findById(userId).populate("roles");

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isSeller = user.roles.some((role) => role.name === "seller");

    if (isSeller) {
      return res.status(200).send({ message: "User is a seller" });
    } else {
      return res.status(403).send({ message: "Access not granted for non-seller users" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};

// Middleware to verify if the user is a regular user
const isUser = async (req, res, next) => {
  const userId = req.headers['user-id'];
  // console.log(userId)
  if (!userId) {
    return res.status(400).send({ message: "User ID was not provided" });
  }

  try {
    const user = await User.findById(userId).populate("roles");

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isUser = user.roles.some((role) => role.name === "user");

    if (isUser) {
      return res.status(200).send({ message: "User is a customer" });
    } else {
      return res.status(403).send({ message: "Access not granted for non-customer users" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};


const authJwt = {
  verifyToken,
  isAdmin,
  isSeller,
  isUser
};
module.exports = authJwt;