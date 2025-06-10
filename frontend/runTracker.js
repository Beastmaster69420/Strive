document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("runner-form");
    const dateInput = document.getElementById("date");
    const typeSelect = document.getElementById("type");
    const descInput = document.getElementById("description");
    const output = document.getElementById("output");
  
    // Autofill today's date
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
  
    // Dynamic description hint
    typeSelect.addEventListener("change", () => {
      const type = typeSelect.value;
      if (type) {
        descInput.placeholder = `Describe your ${type.toLowerCase()}...`;
      } else {
        descInput.placeholder = "Short note about activity";
      }
    });
  
    // Display fake output and feedback
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const distance = document.getElementById("distance").value;
      const duration = document.getElementById("duration").value;
      const date = dateInput.value;
      const type = typeSelect.value;
      const desc = descInput.value;
  
      output.innerHTML = `
        <div class="success">
          <strong>Activity Recorded:</strong><br>
          ${type} for ${distance} km in ${duration} mins on ${date}.<br>
          Description: ${desc}
        </div>
      `;
  
      form.reset();
      dateInput.value = today; // Reset date
    });
  });
  