document.addEventListener('DOMContentLoaded', async () => {
  const searchBox = document.getElementById('searchInput');
  const resultsContainer = document.getElementById('search-results');

  if (!searchBox || !resultsContainer) {
    console.warn('Search input or results container not found on this page.');
    return;
  }

  const csvUrl = 'https://docs.google.com/spreadsheets/d/1z06jsVC54KkbyH_X3oGwmChEPyP1jrMl625LV5VP7Uw/export?format=csv';
  const response = await fetch(csvUrl);
  const text = await response.text();

  const rows = text.trim().split('\n').map(row => row.split(','));
  const headers = rows[0].map(h => h.trim().toLowerCase());
  const data = rows.slice(1);

  const products = data.map(row => {
    const item = {};
    headers.forEach((key, i) => item[key] = row[i].trim());
    return {
      title: item['title'],
      image: item['img'],
      link: item['link'],
      shuffleID: item['shuffleid']
    };
  });

  searchBox.addEventListener('input', () => {
    const query = searchBox.value.trim().toLowerCase();
    resultsContainer.innerHTML = '';

    const matches = products.filter(p =>
      p.title.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      resultsContainer.innerHTML = `<p>No results found for "${query}".</p>`;
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
      resultsContainer.appendChild(card);
    });
  });
});
