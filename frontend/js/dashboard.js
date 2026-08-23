// =====================================
// USER AUTHENTICATION
// =====================================

const user = JSON.parse(
    localStorage.getItem("user")
);

if (!user) {

    window.location.href = "login.html";

}


// =====================================
// SHOW USERNAME
// =====================================

const username =
    document.getElementById("username");

if (username) {

    username.innerText =
        user.name || "User";

}


// =====================================
// LOAD CART COUNT
// =====================================

async function loadCartCount() {

    try {

        const res = await fetch(
            `http://localhost:5000/api/cart/${user.id}`
        );

        const data = await res.json();

        const cartCount =
            document.getElementById("cartCount");

        if (cartCount) {

            cartCount.innerText =
                data.cart
                    ? data.cart.length
                    : 0;

        }

    }

    catch (err) {

        console.error(
            "Cart Error:",
            err
        );

    }

}


// =====================================
// LOAD USER ORDERS
// =====================================

async function loadUserOrders() {

    const table =
        document.getElementById(
            "recentUserOrders"
        );


    // Agar HTML me order table nahi hai
    if (!table) {

        console.log(
            "recentUserOrders table not found"
        );

        return;

    }


    try {

        const response =
            await fetch(
                `http://localhost:5000/api/orders/${user.id}`
            );


        const data =
            await response.json();


        console.log(
            "User Orders:",
            data
        );


        if (!data.success) {

            table.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        class="text-center text-danger"
                    >

                        Unable to load orders

                    </td>

                </tr>

            `;

            return;

        }


        const orders =
            data.orders || [];


        // =================================
        // NO ORDERS
        // =================================

        if (
            orders.length === 0
        ) {

            table.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        class="text-center text-muted"
                    >

                        <i
                            class="bi bi-bag-x"
                            style="font-size:30px;"
                        ></i>

                        <br>

                        No orders yet

                        <br>

                        <a
                            href="products.html"
                            class="btn btn-warning btn-sm mt-2"
                        >

                            Start Shopping

                        </a>

                    </td>

                </tr>

            `;

            return;

        }


        // =================================
        // LATEST 5 ORDERS
        // =================================

        const recentOrders =
            orders.slice(0, 5);


        table.innerHTML = "";


        recentOrders.forEach(
            order => {


                // =================================
                // STATUS BADGE
                // =================================

                let badgeClass =
                    "bg-warning text-dark";


                if (
                    order.status ===
                    "Confirmed"
                ) {

                    badgeClass =
                        "bg-primary";

                }


                else if (
                    order.status ===
                    "Preparing"
                ) {

                    badgeClass =
                        "bg-info text-dark";

                }


                else if (
                    order.status ===
                    "Delivered"
                ) {

                    badgeClass =
                        "bg-success";

                }


                else if (
                    order.status ===
                    "Cancelled"
                ) {

                    badgeClass =
                        "bg-danger";

                }


                // =================================
                // DATE
                // =================================

                let orderDate = "-";


                if (order.created_at) {

                    orderDate =
                        new Date(
                            order.created_at
                        ).toLocaleDateString(
                            "en-IN"
                        );

                }


                // =================================
                // ADD ROW
                // =================================

                table.innerHTML += `

                    <tr>

                        <td>

                            <strong>

                                #${order.id}

                            </strong>

                        </td>


                        <td>

                            ₹${Number(
                                order.total_amount || 0
                            ).toFixed(2)}

                        </td>


                        <td>

                            ${
                                order.payment_method
                                || "-"
                            }

                        </td>


                        <td>

                            <span
                                class="badge ${badgeClass}"
                            >

                                ${
                                    order.status
                                    || "Pending"
                                }

                            </span>

                        </td>


                        <td>

                            ${orderDate}

                        </td>

                    </tr>

                `;

            }
        );


    }

    catch (error) {

        console.error(
            "Orders Error:",
            error
        );


        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="text-center text-danger"
                >

                    Unable to connect to server

                </td>

            </tr>

        `;

    }

}


// =====================================
// LOGOUT
// =====================================

function logout() {

    localStorage.removeItem(
        "user"
    );

    localStorage.removeItem(
        "token"
    );


    alert(
        "Logged Out Successfully"
    );


    window.location.href =
        "login.html";

}


// =====================================
// LOAD DASHBOARD
// =====================================

loadCartCount();

loadUserOrders();