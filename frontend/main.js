const API_URL = "http://127.0.0.1:1338/api/activity";

async function fetchData() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const json = await response.json();
    displayData(json.data);
  } catch (error) {
    console.error("Fetch error:", error);
    document.getElementById("output").textContent = "Error fetching data.";
  }
}

function displayData(data) {
  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = "";

  // Check if data is an array or single object
  if (Array.isArray(data)) {
    // If array, loop through all items
    data.forEach((item) => {
      const { Distance = "N/A", Duration = "N/A" } = item.attributes || {};
      const div = document.createElement("div");
      div.className = "runner-card";
      div.innerHTML = `
        <h3>Distance: ${Distance} km</h3>
        <p>Duration: ${Duration} mins</p>
      `;
      outputDiv.appendChild(div);
    });
  } else if (data && typeof data === "object") {
    // If single object, just display one card
    const { Distance = "N/A", Duration = "N/A" } =
      data.attributes || data || {};
    const div = document.createElement("div");
    div.className = "runner-card";
    div.innerHTML = `
      <h3>Distance: ${Distance} km</h3>
      <p>Duration: ${Duration} mins</p>
    `;
    outputDiv.appendChild(div);
  } else {
    outputDiv.textContent = "No data available.";
  }
}

document.addEventListener("DOMContentLoaded", fetchData);
