let allProducts = [];

// 1. Load products from Google Sheet
async function loadProducts(tabName = "search-data") {
  const sheetID = "1z06jsVC54KkbyH_X3oGwmChEPyP1jrMl625LV5VP7Uw";
  const url = `https://opensheet.elk.sh/${sheetID}/${tabName}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    allProducts = data
      .filter(item => item.title && item.img && item.link)
      .sort((a, b) => Number(a.shuffleID) - Number(b.shuffleID));

    renderListView(allProducts); // Initial full render
  } catch (err) {
    console.error("Error loading products:", err);
  }
}

// 2. Render products in list view
function renderListView(products) {
  const container = document.getElementById("search-results");
  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = '<p>No products found.</p>';
    return;
  }

  products.forEach(item => {
    const card = document.createElement("div");
    card.className = "product-card list-item";
    card.innerHTML = `
      <img src="${item.img}" alt="${item.title}" />
      <div>
        <h3>${item.title}</h3>
        <a href="${item.link}" target="_blank" rel="noopener">View</a>
      </div>
    `;
    container.appendChild(card);
  });
}

// 3. Trigger overlay and focus input
const searchInput = document.getElementById("searchInput");
const overlay = document.getElementById("searchOverlay");
const overlayInput = document.getElementById("overlaySearchInput");

searchInput.addEventListener("click", () => {
  overlay.classList.remove("hidden");
  setTimeout(() => overlayInput.focus(), 100); // Auto-focus
  loadProducts(); // Load all products initially
});

// 4. Close overlay
document.getElementById("closeOverlay").addEventListener("click", () => {
  overlay.classList.add("hidden");
});

// 5. Live filtering as user types
overlayInput.addEventListener("input", () => {
  const query = overlayInput.value.toLowerCase();
  const results = allProducts.filter(item =>
    item.title.toLowerCase().includes(query)
  );
  renderListView(results);
});
