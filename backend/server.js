require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();


// =============================
// Middleware
// =============================

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(cookieParser());


// =============================
// Static Upload Folder
// =============================

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);


// =============================
// Routes
// =============================

const authRoutes =
    require("./routes/authRoutes");

const productRoutes =
    require("./uploads/routes/productRoutes");

const cartRoutes =
    require("./routes/cartRoutes");

const orderRoutes =
    require("./routes/orderRoutes");

const adminRoutes =
    require("./routes/adminRoutes");


// =============================
// API Routes
// =============================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/products",
    productRoutes
);

app.use(
    "/api/cart",
    cartRoutes
);

app.use(
    "/api/orders",
    orderRoutes
);

app.use(
    "/api/admin",
    adminRoutes
);


// =============================
// Home Route
// =============================

app.get("/", (req, res) => {

    res.json({

        success: true,

        message:
            "🚀 Shree Charbhuja Icecream API Running"

    });

});


// =============================
// Server
// =============================

const PORT =
    process.env.PORT || 5000;

app.listen(
    PORT,
    () => {

        console.log(
            `✅ Server Running on Port ${PORT}`
        );

    }
);