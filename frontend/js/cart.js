const table = document.getElementById("cartTable");
const grandTotal = document.getElementById("grandTotal");

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    alert("Please Login First");
    window.location.href = "login.html";
}

const userId = user.id;

async function loadCart() {

    const res = await fetch(`http://localhost:5000/api/cart/${userId}`);

    const data = await res.json();

    table.innerHTML = "";

    let total = 0;

    if (!data.success || data.cart.length === 0) {

        table.innerHTML = `
        <tr>
            <td colspan="6" class="text-center">
                <h4>🛒 Your Cart is Empty</h4>
            </td>
        </tr>`;

        grandTotal.innerHTML = "0";

        return;
    }

    data.cart.forEach(item => {

        const subtotal = Number(item.price) * item.quantity;

        total += subtotal;

        table.innerHTML += `

        <tr>

        <td>
            <img
            src="${item.image || 'https://picsum.photos/100?random=' + item.id}"
            width="80">
        </td>

        <td>${item.name}</td>

        <td>₹${item.price}</td>

        <td>

            <button
            class="btn btn-sm btn-danger"
            onclick="decrease(${item.id})">

            -

            </button>

            <b class="mx-2">${item.quantity}</b>

            <button
            class="btn btn-sm btn-success"
            onclick="increase(${item.id})">

            +

            </button>

        </td>

        <td>

            ₹${subtotal}

        </td>

        <td>

            <button
            class="btn btn-danger"
            onclick="removeItem(${item.id})">

            Remove

            </button>

        </td>

        </tr>

        `;

    });

    grandTotal.innerHTML = total;

}

async function increase(id){

    await fetch(`http://localhost:5000/api/cart/increase/${id}`,{

        method:"PUT"

    });

    loadCart();

}

async function decrease(id){

    await fetch(`http://localhost:5000/api/cart/decrease/${id}`,{

        method:"PUT"

    });

    loadCart();

}

async function removeItem(id){

    if(confirm("Remove this product?")){

        await fetch(`http://localhost:5000/api/cart/${id}`,{

            method:"DELETE"

        });

        loadCart();

    }

}

loadCart();