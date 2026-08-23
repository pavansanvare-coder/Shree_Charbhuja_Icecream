const db = require("../../config/db");

// Get Products
exports.getProducts = (req, res) => {

    db.query(
        "SELECT * FROM products ORDER BY id DESC",
        (err, result) => {

            if (err)
                return res.status(500).json(err);

            res.json({
                success: true,
                products: result
            });

        }
    );

};


// Add Product

exports.addProduct = (req, res) => {

    const {
        name,
        category,
        price,
        stock,
        description
    } = req.body;

    const image = req.file
        ? "/uploads/" + req.file.filename
        : "";

    db.query(

        `INSERT INTO products
        (name,category,price,stock,description,image)

        VALUES(?,?,?,?,?,?)`,

        [

            name,
            category,
            price,
            stock,
            description,
            image

        ],

        (err) => {

            if (err)
                return res.status(500).json(err);

            res.json({

                success: true,

                message: "Product Added Successfully"

            });

        }

    );

};


// Delete Product

exports.deleteProduct = (req, res) => {

    db.query(

        "DELETE FROM products WHERE id=?",

        [req.params.id],

        (err) => {

            if (err)
                return res.status(500).json(err);

            res.json({

                success: true,

                message: "Product Deleted"

            });

        }

    );

};