document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("product-grid");
  const tabName = window.tabName; // Defined per page: "index", "menss", "womens", etc.

  if (typeof tabName === "undefined" || !tabName) {
    console.error("Missing tabName for sheet fetch");
    return;
  }

  async function loadProducts() {
    try {
      const response = await fetch(`https://sheetdata.com/api/${tabName}`);
      const data = await response.json();
      renderNextBatch(data);
    } catch (error) {
      console.error("Error loading products:", error);
      grid.innerHTML = "<p>Failed to load products.</p>";
    }
  }

  function renderNextBatch(products) {
    grid.innerHTML = ""; // Clear loading state
    products.forEach((item) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <h3>${item.name}</h3>
        <p>${item.price}</p>
      `;
      grid.appendChild(card);
    });
  }

  grid.innerHTML = "<p>Loading products...</p>";
  loadProducts();
});
