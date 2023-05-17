const jwt = require("jsonwebtoken");
const secret = "my-secret-key"

const db = require("../Models");
const User = require("../Models/user.model");
const Role = require("../Models/role.model");

const verifyToken = async (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "Token was not provided" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.id;
    // console.log("Token is valid!")
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).send({ message: "Token expired!" });
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).send({ message: "Token is invalid!" });
    }
    console.error("Could not verify token:", err);
    return res.status(500).send({ message: "Could not verify token" });
  }
};

const isAdmin = async (req, res, next) => {
  const userId = req.headers['user-id'];
  console.log(userId)
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

const isSeller = async (req, res, next) => {
  const userId = req.headers['user-id'];
  console.log(userId)
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

const isUser = async (req, res, next) => {
  const userId = req.headers['user-id'];
  console.log(userId)
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