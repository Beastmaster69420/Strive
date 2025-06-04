const API_URL = "http://127.0.0.1:1338/api/activities";
const TYPE_API_URL = "http://127.0.0.1:1338/api/types";

// Fetch all activities and display them
async function fetchData() {
  try {
    const response = await fetch(API_URL + "?populate=type");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const json = await response.json();
    displayData(json.data);
  } catch (error) {
    console.error("Fetch error:", error);
    document.getElementById("output").textContent = "Error fetching data.";
  }
}

async function populateTypeOptions() {
  const typeSelect = document.getElementById("type");
  try {
    const response = await fetch(TYPE_API_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const json = await response.json();
    typeSelect.innerHTML = '<option value="">Select type</option>';
    json.data.forEach((type) => {
      const option = document.createElement("option");
      option.value = type.id;
      option.textContent = type.Name; // <-- Use type.Name instead of type.attributes.Name
      typeSelect.appendChild(option);
    });
  } catch (error) {
    typeSelect.innerHTML = '<option value="">Error loading types</option>';
  }
}

// Fetch a single activity and fill the form for editing
async function getRecord(id) {
  try {
    const response = await fetch(`${API_URL}/${id}?populate=type`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const json = await response.json();
    fillForm(json.data);
  } catch (error) {
    console.error("Fetch error:", error);
    document.getElementById("output").textContent = "Error fetching record.";
  }
}

// Create a new activity
async function createRecord(data) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    fetchData();
  } catch (error) {
    console.error("Create error:", error);
    alert("Error creating record.");
  }
}

// Update an existing activity
async function updateRecord(id, data) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    fetchData();
  } catch (error) {
    console.error("Update error:", error);
    alert("Error updating record.");
  }
}

// Delete an activity
async function deleteRecord(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    fetchData();
  } catch (error) {
    console.error("Delete error:", error);
    alert("Error deleting record.");
  }
}

// Display all activities
function displayData(data) {
  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = "";

  if (Array.isArray(data)) {
    data.forEach((item) => {
      const id = item.id;
      const attrs = item;
      const typeName = item.type?.data?.attributes?.Name || "N/A";
      const div = document.createElement("div");
      div.className = "runner-card";
      div.innerHTML = `
        <h3>Distance: ${attrs.Distance ?? "N/A"} km</h3>
        <p>Duration: ${attrs.Duration ?? "N/A"} mins</p>
        <p>Date: ${attrs.Date ?? "N/A"}</p>
        <p>Type: ${typeName}</p>
        <p>Description: ${attrs.Description ?? "N/A"}</p>
        <button onclick="editRecord(${id})">Edit</button>
        <button onclick="deleteRecord(${id})">Delete</button>
      `;
      outputDiv.appendChild(div);
    });
  } else {
    outputDiv.textContent = "No data available.";
  }
}

// Fill the form for editing
function fillForm(data) {
  document.getElementById("record-id").value = data.id;
  document.getElementById("distance").value = data.Distance ?? "";
  document.getElementById("duration").value = data.Duration ?? "";
  document.getElementById("date").value = data.Date ?? "";
  document.getElementById("type").value = data.type?.data?.id ?? "";
  document.getElementById("description").value = data.Description ?? "";
  document.getElementById("submit-btn").textContent = "Update";
  document.getElementById("cancel-btn").style.display = "inline";
}

// Reset the form
function resetForm() {
  document.getElementById("runner-form").reset();
  document.getElementById("record-id").value = "";
  document.getElementById("submit-btn").textContent = "Add";
  document.getElementById("cancel-btn").style.display = "none";
}

// Called by Edit button
window.editRecord = function (id) {
  getRecord(id);
};

// Called by Delete button
window.deleteRecord = deleteRecord;

// Handle form submit
document.getElementById("runner-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const id = document.getElementById("record-id").value;
  const data = {
    Distance: document.getElementById("distance").value,
    Duration: document.getElementById("duration").value,
    Date: document.getElementById("date").value,
    type: document.getElementById("type").value
      ? document.getElementById("type").value
      : null,
    Description: document.getElementById("description").value,
  };
  // Strapi expects the relation as an ID, not as an object
  if (id) {
    updateRecord(id, data).then(resetForm);
  } else {
    createRecord(data).then(resetForm);
  }
});

// Handle cancel button
document.getElementById("cancel-btn").addEventListener("click", function () {
  resetForm();
});

// On page load, populate types and fetch activities
document.addEventListener("DOMContentLoaded", () => {
  populateTypeOptions();
  fetchData();
});
