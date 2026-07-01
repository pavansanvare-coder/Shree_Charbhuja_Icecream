const db = require("../config/db");

// ===============================
// Add Product To Cart
// ===============================
exports.addToCart = (req, res) => {

    const { user_id, product_id, quantity } = req.body;

    db.query(
        "SELECT * FROM cart WHERE user_id=? AND product_id=?",
        [user_id, product_id],
        (err, result) => {

            if (err) return res.status(500).json(err);

            if (result.length > 0) {

                db.query(
                    "UPDATE cart SET quantity = quantity + ? WHERE user_id=? AND product_id=?",
                    [quantity || 1, user_id, product_id],
                    (err) => {

                        if (err) return res.status(500).json(err);

                        return res.json({
                            success: true,
                            message: "Cart Updated"
                        });

                    }
                );

            } else {

                db.query(
                    "INSERT INTO cart(user_id,product_id,quantity) VALUES(?,?,?)",
                    [user_id, product_id, quantity || 1],
                    (err) => {

                        if (err) return res.status(500).json(err);

                        return res.json({
                            success: true,
                            message: "Product Added To Cart"
                        });

                    }
                );

            }

        }
    );

};

// ===============================
// Get Cart
// ===============================
exports.getCart = (req, res) => {

    const userId = req.params.userId;

    const sql = `
    SELECT
        cart.id,
        cart.product_id,
        cart.quantity,
        products.name,
        products.price,
        products.image
    FROM cart
    INNER JOIN products
    ON cart.product_id = products.id
    WHERE cart.user_id = ?
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) return res.status(500).json(err);

        res.json({
            success: true,
            cart: result
        });

    });

};

// ===============================
// Increase Quantity
// ===============================
exports.increaseQuantity = (req, res) => {

    db.query(
        "UPDATE cart SET quantity = quantity + 1 WHERE id=?",
        [req.params.id],
        (err) => {

            if (err) return res.status(500).json(err);

            res.json({
                success: true
            });

        }
    );

};

// ===============================
// Decrease Quantity
// ===============================
exports.decreaseQuantity = (req, res) => {

    db.query(
        "UPDATE cart SET quantity = quantity - 1 WHERE id=? AND quantity>1",
        [req.params.id],
        (err) => {

            if (err) return res.status(500).json(err);

            res.json({
                success: true
            });

        }
    );

};

// ===============================
// Remove Item
// ===============================
exports.removeCartItem = (req, res) => {

    db.query(
        "DELETE FROM cart WHERE id=?",
        [req.params.id],
        (err) => {

            if (err) return res.status(500).json(err);

            res.json({
                success: true,
                message: "Item Removed"
            });

        }
    );

};