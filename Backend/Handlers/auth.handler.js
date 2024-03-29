const secret = "my-secret-key"
const secretPass = "my-password-key"
const db = require("../Models");
const nodemailer = require('nodemailer');

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const User = require("../Models/user.model");
const Post = require("../Models/post.model");
const Product = require("../Models/product.model");
const Cart = require("../Models/cart.model");


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
    res.status(201).send({ message: "User registered successfully!" });
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
    console.log(err)
    // If an error occurs, send a 500 error response to the client with the error message
    res.status(500).send({ message: err });
  }
};

//gets triggered when user sends email address (so step 1)
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      secure: "true",
      auth: {
        user: 'auroraForservices',
        pass: 's r g a z t g e e f g s x w e c'
      }
    });

    const tokenPass = jwt.sign({ _id: user._id }, secretPass, { expiresIn: '15m' });
    const data = {
      from: 'auroraForservices@gmail.com',
      to: email,
      subject: 'Password Reset Link',
      html: `<h2> Please, follow the provided Link to reset your password! </h2>
             <h1>` + process.env.FRONTEND_ENDPOINT + `/resetPassword/${tokenPass}</h1>`
    }

    await user.updateOne({ resetLink: tokenPass });

    // Send the email
    await transporter.sendMail(data);
    console.log('Email sent');
    res.json({ message: 'Password reset email sent' });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

//gets triggered when the user click on reset link (step 2 - final step)
exports.resetPassword = async (req, res) => {
  const { newPass } = req.body;
  try {
    // Verify and decode the token
    const decodedData = await new Promise((resolve, reject) => {
      jwt.verify(req.body.token, secretPass, (error, decoded) => {
        if (error) {
          reject({ error: "Invalid/Expired Token" });
        } else {
          resolve(decoded);
        }
      });
    });

    // Find the user using the user ID from the decoded token
    const user = await User.findById(decodedData._id);
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    if (user.resetLink !== req.body.token) {
      return res.status(401).json({ error: "Invalid reset link" });
    }

    // Compare the new password with the old one
    const isMatch = await bcrypt.compare(newPass, user.password);
    if (isMatch) {
      return res.status(400).json({ error: "New password cannot be the same as the old password" });
    }

    const hashedPassword = await bcrypt.hash(newPass, 8);
    user.password = hashedPassword;
    user.resetLink = '';
    await user.save();

    return res.status(201).json({ message: "Password has been successfully updated!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


//Count of registered users in database
exports.countUsers = async (req, res) => {
  try {
    const users = await User.find().populate('roles');
    const usersWithRole = users.filter(user => user.roles.some(role => role.name === 'user'));
    const userCount = usersWithRole.length;
    res.status(200).json({ count: userCount, users: usersWithRole });

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occurred while fetching the user count.' });
  }

};

//Count of registered shops in database
exports.countShops = async (req, res) => {

  try {
    const users = await User.find().populate('roles');
    const shopsWithRole = users.filter(user => user.roles.some(role => role.name === 'seller'));
    const shopCount = shopsWithRole.length;
    res.status(200).json({ count: shopCount, shops: shopsWithRole });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occurred while fetching the seller count.' });
  }

};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the user has posts
    const userPosts = await Post.find({ author: userId });

    if (userPosts.length > 0) {
      // Delete the user's posts
      await Post.deleteMany({ author: userId });
    }

    // Check if the user has products
    const userProducts = await Product.find({ author: userId });

    if (userProducts.length > 0) {
      // Delete the user's products
      await Product.deleteMany({ author: userId });
    }

    // Check if the user has a cart
    const userCart = await Cart.findOne({ user: userId });

    if (userCart) {
      // Delete the user's cart
      await Cart.deleteOne({ user: userId });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User and their posts, products, and cart (if any) deleted successfully.' });

  } catch (err) {
    console.log(err)

    res.status(500).json({ message: 'Error deleting user: ' + err.message });
  }
};

exports.createUser = createUser;
exports.assignRolesToUser = assignRolesToUser;