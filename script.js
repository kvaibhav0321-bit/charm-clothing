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
  btn.addEventListener("click", () => {
    console.log(`Filtering to: ${cat}`); // Debug log
    filterProducts(cat);
  });
  if (cat === "All") btn.classList.add("active");
  categoryFilter.appendChild(btn);
});

// Add Reset Filters button
const resetBtn = document.createElement("button");
resetBtn.className = "category-btn";
resetBtn.textContent = "Reset Filters";
resetBtn.addEventListener("click", () => {
  document.getElementById("searchBar").value = "";
  document.getElementById("sortSelect").value = "default";
  filterProducts("All");
  renderProducts(allProducts);
});
categoryFilter.appendChild(resetBtn);

// Fetch products
fetch(URL)
  .then(res => res.json())
  .then(data => {
    allProducts = data.filter(item => item.name);
    console.log("Products loaded:", allProducts.length); // Debug log
    renderProducts(allProducts);
  })
  .catch(err => {
    document.getElementById("products").innerHTML = "<h2 style='color:#4A90E2;'>Error loading products. Please refresh.</h2>";
    console.error(err);
  });

// Render products
function renderProducts(products) {
  const container = document.getElementById("products");
  container.innerHTML = "";
  if (products.length === 0) {
    container.innerHTML = "<p style='text-align:center; color:#4A90E2;'>No products found in this category. Try 'Reset Filters'.</p>";
    return;
  }
  products.forEach(item => {
    const imageSrc = item.image ? `https://raw.githubusercontent.com/kvaibhav0321-bit/charm-clothing/main/${item.image}` : 'https://via.placeholder.com/280x250/E3F2FD/4A90E2?text=No+Image';
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${imageSrc}" alt="${item.name}" loading="lazy" onerror="console.log('Image failed to load: ${imageSrc}'); this.src='https://via.placeholder.com/280x250/E3F2FD/4A90E2?text=No+Image'" />
      <div class="card-body">
        <h3>${item.name}</h3>
        <span class="category-tag">${item.category || 'Uncategorized'}</span>
        <p class="price">₹${item.price}</p>
        <p class="desc">${item.description || 'No description.'}</p>
        ${item.product_code ? `<p class="product-code">Code: ${item.product_code}</p>` : ''}
        <button class="add-to-cart" data-id="${item.name}">Add to Cart</button>
      </div>
    `;
    card.addEventListener("click", (e) => {
      if (!e.target.classList.contains("add-to-cart")) openModal(item);
    });
    container.appendChild(card);
  });
  updateCartCount();
}

// Search
document.getElementById("searchBar").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query) || (p.description && p.description.toLowerCase().includes(query)));
  console.log(`Search results: ${filtered.length} for "${query}"`); // Debug log
  renderProducts(filtered);
});

// Sort
document.getElementById("sortSelect").addEventListener("change", (e) => {
  let sorted = [...allProducts];
  if (e.target.value === "price-low") sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  else if (e.target.value === "price-high") sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  console.log(`Sorted by: ${e.target.value}`); // Debug log
  renderProducts(sorted);
});

// Modal
function openModal(item) {
  const modal = document.getElementById("productModal");
  const imageSrc = item.image ? `https://raw.githubusercontent.com/kvaibhav0321-bit/charm-clothing/main/${item.image}` : 'https://via.placeholder.com/400x300/E3F2FD/4A90E2?text=No+Image';
  document.getElementById("modalDetails").innerHTML = `
    <img src="${imageSrc}" alt="${item.name}" />
    <h3>${item.name}</h3>
    <p>${item.description || 'No description.'}</p>
    <p>Sizes: ${item.sizes || 'S, M, L, XL'}</p>
    <p class="price">₹${item.price}</p>
    ${item.product_code ? `<p>Code: ${item.product_code}</p>` : ''}
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
    e.stopPropagation();
    const id = e.target.dataset.id;
    const product = allProducts.find(p => p.name === id);
    if (product) {
      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      alert("Added to cart!");
    } else {
      alert("Product not found!");
    }
  }
});

document.getElementById("cartBtn").addEventListener("click", () => {
  const modal = document.getElementById("cartModal");
  document.getElementById("cartItems").innerHTML = cart.length ? cart.map((item, index) => `<p>${index + 1}. ${item.name} - ₹${item.price}</p>`).join("") : "<p>Cart is empty.</p>";
  document.getElementById("totalItems").textContent = cart.length;
  modal.style.display = "block";
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) return alert("Cart is empty!");
  const message = cart.map(item => `${item.name} - ₹${item.price}`).join(", ");
  window.open(`https://wa.me/917972226093?text=Order: ${message}. Pay via GPay: +917972226093`, "_blank");
});

document.getElementById("clearCartBtn").addEventListener("click", () => {
  cart = [];
  localStorage.removeItem('cart');
  updateCartCount();
  document.getElementById("cartModal").style.display = "none";
  alert("Cart cleared!");
});

function updateCartCount() {
  document.getElementById("cartCount").textContent = cart.length;
}

function filterProducts(category) {
  currentFilter = category;
  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.textContent === category) btn.classList.add("active");
  });
  const filtered = category === "All" ? allProducts : allProducts.filter(item => item.category === category);
  console.log(`Filtered to ${category}: ${filtered.length} products`); // Debug log
  renderProducts(filtered);
}
