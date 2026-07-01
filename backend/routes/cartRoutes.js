const express = require("express");
const router = express.Router();

const {
    addToCart,
    getCart,
    removeCartItem,
    increaseQuantity,
    decreaseQuantity
} = require("../controllers/cartController");

router.post("/", addToCart);

router.get("/:userId", getCart);

router.put("/increase/:id", increaseQuantity);

router.put("/decrease/:id", decreaseQuantity);

router.delete("/:id", removeCartItem);

module.exports = router;