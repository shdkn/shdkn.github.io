async function fetchCatalog() {
  const csvUrl = 'https://docs.google.com/spreadsheets/d/1z06jsVC54KkbyH_X3oGwmChEPyP1jrMl625LV5VP7Uw/export?format=csv'; // Replace with your actual link
  const response = await fetch(csvUrl);
  const text = await response.text();

  const rows = text.trim().split('\n').map(row => row.split(','));
  const headers = rows[0].map(h => h.trim().toLowerCase());
  const data = rows.slice(1);

  const products = data.map(row => {
    const item = {};
    headers.forEach((key, i) => item[key] = row[i].trim());
    return item;
  });

  return products;
}

function renderResults(products, query) {
  const container = document.getElementById('search-results');
  container.innerHTML = '';

  const matches = products.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  if (matches.length === 0) {
    container.innerHTML = `<p>No results found for "${query}".</p>`;
    return;
  }

  matches.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <a href="${product.link}" target="_blank">
        <img src="${product.image}" alt="${product.title}" />
        <h3>${product.title}</h3>
      </a>
    `;
    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const searchBox = document.getElementById('search-box');
  const products = await fetchCatalog();

  searchBox.addEventListener('input', () => {
    const query = searchBox.value.trim();
    renderResults(products, query);
  });
});
