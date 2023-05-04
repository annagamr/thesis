const express = require("express");
const cors = require("cors");
const db = require("./Models");

// Function to create the Express app
function createApp() {
  const app = express();
  const PORT = process.env.PORT || 3002; //Express server will run on port 3002

  //Setting up Cross Original Resource Sharing options for our server and Server will allow requests from the specific origin
  var corsOptions = {
    origin: ["http://localhost:3000", "https://checkout.stripe.com"],
  };

  /* Middleware setup */
  //Requests that come to our application first will go through our cors middleware function which will check the origin of request
  app.use(cors(corsOptions));
  //express.json is a middleware function. It will parse incoming http request body in json format
  app.use(express.json());
  //handling requests that has url-encoded payloads, extended is set to true because we want to parse rich object and array data in url-encoded payload.
  app.use(express.urlencoded({ extended: true }));
  //for serving static files (images, etc..)
  app.use("/public", express.static("public"));

  // Root route
  app.get("/", (req, res) => {
    res.json({ message: "Welcome to my application." });
  });

  // Import and apply routes
  require("../Backend/Routes/index")(app);

  return app;
}

// Function to connect to MongoDB and initialize roles if not already initialized
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
      console.log("Roles have been initialized!");
    }
  } catch (error) {
    console.error("Connection error:", error.message);
    process.exit(1);
  }
}

// Function to start the server
async function startServer() {
  const PORT = process.env.PORT || 3002;
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Express server on port: ${PORT}`);
  });

  await connectAndInitialize();
}

// If this file is run directly, start the server
if (require.main === module) {
  startServer();
}

// Export the functions for testing
module.exports = {
  createApp,
  connectAndInitialize,
  db
};