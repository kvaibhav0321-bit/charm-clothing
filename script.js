const URL = "https://opensheet.elk.sh/1rZl8CqkD83b2IS2zJY6ieS_3VhZEZ-fBALFMrluTuKc/Sheet1";

const categories = ["All", "Ethnic Wear", "Western Wear", "Innerwear & Loungewear", "Bottom Wear", "Seasonal Wear", "Party & Occasion Wear", "Accessories"];
let allProducts = [];
let currentFilter = "All";
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Populate categories
const categoryFilter = document.getElementById("categoryFilter");
categories.forEach(cat => {
  const btn = document.createElement("button");
  btn.className = "category-btn";
  btn.textContent = cat;
  btn.addEventListener("click", () => filterProducts(cat));
  if (cat === "All") btn.classList.add("active");
  categoryFilter.appendChild(btn);
});

// Fetch products
fetch(URL)
  .then(res => res.json())
  .then(data => {
    allProducts = data.filter(item => item.name);
    renderProducts(allProducts);
  })
  .catch(err => {
    document.getElementById("products").innerHTML = "<h2>Error loading products.</h2>";
  });

// Render products
function renderProducts(products) {
  const container = document.getElementById("products");
  container.innerHTML = "";
  products.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${item.image || 'https://via.placeholder.com/280x250'}" alt="${item.name}" loading="lazy" />
      <div class="card-body">
        <h3>${item.name}</h3>
        <span class="category-tag">${item.category || 'Uncategorized'}</span>
        <p class="price">₹${item.price}</p>
        <button class="add-to-cart" data-id="${item.name}">Add to Cart</button>
      </div>
    `;
    card.addEventListener("click", () => openModal(item));
    container.appendChild(card);
  });
  updateCartCount();
}

// Search
document.getElementById("searchBar").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
  renderProducts(filtered);
});

// Sort
document.getElementById("sortSelect").addEventListener("change", (e) => {
  let sorted = [...allProducts];
  if (e.target.value === "price-low") sorted.sort((a,b) => a.price - b.price);
  else if (e.target.value === "price-high") sorted.sort((a,b) => b.price - a.price);
  renderProducts(sorted);
});

// Modal
function openModal(item) {
  const modal = document.getElementById("productModal");
  document.getElementById("modalDetails").innerHTML = `
    <img src="${item.image || 'https://via.placeholder.com/400x300'}" alt="${item.name}" />
    <h3>${item.name}</h3>
    <p>${item.description}</p>
    <p>Sizes: ${item.sizes || 'S, M, L, XL'}</p>
    <p class="price">₹${item.price}</p>
    <button class="add-to-cart" data-id="${item.name}">Add to Cart</button>
  `;
  modal.style.display = "block";
}

document.querySelectorAll(".close").forEach(close => close.addEventListener("click", () => {
  document.getElementById("productModal").style.display = "none";
  document.getElementById("cartModal").style.display = "none";
}));

// Cart
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const id = e.target.dataset.id;
    const product = allProducts.find(p => p.name === id);
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  }
});

document.getElementById("cartBtn").addEventListener("click", () => {
  const modal = document.getElementById("cartModal");
  document.getElementById("cartItems").innerHTML = cart.map(item => `<p>${item.name} - ₹${item.price}</p>`).join("");
  modal.style.display = "block";
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  const message = cart.map(item => `${item.name} - ₹${item.price}`).join(", ");
  window.open(`https://wa.me/1234567890?text=Order: ${message}`, "_blank");
});

function updateCartCount() {
  document.getElementById("cartCount").textContent = cart.length;
}

function filterProducts(category) {
  // Same as before
}
