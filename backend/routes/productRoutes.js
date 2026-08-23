const express = require("express");

const router = express.Router();

const uploads = require("../middleware/upload");

const {
    getProducts,
    addProduct,
    deleteProduct
} = require("../controllers/productController");


// =============================
// GET ALL PRODUCTS
// =============================

router.get("/", getProducts);


// =============================
// ADD PRODUCT
// =============================

router.post(
    "/",
    uploads.single("image"),
    addProduct
);


// =============================
// DELETE PRODUCT
// =============================

router.delete(
    "/:id",
    deleteProduct
);


module.exports = router;