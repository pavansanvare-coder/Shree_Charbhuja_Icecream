const db = require("../config/db");

// Get All Products
exports.getProducts = (req, res) => {
    db.query("SELECT * FROM products", (err, results) => {
        if (err) return res.status(500).json(err);

        res.json({
            success: true,
            products: results
        });
    });
};

// Add Product
exports.addProduct = (req, res) => {

    const { name, price, category, description, stock } = req.body;

    db.query(
        "INSERT INTO products(name,price,category,description,stock) VALUES(?,?,?,?,?)",
        [name, price, category, description, stock],
        (err) => {

            if (err) return res.status(500).json(err);

            res.json({
                success: true,
                message: "Product Added Successfully"
            });

        }
    );

};