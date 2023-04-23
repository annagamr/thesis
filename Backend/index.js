//Setting up Express server
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3002; //Express server will run on port 3002

//Setting up Cross Original Resource Sharing options for our server
const cors = require("cors"); //importing middleware package for server
//Server will allow requests from this specific origin
var corsOptions = {
  origin: ["http://localhost:3000",  'https://checkout.stripe.com']

};
//Requests that come to our application first will go through our cors middleware function which will check the origin of request
app.use(cors(corsOptions));
//express.json is a middleware function it will parse incoming http request body in json format
app.use(express.json());
//handling requests that has url-encoded payloads, extended is set to true because we want to parse rich object and array data in url-encoded payload.
app.use(express.urlencoded({ extended: true }));
//for serving static files (images, etc..)
app.use('/public', express.static('public'));

app.listen(PORT, () => {
  console.log(`Express server on port: ${PORT}`);
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to my application." });
});

// routes
require('../Backend/Routes/index')(app);


const db = require("./Models")
async function connectAndInitialize() {
  try {
    await db.mongoose.connect(`mongodb://127.0.0.1:27017/aurora_database`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database!");

    const count = await db.role.estimatedDocumentCount();
    if (count === 0) {
      await db.role.insertMany([
        { name: "user" },
        { name: "seller" },
        { name: "admin" },
      ]);
      console.log("Roles have been initialized.");
    }
  } catch (error) {
    console.error("Connection error:", error.message);
    process.exit(1);
  }
}
connectAndInitialize();
