const db = require("../config/db");

// Place Order
exports.placeOrder = (req, res) => {
    const { user_id, total } = req.body;

    db.query(
        "INSERT INTO orders(user_id,total) VALUES(?,?)",
        [user_id, total],
        (err, result) => {
            if (err) return res.status(500).json(err);

            res.json({
                success: true,
                message: "Order Placed Successfully",
                orderId: result.insertId
            });
        }
    );
};

// Get User Orders
exports.getOrders = (req, res) => {

    const userId = req.params.userId;

    db.query(
        "SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC",
        [userId],
        (err, result) => {

            if (err) return res.status(500).json(err);

            res.json({
                success: true,
                orders: result
            });

        }
    );

};

// Update Order Status (Admin)
exports.updateStatus = (req, res) => {

    const { status } = req.body;

    db.query(
        "UPDATE orders SET status=? WHERE id=?",
        [status, req.params.id],
        (err) => {

            if (err) return res.status(500).json(err);

            res.json({
                success: true,
                message: "Order Status Updated"
            });

        }
    );

};