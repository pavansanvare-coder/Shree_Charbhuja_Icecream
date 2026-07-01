const container = document.getElementById("productContainer");
const search = document.getElementById("search");

let products = [];

async function loadProducts(){

    try{

        const res = await fetch("http://localhost:5000/api/products");

        const data = await res.json();

        products = data.products;

        displayProducts(products);

    }catch(err){

        console.log(err);

    }

}

function displayProducts(list){

    container.innerHTML="";

    list.forEach(product=>{

        container.innerHTML += `

        <div class="col-lg-4 col-md-6">

            <div class="product-card">

                <img src="https://picsum.photos/500/300?random=${product.id}">

                <div class="product-body">

                    <div class="product-title">
                        ${product.name}
                    </div>

                    <div class="product-category">
                        ${product.category}
                    </div>

                    <div class="rating">
                        ⭐⭐⭐⭐⭐
                    </div>

                    <div class="product-price">
                        ₹${product.price}
                    </div>

                    <button
                    class="btn btn-warning btn-cart"
                    onclick="addToCart(${product.id})">
                    Add To Cart
                    </button>

                </div>

            </div>

        </div>

        `;

    });

}

search.addEventListener("keyup",()=>{

    const value = search.value.toLowerCase();

    const filtered = products.filter(item=>

        item.name.toLowerCase().includes(value)

    );

    displayProducts(filtered);

});

loadProducts();

async function addToCart(productId) {

    try {

        const response = await fetch("http://localhost:5000/api/cart", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                user_id: userId,
                product_id: productId,
                quantity: 1
            })

        });

        const data = await response.json();

        if (data.success) {

            alert("🛒 Product Added To Cart");

            updateCartCount();

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.log(error);

        alert("Server Error");

    }

}

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    alert("Please login first.");
    window.location.href = "login.html";
}

const userId = user.id;

async function updateCartCount() {

    const res = await fetch(`http://localhost:5000/api/cart/${userId}`);

    const data = await res.json();

    document.getElementById("cartCount").innerHTML = data.cart.length;

}

updateCartCount();