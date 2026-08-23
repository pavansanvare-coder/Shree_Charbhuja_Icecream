const express = require("express");
const router = express.Router();

const {
    placeOrder,
    getOrders,
    getOrderDetails
} = require("../controllers/orderController");

// Place Order
router.post("/", placeOrder);

// Get User Orders
router.get("/:userId", getOrders);

// Get Single Order
router.get("/details/:id", getOrderDetails);

module.exports = router;