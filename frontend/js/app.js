// ==============================
// Shree Charbhuja Icecream
// app.js
// ==============================

// Sticky Navbar Shadow
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 50) {
        navbar.classList.add("shadow-lg");
    } else {
        navbar.classList.remove("shadow-lg");
    }
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            target.scrollIntoView({
                behavior: "smooth"
            });
        }

    });
});

// Cart Counter
let cartCount = localStorage.getItem("cartCount") || 0;

const cartBadge = document.getElementById("cartCount");

if (cartBadge) {
    cartBadge.innerText = cartCount;
}

// Add To Cart Buttons
const cartButtons = document.querySelectorAll(".btn-warning");

cartButtons.forEach(button => {

    if (button.innerText.includes("Add")) {

        button.addEventListener("click", () => {

            cartCount++;

            localStorage.setItem("cartCount", cartCount);

            if (cartBadge) {
                cartBadge.innerText = cartCount;
            }

            alert("🍦 Product Added To Cart");

        });

    }

});

// Scroll Reveal Animation
const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.style.opacity = 1;
            entry.target.style.transform = "translateY(0px)";

        }

    });

}, {
    threshold: 0.2
});

document.querySelectorAll(".card").forEach(card => {

    card.style.opacity = 0;
    card.style.transform = "translateY(40px)";
    card.style.transition = "0.8s";

    observer.observe(card);

});

// Footer Year
const footer = document.querySelector("footer p:last-child");

if (footer) {

    footer.innerHTML =
        `© ${new Date().getFullYear()} Shree Charbhuja Icecream. All Rights Reserved.`;

}

console.log("🍦 Shree Charbhuja Icecream Loaded Successfully");