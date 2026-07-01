const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const user = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value.trim()
    };

    try {

        const res = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        const data = await res.json();

        if (data.success) {
            alert("✅ Registration Successful");
            window.location.href = "login.html";
        } else {
            alert(data.message);
        }

    } catch (error) {
        console.error(error);
        alert("❌ Server Error");
    }

});