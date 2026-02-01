const URL = "https://opensheet.elk.sh/1rZl8CqkD83b2IS2zJY6ieS_3VhZEZ-fBALFMrluTuKc/Sheet1";

// Define categories (top-level only for filtering)
const categories = [
  "All",
  "Ethnic Wear",
  "Western Wear",
  "Innerwear & Loungewear",
  "Bottom Wear",
  "Seasonal Wear",
  "Party & Occasion Wear",
  "Accessories"
];

let allProducts = [];
let currentFilter = "All";

// Populate category bar
const categoryFilter = document.getElementById("categoryFilter");
categories.forEach(cat => {
  const btn = document.createElement("button");
  btn.className = "category-btn";
  btn.textContent = cat;
  btn.addEventListener("click", () => filterProducts(cat));
  if (cat === "All") btn.classList.add("active");
  categoryFilter.appendChild(btn);
});

// Fetch and render products
fetch(URL)
  .then(res => res.json())
  .then(data => {
    allProducts = data.filter(item => item.name); // Filter out empty rows
    renderProducts(allProducts);
  })
  .catch(err => {
    document.getElementById("products").innerHTML = "<h2 style='text-align:center; color:#ff5f9e;'>Error loading products. Please try again.</h2>";
    console.error(err);
  });

// Render products
function renderProducts(products) {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "";

  if (products.length === 0) {
    productsContainer.innerHTML = "<p style='text-align:center; grid-column:1/-1;'>No products found in this category.</p>";
    return;
  }

  products.forEach(item => {
    const imageSrc = item.image || "https://via.placeholder.com/280x250/f0f0f0/888?text=No+Image"; // Placeholder
    const badge = Math.random() > 0.7 ? (Math.random() > 0.5 ? "New" : "Trending") : ""; // Random badge
    const whatsappLink = `https://wa.me/1234567890?text=Hi, I'm interested in ${item.name} for ₹${item.price}. Can you provide more details?`; // Customize phone number

    productsContainer.innerHTML += `
      <div class="card">
        ${badge ? `<span class="badge">${badge}</span>` : ""}
        <img src="${imageSrc}" alt="${item.name}" loading="lazy" />
        <div class="card-body">
          <h3>${item.name}</h3>
          <span class="category-tag">${item.category || "Uncategorized"}</span>
          <p class="price">₹${item.price}</p>
          <p class="desc">${item.description || "No description available."}</p>
          <a href="${whatsappLink}" class="whatsapp-btn" target="_blank">Enquire / Order Now</a>
        </div>
      </div>
    `;
  });
}

// Filter products
function filterProducts(category) {
  currentFilter = category;
  // Update active button
  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.textContent === category) btn.classList.add("active");
  });

  const filtered = category === "All" ? allProducts : allProducts.filter(item => item.category === category);
  renderProducts(filtered);
}
