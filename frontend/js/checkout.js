const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "login.html";
}

const summary = document.getElementById("summary");
const total = document.getElementById("total");
const form = document.getElementById("checkoutForm");

let cartItems = [];
let grandTotal = 0;

// ======================
// Load Cart
// ======================
async function loadCart() {

    try {

        console.log("User:", user);

        const res = await fetch(`http://localhost:5000/api/cart/${user.id}`);
        const data = await res.json();

        console.log("Cart Response:", data);

        cartItems = data.cart || [];

        summary.innerHTML = "";
        grandTotal = 0;

        if (cartItems.length === 0) {

            summary.innerHTML = `
                <div class="alert alert-warning">
                    Your cart is empty.
                </div>
            `;

            total.innerText = "₹0";
            return;
        }

        cartItems.forEach(item => {

            const subtotal = Number(item.price) * Number(item.quantity);

            grandTotal += subtotal;

            summary.innerHTML += `
                <div class="summary-item">
                    <span>${item.name} × ${item.quantity}</span>
                    <span>₹${subtotal}</span>
                </div>
            `;

        });

        total.innerText = `₹${grandTotal}`;

    } catch (err) {

        console.error("Load Cart Error:", err);

    }

}

loadCart();

// ======================
// Place Order
// ======================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (cartItems.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    const order = {

        user_id: user.id,

        fullname: document.getElementById("fullname").value,

        mobile: document.getElementById("mobile").value,

        address: document.getElementById("address").value,

        city: document.getElementById("city").value,

        pincode: document.getElementById("pincode").value,

        payment_method: document.getElementById("payment").value,

        total_amount: grandTotal

    };

    try {

        const res = await fetch("http://localhost:5000/api/orders", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(order)

        });

        const data = await res.json();

        console.log("Order Response:", data);

        if (data.success) {

            alert(data.message || "🎉 Order Placed Successfully");

            window.location.href = "orders.html";

        } else {

            alert(data.message || "Order Failed");

        }

    } catch (err) {

        console.error("Order Error:", err);

        alert("Server Error");

    }

});

// ======================
// Logout
// ======================

function logout() {

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.href = "login.html";

}