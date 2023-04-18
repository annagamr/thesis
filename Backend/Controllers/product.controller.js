const { product, user } = require("../Models");

const db = require("../Models");
const path = require('path'); // import path module


async function create(productData) {
    // Create a new product with the given post data
    const product = new db.product({
        image: productData.image,
        title: productData.title,
        description: productData.description,
        category: productData.category,
        added: new Date(),
        price: productData.price
    });

    // Save the product to the database and return the result
    return product.save();
}

async function assignProductToSeller(user, product) {
    // Find user in the database that match the given username
    const query = db.user.where({ username: user });
    const foundUser = await query.findOne();
    // console.log(foundUser);
    // Map the found user to their IDs and set them as the product's author
    product.author = foundUser._id;
    // Save the updated product to the database and return the result
    return product.save();
}

exports.addProduct = async (req, res) => {
    try {
        // Create a new product using the request body data
        // console.log(req.file)
        // console.log(req.file.path)
        // console.log(req.file+" just req")
        req.body.image = req.file.path
        const product = await create(req.body);
        const user = req.body.author;
        await assignProductToSeller(user, product);
        // Send a success message to the client
        res.status(200).send({ message: "Added Successfully", product: product });

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
        const products = await db.product.find({}).exec();
        // If no products are found, return a 404 error
        if (!products.length) {
            return res.status(404).send({ message: "No products found" });
        }

        // Create a new array of post objects with the desired properties


        const formattedProducts = await db.product.find({})
            .populate('author', 'username')
            .exec()
            .then(products => {
                return products.map(product => {
    
                    return {
                        id: product._id,
                        image: product.image,
                        title: product.title,
                        description: product.description,
                        category: product.category,
                        added: formatDate(product.added),
                        author: product.author.username,
                        price: product.price
                    }
                });
            });

            const count = formattedProducts.length;


        // Send the formatted products array in the response
        res.status(200).json({ products: formattedProducts, count: count });
    } catch (err) {
        // If an error occurs, send a 500 error response to the client with the error message

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

        // If no products are found, return a 404 error
        if (!products.length) {
            return res.status(404).send({ message: "No products found" });
        }

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
                price: product.price
            };
        });

        // Send the formatted products array in the response
        res.status(200).send(formattedProducts);
    } catch (err) {
        // If an error occurs, send a 500 error response to the client with the error message
        res.status(500).send({ message: err });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await product.findByIdAndDelete(productId);

        if (!deletedProduct) {
          return res.status(500).json({ message: 'Product not found' });
        }
    
        res.status(200).json({ message: 'Product deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
      }
};