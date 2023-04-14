const { product, user } = require("../Models");

const db = require("../Models");


async function create(productData) {
    // Create a new product with the given post data
    const product = new db.product({
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
                    // console.log(product);
                    return {
                        id: product._id,
                        title: product.title,
                        description: product.description,
                        category: product.category,
                        added: formatDate(product.added),
                        author: product.author.username,
                        price: product.price
                    }
                });
            });

        // Send the formatted products array in the response
        res.status(200).send(formattedProducts);
    } catch (err) {
        // If an error occurs, send a 500 error response to the client with the error message

        res.status(500).send({ message: err });
    }
};

