const secret = "my-secret-key"
const db = require("../Models");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// Asynchronously creates a new user with the provided user data
async function createUser(userData) {
  // Create a new user with the given user data
  const user = new db.user({
    username: userData.username,
    email: userData.email,
    password: bcrypt.hashSync(userData.password, 8)
  });

  // Save the user to the database and return the result
  return user.save();
}

async function assignRolesToUser(user, roles) {
  // Find roles in the database that match the given role names
  const foundRoles = await db.role.find({ name: { $in: roles } });

  // Map the found roles to their IDs and set them as the user's roles
  user.roles = foundRoles.map(role => role._id);

  // Save the updated user to the database and return the result
  return user.save();
}

// Asynchronously registers a new user
exports.signup = async (req, res) => {
  try {
    // Create a new user using the request body data
    const user = await createUser(req.body);

    // Assign roles to the new user based on the request body data, defaulting to 'user' if no roles are specified
    const roles = req.body.roles ? req.body.roles : ['user'];
    await assignRolesToUser(user, roles);

    // Send a success message to the client
    res.send({ message: "User registered successfully!" });
  } catch (err) {
    // If an error occurs, send a 500 error response to the client with the error message
    res.status(500).send({ message: err });
  }
};

exports.signin = async (req, res) => {
  try {
    // Find the user in the database with the provided username and populate their roles
    const user = await db.user.findOne({ username: req.body.username }).populate("roles", "-__v").exec();

    // If no user is found with the given username, return a 404 error
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Compare the provided password with the user's hashed password to check if they match
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    // If the passwords do not match, return a 401 error
    if (!passwordIsValid) {
      return res.status(401).send({ accessToken: null, message: "Invalid password!" });
    }

    // Create a JSON web token for the user with a 24 hour expiration time
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: 86400 });

    // Map the user's roles to an array of authorities
    const authorities = user.roles.map(role => `ROLE_${role.name.toUpperCase()}`);

    // Send a response to the client with the user's ID, username, email, roles, and access token
    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token
    });
  } catch (err) {
    // If an error occurs, send a 500 error response to the client with the error message
    res.status(500).send({ message: err });
  }
};