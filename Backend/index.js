const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: "http://localhost:3001"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to my application." });
  });

  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });

  // routes
require('../Backend/Routes/auth.routes')(app);
require('../Backend/Routes/user.routes')(app);

  const db = require("./Models");
  const Role = db.role;
  const dbConfig = require("./Config/mongodb")
  db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log("Successfully connect to MongoDB.");
      initial();
    })
    .catch(err => {
      console.error("Connection error", err);
      process.exit();
    });
  
  function initial() {
    Role.estimatedDocumentCount().then((count) => {
      if (count === 0) {
        new Role({
          name: "user"
        }).save().then(res => {
          console.log("added 'user' to roles collection");

        }).catch(err => {
          if (err) {
            console.log("error", err);
          }
          });
  
        new Role({
          name: "moderator"
        }).save().then(res => {
          console.log("added 'moderator' to roles collection");

        }).catch(err => {
          if (err) {
            console.log("error", err);
          }
          });
  
        new Role({
          name: "admin"
        }).save().then(res => {
          console.log("added 'admin' to roles collection");

        }).catch(err => {
          if (err) {
            console.log("error", err);
          }
          });
      }
    }).catch(err => {
      console.log(err)
    });
  }