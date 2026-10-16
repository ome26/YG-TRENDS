document.addEventListener("DOMContentLoaded", function(){

let isLoggedIn = localStorage.getItem("userId");

let loginBtn = document.getElementById("loginBtn");
let adminBtn = document.getElementById("adminBtn");

let ordersBtn = document.querySelector(".myorders-btn");
let cartIcon = document.querySelector(".cart-icon");
let logoutBtn = document.querySelector(".logout-btn");
let profile = document.querySelector(".profile-container");

if(isLoggedIn){
  // Logged in
  if(loginBtn) loginBtn.style.display = "none";
  if(adminBtn) adminBtn.style.display = "none";

  if(ordersBtn) ordersBtn.style.display = "inline-block";
  if(cartIcon) cartIcon.style.display = "block";
  if(logoutBtn) logoutBtn.style.display = "inline-block";
  if(profile) profile.style.display = "block";

}else{
  // Not logged in
  if(loginBtn) loginBtn.style.display = "inline-block";
  if(adminBtn) adminBtn.style.display = "inline-block";

  if(ordersBtn) ordersBtn.style.display = "none";
  if(cartIcon) cartIcon.style.display = "none";
  if(logoutBtn) logoutBtn.style.display = "none";
  if(profile) profile.style.display = "none";
}

});
// ================= TOGGLE BETWEEN STITCHING AND READYMADE =================

// Get toggle buttons
const tailorBtn = document.getElementById("tailorBtn");
const readyBtn = document.getElementById("readyBtn");

// Get sections
const tailorSection = document.getElementById("tailorSection");
const readySection = document.getElementById("readySection");

// Hide readymade section initially
readySection.style.display = "none";

// When user clicks Stitching
tailorBtn.onclick = function(){

tailorSection.style.display = "block";
readySection.style.display = "none";

tailorBtn.classList.add("active");
readyBtn.classList.remove("active");

}

// When user clicks Readymade
readyBtn.onclick = function(){

tailorSection.style.display = "none";
readySection.style.display = "block";

readyBtn.classList.add("active");
tailorBtn.classList.remove("active");

}



// ================= STITCHING IMAGE GALLERY =================

// Changes main image when thumbnail is clicked
function changeImage(element){

let card = element.closest(".card");     // find the card
let mainImage = card.querySelector(".main-img"); // main image inside card

mainImage.src = element.src;             // replace image

}



// ================= READYMADE PRODUCT IMAGE HOVER =================

// When mouse hovers product, images change automatically
const readymadeCards = document.querySelectorAll(".readymade-card");

readymadeCards.forEach(card => {

let img = card.querySelector(".product-img");
let images = img.dataset.images.split(",");

let index = 0;
let interval;

card.addEventListener("mouseenter", () => {

interval = setInterval(() => {

index = (index + 1) % images.length;
img.src = images[index];

},1500);

});

card.addEventListener("mouseleave", () => {

clearInterval(interval);
img.src = images[0];

});

});



// ================= CART SYSTEM =================

// Load cart from browser storage
let cart = JSON.parse(localStorage.getItem("cart")) || [];



// Cart counter in header
const cartDisplay = document.getElementById("cartCount");

// Show cart quantity
cartDisplay.textContent = cart.length;


const cards = document.querySelectorAll(".readymade-card");

cards.forEach(card => {

let selectedSize = null;

// size selection
card.querySelectorAll(".size-option").forEach(size => {
size.addEventListener("click", () => {
card.querySelectorAll(".size-option").forEach(s => s.classList.remove("selected"));
size.classList.add("selected");
selectedSize = size.dataset.size;
});
});

// 🔥 FIX: correct button selection
const button = card.querySelector("button");

button.onclick = function(){

console.log("Add to cart clicked");

if(!selectedSize){
alert("Please select a size first");
return;
}

let name = card.querySelector("h3").innerText;
let price = card.querySelector("p").innerText;
let image = card.querySelector(".img-container img").src;

let cart = JSON.parse(localStorage.getItem("cart")) || [];

cart.push({
name:name,
price:price,
size:selectedSize,
image:image
});

localStorage.setItem("cart", JSON.stringify(cart));

cartDisplay.textContent = cart.length;

alert("Added to cart");

};

});



// ================= GO TO CHECKOUT PAGE =================

function goToCart(){
window.location.href = "checkout.html";
}

function logout(){

localStorage.removeItem("userId");   // ✅ correct
localStorage.removeItem("userName"); // optional

window.location.href = "login.html";

}

let name = localStorage.getItem("userName");
let email = localStorage.getItem("userEmail");

console.log("FINAL NAME:", name);

let nameEl = document.getElementById("profileName");
let emailEl = document.getElementById("profileEmail");

if(nameEl){
nameEl.innerHTML = "Welcome, " + (name || "User") 
}

if(emailEl){
emailEl.innerText = email || "";
}
//profile circle
let circle = document.getElementById("profileCircle");

if(circle && name){
circle.innerText = name.charAt(0).toUpperCase();
}
function checkLoginAndBook(){
  if(!localStorage.getItem("userId")){
    alert("Please login first");
    window.location.href = "login.html";
  }else{
    window.location.href = "booking.html";
  }
}

