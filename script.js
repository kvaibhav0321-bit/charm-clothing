const SHEET_ID = "1rZl8CqkD83b2IS2zJY6ieS_3VhZEZ-fBALFMrluTuKc";
const SHEET_NAME = "Sheet1";

const URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

const productsDiv = document.getElementById("products");
const categoryBar = document.getElementById("categoryFilter");

let allProducts = [];

fetch(URL)
  .then(res => res.json())
  .then(data => {
    allProducts = data.filter(p => p.name);
    createCategories(allProducts);
    renderProducts(allProducts);
  });

function createCategories(products) {
  const categories = ["All", ...new Set(products.map(p => p.category))];

  categories.forEach((cat, index) => {
    const btn = document.createElement("button");
    btn.className = "category-btn" + (index === 0 ? " active" : "");
    btn.textContent = cat;

    btn.onclick = () => {
      document.querySelectorAll(".category-btn")
        .forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      if (cat === "All") {
        renderProducts(allProducts);
      } else {
        renderProducts(allProducts.filter(p => p.category === cat));
      }
    };

    categoryBar.appendChild(btn);
  });
}

function renderProducts(products) {
  productsDiv.innerHTML = "";

  products.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    const imgSrc = item.image && item.image.startsWith("http")
      ? item.image
      : "https://via.placeholder.com/400x500?text=Charm+Clothing";

    card.innerHTML = `
      <img src="${imgSrc}" alt="${item.name}">
      <div class="card-body">
        <h3>${item.name}</h3>
        <div class="price">₹${item.price}</div>
        <div class="desc">${item.description || ""}</div>
        <a class="whatsapp-btn"
           href="https://wa.me/91XXXXXXXXXX?text=I%20am%20interested%20in%20${encodeURIComponent(item.name)}"
           target="_blank">
           Enquire on WhatsApp
        </a>
      </div>
    `;

    productsDiv.appendChild(card);
  });
}
