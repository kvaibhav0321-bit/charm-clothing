const URL = "https://opensheet.elk.sh/1rZl8CqkD83b2IS2zJY6ieS_3VhZEZ-fBALFMrluTuKc/Sheet1";

fetch(URL)
  .then(res => res.json())
  .then(data => {
    const products = document.getElementById("products");
    products.innerHTML = "";

    data.forEach(item => {
      if (!item.name) return;

      products.innerHTML += `
        <div style="background:white;padding:15px;border-radius:10px">
          <h3>${item.name}</h3>
          <p>₹${item.price}</p>
          <p>${item.description}</p>
        </div>
      `;
    });
  })
  .catch(err => {
    document.body.innerHTML = "<h2>Error loading products</h2>";
    console.error(err);
  });
