const config = require("../Config/auth.config");
const db = require("../Models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const createUser = async (userData) => {
  const user = new User({
    username: userData.username,
    email: userData.email,
    password: bcrypt.hashSync(userData.password, 8)
  });
  return user.save();
};

const assignRolesToUser = async (user, roles) => {
  const foundRoles = await Role.find({ name: { $in: roles } });
  user.roles = foundRoles.map(role => role._id);
  return user.save();
};

exports.signup = async (req, res) => {
  try {
    const user = await createUser(req.body);
    const roles = req.body.roles ? req.body.roles : ['user'];
    await assignRolesToUser(user, roles);
    res.send({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
      .populate("roles", "-__v")
      .exec();
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ accessToken: null, message: "Invalid password!" });
    }
    const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 });
    const authorities = user.roles.map(role => `ROLE_${role.name.toUpperCase()}`);
    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token
    });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};