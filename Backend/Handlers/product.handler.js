const { product, user, cart } = require("../Models");
const { Types } = require('mongoose');
const fs = require("fs");

const db = require("../Models");
const path = require('path'); // import path module


async function create(productData) {
    // Find user in the database that match the given username
    const author = await db.user.findOne({ username: productData.author });
    if (!author) {
        throw new Error(`User with username "${productData.author}" not found`);
    }
    // Create a new product with the given post data
    const product = new db.product({
        image: productData.image,
        title: productData.title,
        description: productData.description,
        category: productData.category,
        added: new Date(),
        author: author._id, // Set the author property to the _id of the found user
        price: productData.price,
        street: productData.street,
        city: productData.city,
        zipCode: productData.zipCode,
        contactNumber: productData.contactNumber
    });

    // Save the product to the database and return the result
    return product.save();
}

exports.addProduct = async (req, res) => {
    try {
        // console.log("received",req.body)
        req.body.image = req.file.path
        const product = await create(req.body);
        // Send a success message to the client
        res.status(200).send({ message: "Product Added Successfully!", product: product });

    } catch (err) {
        // If an error occurs, send a 500 error response to the client with the error message
        console.log(err)
        res.status(500).send({ message: err });
    }
};


const formatDate = (date) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
};


exports.products = async (req, res) => {
    try {
        // Get the category from the query parameters
        const category = req.query.category;

        // Create a filter object based on the category, if provided
        const filter = category ? { category: category } : {};

        // Fetch the products based on the filter
        const products = await db.product.find(filter).exec();

        // If no products are found, return a 200 response with empty products array and count 0
        if (!products.length) {
            return res.status(200).send({ products: [], count: 0 });
        }

        const formattedProducts = await db.product
            .find(filter)
            .populate("author", "username")
            .exec()
            .then((products) => {
                return products.map((product) => {
                    return {
                        id: product._id,
                        image: product.image,
                        title: product.title,
                        description: product.description,
                        category: product.category,
                        added: formatDate(product.added),
                        author: product.author.username,
                        price: product.price,
                        street: product.street,
                        city: product.city,
                        zipCode: product.zipCode,
                        contactNumber: product.contactNumber
                    };
                });
            });

        const count = formattedProducts.length;

        // Send the formatted products array in the response
        res.status(200).json({ products: formattedProducts, count: count });
    } catch (err) {
        // If an error occurs, send a 500 error response to the client with the error message
        console.log(err)
        res.status(500).send({ message: err });
    }
};

exports.productImage = async (req, res) => {
    try {
        const products = await db.product.find({ _id: req.params.id }).exec();
        console.log(req.params.id)
        // If no products are found, return a 404 error
        if (!products.length) {
            return res.status(404).send({ message: "No products found" });
        }

        // Create a new array of post objects with the desired properties
        const productImageURL = await db.product.find({ _id: req.params.id })
            .exec()
            .then(products => {
                return products.map(product => {
                    console.log(product)

                    return product.image; // This is a URL to the image location on server
                });
            });
        // console.log(productImageURL)

        res.sendFile(path.join(__dirname, '../', productImageURL[0]));
    } catch (err) {
        // If an error occurs, send a 500 error response to the client with the error message
        console.log("error" + err)
        res.status(500).send({ message: err });
    }
};

exports.productsbyAuthor = async (req, res) => {
    try {
        const products = await db.product.find({ author: req.params.author }).exec();

        // Create a new array of product objects with the desired properties
        const formattedProducts = products.map(product => {
            const sanitizedPath = product.image.replace(/\\/g, "/");
            return {
                id: product._id,
                image: sanitizedPath,
                title: product.title,
                description: product.description,
                category: product.category,
                added: formatDate(product.added),
                author: product.author.username,
                price: product.price,
                street: product.street,
                city: product.city,
                zipCode: product.zipCode,
                contactNumber: product.contactNumber
            };
        });

        // Get the number of orders for the user
        const numberOfProducts = formattedProducts.length;

        res.status(200).json({ products: formattedProducts, numberOfProducts: numberOfProducts });
    } catch (err) {
        console.log(err)

        // If an error occurs, send a 500 error response to the client with the error message
        res.status(500).send({ message: err });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
      const productId = req.params.id;
      const productToDelete = await product.findById(productId);
  
      if (!productToDelete) {
        return res.status(500).json({ message: "Product not found" });
      }
  
      // Delete the image file associated with the product
      fs.unlink(productToDelete.image, (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
        }
      });
  
      const deletedProduct = await product.findByIdAndDelete(productId);
  
      // Remove the product from all carts
      await cart.updateMany(
        { "items.product": productId },
        { $pull: { items: { product: productId } } }
      );
  
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error deleting product", error });
    }
  };

exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const productt = await db.product.findById(productId).populate("author", "username");

        if (!productt) {
            return res.status(404).json({ message: "Product not found." });
        }

        const formattedProduct = {
            id: productt._id,
            image: productt.image,
            title: productt.title,
            description: productt.description,
            category: productt.category,
            added: formatDate(productt.added),
            author: productt.author.username,
            price: productt.price,
            street: productt.street,
            city: productt.city,
            zipCode: productt.zipCode,
            contactNumber: productt.contactNumber
        };

        res.status(200).json({ product: formattedProduct });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Server error" });
    }
};
