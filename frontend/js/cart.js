const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "login.html";
}

const userId = user.id;

const cartContainer = document.getElementById("cartContainer");
const totalItems = document.getElementById("totalItems");
const totalAmount = document.getElementById("totalAmount");
const grandTotal = document.getElementById("grandTotal");

async function loadCart() {

    try {

        const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
        const data = await res.json();

        cartContainer.innerHTML = "";

        let items = 0;
        let total = 0;

        if (data.cart.length === 0) {

            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="bi bi-cart-x"></i>
                    <h3>Your Cart is Empty</h3>
                    <p>Add some delicious ice creams.</p>

                    <a href="products.html"
                       class="btn btn-warning mt-3">

                       Browse Products

                    </a>
                </div>
            `;

            totalItems.innerText = "0";
            totalAmount.innerText = "₹0";
            grandTotal.innerText = "₹0";

            return;
        }

        data.cart.forEach(item => {

            items += item.quantity;

            const subTotal = Number(item.price) * item.quantity;

            total += subTotal;

            cartContainer.innerHTML += `

            <div class="cart-item">

                <img src="${item.image || 'https://picsum.photos/200?random=' + item.id}">

                <div class="cart-details">

                    <h4>${item.name}</h4>

                    <div class="cart-category">

                        Premium Ice Cream

                    </div>

                    <div class="cart-price">

                        ₹${item.price}

                    </div>

                    <div class="quantity-box">

                        <button
                        class="qty-btn"
                        onclick="decrease(${item.id})">

                        -

                        </button>

                        <span class="qty">

                        ${item.quantity}

                        </span>

                        <button
                        class="qty-btn"
                        onclick="increase(${item.id})">

                        +

                        </button>

                    </div>

                    <button
                    class="remove-btn"
                    onclick="removeItem(${item.id})">

                    Remove

                    </button>

                </div>

            </div>

            `;

        });

        totalItems.innerText = items;

        totalAmount.innerText = `₹${total}`;

        grandTotal.innerText = `₹${total}`;

    } catch (err) {

        console.log(err);

    }

}

// Increase Quantity
async function increase(id) {

    await fetch(`http://localhost:5000/api/cart/increase/${id}`, {
        method: "PUT"
    });

    loadCart();

}

// Decrease Quantity
async function decrease(id) {

    await fetch(`http://localhost:5000/api/cart/decrease/${id}`, {
        method: "PUT"
    });

    loadCart();

}

// Remove Item
async function removeItem(id) {

    if (!confirm("Remove this item from cart?")) return;

    await fetch(`http://localhost:5000/api/cart/${id}`, {
        method: "DELETE"
    });

    loadCart();

}

loadCart();