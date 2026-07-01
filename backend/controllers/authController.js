
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



// Register User
exports.register =  async (req, res) => {
    console.log("BODY:", req.body);

    try {
        const { name, email,  password } = req.body;

        if (!name || !email  || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        db.query(
            "SELECT * FROM users WHERE email=?",
            [email],
            async (err, result) => {

                if (err) return res.status(500).json(err);

                if (result.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Email already exists"
                    });
                }
                console.log(req.body);
                const hashedPassword = await bcrypt.hash(password, 10);

               db.query(
    "INSERT INTO users(name,email,password) VALUES(?,?,?)",
    [name, email, hashedPassword],
    (err) => {

        if (err)
            return res.status(500).json(err);

        res.json({
            success: true,
            message: "Registration Successful"
        });

    }
);

            }
        );

    } catch (error) {
        res.status(500).json(error);
    }
};


// Login User

exports.login = (req, res) => {

    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        async (err, result) => {

            if (err) return res.status(500).json(err);

            if (result.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "User not found"
                });
            }

            const user = result[0];

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Password"
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "7d"
                }
            );

            res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });

        }
    );

};