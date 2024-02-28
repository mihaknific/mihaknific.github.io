// Get form and input elements
const form = document.getElementById("form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const formSuccess = document.getElementById("form-success");
// Clear the success message when the user starts typing
nameInput.addEventListener("input", () => (formSuccess.textContent = ""));
emailInput.addEventListener("input", () => (formSuccess.textContent = ""));
messageInput.addEventListener("input", () => (formSuccess.textContent = ""));
// Handle form submission
form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent form from being submitted
  // Get input values
  const name = nameInput.value;
  const email = emailInput.value;
  const message = messageInput.value;
  // Check if all fields are valid
  if (name && email && message) {
    // Reset the form and set focus back to the first field
    form.reset();
    nameInput.focus();
    // Show success message
    formSuccess.textContent = "Submission successful!";
    // Create the Google Form submission URL
    const link = `https://docs.google.com/forms/d/e/1FAIpQLSepx3Rwq1WoRNe3AAfvyLaq03z3_rnxef567HF44FHMkfMyww/formResponse?usp=pp_url&entry.123957752=${encodeURIComponent(
      name
    )}&entry.847471957=${encodeURIComponent(
      email
    )}&entry.1799288998=${encodeURIComponent(message)}&submit=Submit`;
    // Send a GET request to the Google Form
    fetch(link, {
      mode: "no-cors"
    });
  }
});
