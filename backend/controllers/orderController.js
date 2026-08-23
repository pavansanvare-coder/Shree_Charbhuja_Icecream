const db = require("../config/db");

// =============================
// Place Order
// =============================

exports.placeOrder = (req, res) => {

    const {
        user_id,
        fullname,
        mobile,
        address,
        city,
        pincode,
        payment_method,
        total_amount
    } = req.body;

    const sql = `
        INSERT INTO orders
        (user_id, fullname, mobile, address, city, pincode,
        payment_method, total_amount, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            user_id,
            fullname,
            mobile,
            address,
            city,
            pincode,
            payment_method,
            total_amount,
            "Pending"
        ],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: err.sqlMessage
                });
            }

            const orderId = result.insertId;

            // Get Cart Items
            db.query(
                "SELECT * FROM cart WHERE user_id=?",
                [user_id],
                (err, cart) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.sqlMessage
                        });
                    }

                    if (cart.length === 0) {
                        return res.json({
                            success: true,
                            message: "Order Placed Successfully",
                            orderId
                        });
                    }

                    let index = 0;

                    function saveItems() {

                        if (index >= cart.length) {

                            return db.query(
                                "DELETE FROM cart WHERE user_id=?",
                                [user_id],
                                (err) => {

                                    if (err) {
                                        return res.status(500).json({
                                            success: false,
                                            message: err.sqlMessage
                                        });
                                    }

                                    return res.json({
                                        success: true,
                                        message: "Order Placed Successfully",
                                        orderId
                                    });

                                }
                            );

                        }

                        const item = cart[index];

                        db.query(
                            `INSERT INTO order_items
                            (order_id, product_id, quantity)
                            VALUES (?, ?, ?)`,
                            [
                                orderId,
                                item.product_id,
                                item.quantity
                            ],
                            (err) => {

                                if (err) {
                                    return res.status(500).json({
                                        success: false,
                                        message: err.sqlMessage
                                    });
                                }

                                index++;

                                saveItems();

                            }
                        );

                    }

                    saveItems();

                }
            );

        }
    );

};


// =============================
// Get Orders
// =============================

exports.getOrders = (req, res) => {

    db.query(
        `SELECT *
         FROM orders
         WHERE user_id=?
         ORDER BY id DESC`,
        [req.params.userId],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.sqlMessage
                });
            }

            res.json({
                success: true,
                orders: result
            });

        }
    );

};


// =============================
// Order Details
// =============================

exports.getOrderDetails = (req, res) => {

    db.query(
        `SELECT
            p.name,
            p.price,
            oi.quantity

        FROM order_items oi

        JOIN products p
        ON oi.product_id = p.id

        WHERE oi.order_id = ?`,
        [req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.sqlMessage
                });
            }

            res.json({
                success: true,
                items: result
            });

        }
    );

};