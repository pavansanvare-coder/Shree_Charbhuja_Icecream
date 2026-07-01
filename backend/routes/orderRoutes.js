const express = require("express");
const router = express.Router();

const {
    placeOrder,
    getOrders,
    updateStatus
} = require("../controllers/orderController");

// Place Order
router.post("/place", placeOrder);

// Get Orders by User
router.get("/:userId", getOrders);

// Update Status (Admin)
router.put("/:id", updateStatus);

module.exports = router;