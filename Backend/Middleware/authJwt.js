const jwt = require("../node_modules/jsonwebtoken");
const config = require("../Config/auth.config.js"); //my secret key
const db = require("../Models");
const User = db.user;
const Role = db.role;

verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }

    const decoded = await jwt.verify(token, config.secret);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("Error verifying token: ", err);
    return res.status(401).send({ message: "Unauthorized!" });
  }
};

isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const roles = await Role.find({ _id: { $in: user.roles } });
    if (!roles.some(role => role.name === "admin")) {
      return res.status(403).send({ message: "Require Admin Role!" });
    }
    next();
  } catch (err) {
    console.error("Error checking admin role: ", err);
    return res.status(500).send({ message: err });
  }
};

isSeller = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    Role.find({ _id: { $in: user.roles } }, (err, roles) => {
      if (err) {
        return res.status(500).send({ message: err });
      }

      const isSeller = roles.some(role => role.name === 'seller');
      if (isSeller) {
        next();
      } else {
        return res.status(403).send({ message: 'Require Seller Role!' });
      }
    });
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isSeller
};
module.exports = authJwt;