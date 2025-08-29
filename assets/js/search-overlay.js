document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const overlay = document.getElementById("searchOverlay");
  const resultsContainer = document.getElementById("search-results");

  async function fetchSearchData() {
    try {
      const response = await fetch("https://sheetdata.com/api/search-data");
      return await response.json();
    } catch (error) {
      console.error("Search data fetch failed:", error);
      return [];
    }
  }

  function filterResults(data, query) {
    return data.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  function renderResults(filtered) {
    resultsContainer.innerHTML = "";
    if (filtered.length === 0) {
      resultsContainer.innerHTML = "<p>No results found.</p>";
      return;
    }

    filtered.forEach((item) => {
      const result = document.createElement("div");
      result.className = "search-result";
      result.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <div>
          <h4>${item.name}</h4>
          <p>${item.price}</p>
        </div>
      `;
      resultsContainer.appendChild(result);
    });
  }

  searchInput.addEventListener("input", async (e) => {
    const query = e.target.value;
    if (!query) {
      resultsContainer.innerHTML = "";
      return;
    }

    const data = await fetchSearchData();
    const filtered = filterResults(data, query);
    renderResults(filtered);
  });

  searchInput.addEventListener("focus", () => {
    overlay.classList.remove("hidden");
  });

  overlay.addEventListener("click", (e) => {
    if (e.target.id === "searchOverlay") {
      overlay.classList.add("hidden");
      searchInput.value = "";
      resultsContainer.innerHTML = "";
    }
  });
});
