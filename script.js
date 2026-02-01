const SHEET_ID = "1rZl8CqkD83b2IS2zJY6ieS_3VhZEZ-fBALFMrluTuKc";
const SHEET_NAME = "Sheet1";

const URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

fetch(URL)
  .then(res => res.json())
  .then(data => {
    const products = document.getElementById("products");
    const filter = document.getElementById("categoryFilter");
    const categories = new Set();

    products.innerHTML = "";
    filter.innerHTML = `<option value="all">All Categories</option>`;

    data.forEach(item => {
      if (!item.name) return;

      categories.add(item.category);

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${item.image}">
        <h3>${item.name}</h3>
        <p>₹${item.price}</p>
        <small>${item.description}</small>
      `;
      products.appendChild(card);
    });

    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      filter.appendChild(option);
    });
  });
