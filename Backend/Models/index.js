//initializing a MongoDB database and db object
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {
  mongoose: mongoose,
  user: require('./user.model'),
  role: require('./role.model'),
  post: require('./post.model'),
  ROLES: ['user', 'admin', 'seller']
};
//x-initializing a MongoDB database and db object-x\\

module.exports = db;