const db = require("../config/db");

// =====================================================
// DASHBOARD
// =====================================================

exports.getDashboard = (req, res) => {

    const dashboard = {};

    db.query(
        "SELECT COUNT(*) AS total FROM products",
        (err, products) => {

            if (err) return res.status(500).json(err);

            dashboard.products = products[0].total;

            db.query(
                "SELECT COUNT(*) AS total FROM orders",
                (err, orders) => {

                    if (err) return res.status(500).json(err);

                    dashboard.orders = orders[0].total;

                    db.query(
                        "SELECT COUNT(*) AS total FROM users",
                        (err, users) => {

                            if (err) return res.status(500).json(err);

                            dashboard.users = users[0].total;

                            db.query(
                                "SELECT IFNULL(SUM(total_amount), 0) AS revenue FROM orders",
                                (err, revenue) => {

                                    if (err) {
                                        return res.status(500).json(err);
                                    }

                                    dashboard.revenue =
                                        revenue[0].revenue;

                                    db.query(
                                        `SELECT
                                            id,
                                            fullname,
                                            total_amount,
                                            status
                                         FROM orders
                                         ORDER BY id DESC
                                         LIMIT 5`,
                                        (err, recent) => {

                                            if (err) {
                                                return res.status(500).json(err);
                                            }

                                            dashboard.recentOrders = recent;

                                            res.json({
                                                success: true,
                                                dashboard
                                            });

                                        }
                                    );

                                }
                            );

                        }
                    );

                }
            );

        }
    );

};


// =====================================================
// GET ALL ORDERS
// =====================================================

exports.getAllOrders = (req, res) => {

    db.query(
        `SELECT *
         FROM orders
         ORDER BY id DESC`,
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.sqlMessage || "Unable to get orders"
                });
            }

            res.json({
                success: true,
                orders: result
            });

        }
    );

};


// =====================================================
// UPDATE ORDER STATUS
// =====================================================

exports.updateOrderStatus = (req, res) => {

    const { status } = req.body;
    const orderId = req.params.id;

    const allowedStatus = [
        "Pending",
        "Confirmed",
        "Preparing",
        "Delivered",
        "Cancelled"
    ];

    if (!allowedStatus.includes(status)) {

        return res.status(400).json({
            success: false,
            message: "Invalid order status"
        });

    }

    db.query(
        "UPDATE orders SET status=? WHERE id=?",
        [status, orderId],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.sqlMessage || "Unable to update status"
                });
            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Order not found"
                });

            }

            res.json({
                success: true,
                message: "Order status updated successfully"
            });

        }
    );

};


// =====================================================
// ORDER DETAILS
// =====================================================

exports.getOrderItems = (req, res) => {

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
                    message: err.sqlMessage || "Unable to get order items"
                });

            }

            res.json({
                success: true,
                items: result
            });

        }
    );

};


// =====================================================
// GET ALL USERS
// =====================================================

exports.getAllUsers = (req, res) => {

    db.query(
        `SELECT
            id,
            name,
            email,
            role
         FROM users
         ORDER BY id DESC`,
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.sqlMessage || "Unable to get users"
                });

            }

            res.json({
                success: true,
                users: result
            });

        }
    );

};


// =====================================================
// DELETE USER
// =====================================================

exports.deleteUser = (req, res) => {

    const userId = req.params.id;

    db.query(
        "DELETE FROM users WHERE id=?",
        [userId],
        (err, result) => {

            if (err) {

                console.error("Delete User Error:", err);

                return res.status(500).json({
                    success: false,
                    message: err.sqlMessage || "Unable to delete user"
                });

            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });

            }

            res.json({
                success: true,
                message: "User deleted successfully"
            });

        }
    );

};


// =====================================================
// REPORT SUMMARY
// =====================================================

exports.getReportSummary = (req, res) => {

    const report = {};

    db.query(
        "SELECT COUNT(*) AS total FROM products",
        (err, products) => {

            if (err) return res.status(500).json(err);

            report.products = products[0].total;

            db.query(
                "SELECT COUNT(*) AS total FROM orders",
                (err, orders) => {

                    if (err) return res.status(500).json(err);

                    report.orders = orders[0].total;

                    db.query(
                        "SELECT COUNT(*) AS total FROM users",
                        (err, users) => {

                            if (err) return res.status(500).json(err);

                            report.users = users[0].total;

                            db.query(
                                `SELECT
                                    IFNULL(SUM(total_amount), 0) AS revenue
                                 FROM orders`,
                                (err, revenue) => {

                                    if (err) {
                                        return res.status(500).json(err);
                                    }

                                    report.revenue =
                                        revenue[0].revenue;

                                    res.json({
                                        success: true,
                                        report
                                    });

                                }
                            );

                        }
                    );

                }
            );

        }
    );

};


// =====================================================
// MONTHLY SALES
// =====================================================

exports.getMonthlySales = (req, res) => {

    db.query(
        `SELECT
            MONTH(created_at) AS month,
            SUM(total_amount) AS total
         FROM orders
         GROUP BY MONTH(created_at)
         ORDER BY MONTH(created_at)`,
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.sqlMessage || "Unable to get monthly sales"
                });

            }

            res.json({
                success: true,
                sales: result
            });

        }
    );

};


// =====================================================
// ORDER STATUS REPORT
// =====================================================

exports.getOrderStatusReport = (req, res) => {

    db.query(
        `SELECT
            status,
            COUNT(*) AS total
         FROM orders
         GROUP BY status`,
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.sqlMessage || "Unable to get order status"
                });

            }

            res.json({
                success: true,
                status: result
            });

        }
    );

};


// =====================================================
// TOP SELLING PRODUCTS
// =====================================================

exports.getTopProducts = (req, res) => {

    db.query(
        `SELECT
            p.name,
            SUM(oi.quantity) AS sold
         FROM order_items oi
         JOIN products p
         ON oi.product_id = p.id
         GROUP BY p.id, p.name
         ORDER BY sold DESC
         LIMIT 5`,
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.sqlMessage || "Unable to get top products"
                });

            }

            res.json({
                success: true,
                products: result
            });

        }
    );

};