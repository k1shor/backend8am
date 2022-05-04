const Product = require('../model/productModel')


// to add product
exports.postProduct = async (req, res) => {
    let product = new Product({
        product_name: req.body.product_name,
        product_description: req.body.product_description,
        product_price: req.body.product_price,
        product_image: req.file.path,
        count_in_stock: req.body.count_in_stock,
        category: req.body.category
    })
    product = await product.save()
    if (!product) {
        return res.status(400).json({ error: "something went wrong" })
    }
    else {
        res.send(product)
    }
}

// to show all products
exports.getAllProducts = async (req, res) => {
    let products = await Product.find().populate('category')
    if (!products) {
        return res.status(400).json({ error: "something went wrong" })
    }
    else {
        res.send(products)
    }
}

// to show product details
exports.productDetails = async (req, res) => {
    let product = await Product.findById(req.params.product_id).populate('category')
    if (!product) {
        return res.status(400).json({ error: "something went wrong" })
    }
    else {
        res.send(product)
    }
}

// to update product
exports.updateProduct = async (req, res) => {
    let product = await Product.findByIdAndUpdate(
        req.params.product_id,
        {
            product_name: req.body.product_name,
            product_description: req.body.product_description,
            product_price: req.body.product_price,
            product_image: req.body.product_image,
            count_in_stock: req.body.count_in_stock,
            category: req.body.category
        },
        { new: true }
    )
    if (!product) {
        return res.status(400).json({ error: "something went wrong" })
    }
    else {
        res.send(product)
    }
}

// to delete/remove a product
exports.deleteProduct = (req, res) => {
    Product.findByIdAndRemove(req.params.product_id)
        .then(product => {
            if (!product) {
                return res.status(400).json({ error: "Product not found" })
            }
            else {
                return res.status(200).json({ message: "Product deleted successfully" })
            }
        })
        .catch(error => {
            return res.status(400).json({ error: error })
        }
        )
}