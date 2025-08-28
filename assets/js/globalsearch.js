async function fetchCatalog() {
  const csvUrl = 'const csvUrl = 'https://docs.google.com/spreadsheets/d/1z06jsVC54KkbyH_X3oGwmChEPyP1jrMl625LV5VP7Uw/export?format=csv'; // Replace with your actual link
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

  return products;
}
