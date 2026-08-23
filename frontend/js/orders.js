const user = JSON.parse(localStorage.getItem("user"));

if (!user) {

window.location.href="login.html";

}

const container=document.getElementById("ordersContainer");

async function loadOrders(){

const res=await fetch(`http://localhost:5000/api/orders/${user.id}`);

const data=await res.json();

container.innerHTML="";

if(data.orders.length===0){

container.innerHTML=`

<div class="card p-5 text-center">

<h3>No Orders Yet</h3>

<a href="products.html"

class="btn btn-warning mt-3">

Shop Now

</a>

</div>

`;

return;

}

data.orders.forEach(order=>{

let badge="pending";

if(order.status==="Preparing") badge="preparing";

if(order.status==="Delivered") badge="delivered";

if(order.status==="Cancelled") badge="cancelled";

container.innerHTML+=`

<div class="order-card">

<div class="row align-items-center">

<div class="col-md-3">

<div class="order-id">

Order #${order.id}

</div>

</div>

<div class="col-md-3">

₹${order.total_amount}

</div>

<div class="col-md-3">

<span class="status ${badge}">

${order.status}

</span>

</div>

<div class="col-md-3">

${new Date(order.created_at).toLocaleDateString()}

</div>

</div>

</div>

`;

});

}

function logout(){

localStorage.removeItem("user");

localStorage.removeItem("token");

window.location.href="login.html";

}

loadOrders();