const jwt = require("jsonwebtoken");
const secret = "my-secret-key"

const db = require("../Models");
const User = db.user;
const Role = db.role;

const verifyToken = async (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).json({ error: "Token was not provided" });
  }

  try {
    const decoded = await jwt.verify(token, secret);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("Could not verify token:", err);
    return res.status(401).json({ error: "Token is invalid!" });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const roles = await Role.find({ _id: { $in: user.roles } });
    if (!roles.some(role => role.name === "admin")) {
      return res.status(403).send({ message: "Access denied for non-admin users!" });
    }

    next();
  } catch (err) {
    console.error("isAdmin error:", err);
    return res.status(500).send({ message: "Server side error" });
  }
};

const isUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const roles = await Role.find({ _id: { $in: user.roles } });
    if (!roles.some(role => role.name === "user")) {
      return res.status(403).send({ message: "Access denied for non-customer users!" });
    }

    next();
  } catch (err) {
    console.error("isUser error:", err);
    return res.status(500).send({ message: "Server side error" });
  }
};

const isSeller = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const roles = await Role.find({ _id: { $in: user.roles } });
    if (!roles.some(role => role.name === "seller")) {
      return res.status(403).send({ message: "Access denied for non-seller users!" });
    }

    next();
  } catch (err) {
    console.error("isSeller error:", err);
    return res.status(500).send({ message: "Server side error" });
  }
};


const authJwt = {
  verifyToken,
  isAdmin,
  isSeller,
  isUser
};
module.exports = authJwt;