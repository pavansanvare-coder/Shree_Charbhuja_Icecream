const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "login.html";
}

document.getElementById("username").innerText = user.name;

async function loadCartCount() {

    try {

        const res = await fetch(`http://localhost:5000/api/cart/${user.id}`);

        const data = await res.json();

        document.getElementById("cartCount").innerText = data.cart.length;

    } catch (err) {

        console.log(err);

    }

}

function logout() {

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    alert("Logged Out Successfully");

    window.location.href = "login.html";

}

loadCartCount();