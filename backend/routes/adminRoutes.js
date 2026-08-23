const express = require("express");

const router = express.Router();

const {
    getDashboard,
    getAllOrders,
    updateOrderStatus,
    getOrderItems,
    getAllUsers,
    getReportSummary,
    getMonthlySales,
    getOrderStatusReport,
    getTopProducts,
    deleteUser
} = require("../controllers/adminController");


// =============================
// Dashboard
// =============================

router.get("/dashboard", getDashboard);


// =============================
// Orders
// =============================

router.get("/orders", getAllOrders);

router.get("/orders/:id", getOrderItems);

router.put("/orders/:id", updateOrderStatus);


// =============================
// Users
// =============================

router.get("/users", getAllUsers);

router.delete("/users/:id", deleteUser);


// =============================
// Reports
// =============================

router.get("/reports/summary", getReportSummary);

router.get("/reports/monthly-sales", getMonthlySales);

router.get("/reports/order-status", getOrderStatusReport);

router.get("/reports/top-products", getTopProducts);


module.exports = router;