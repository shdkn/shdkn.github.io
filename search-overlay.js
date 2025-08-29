async function loadProducts() {
  const sheetID = "1z06jsVC54KkbyH_X3oGwmChEPyP1jrMl625LV5VP7Uw";
  const tabName = "Links"; // Change to "search-data" when ready
  const url = `https://opensheet.elk.sh/${sheetID}/${tabName}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("Fetched products:", data);
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }
}
