const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
    getProducts,
    addProduct,
    deleteProduct
} = require("../controllers/productController");


// GET ALL PRODUCTS
router.get("/", getProducts);


// ADD PRODUCT WITH IMAGE
router.post(
    "/",
    upload.single("image"),
    addProduct
);


// DELETE PRODUCT
router.delete(
    "/:id",
    deleteProduct
);


module.exports = router;