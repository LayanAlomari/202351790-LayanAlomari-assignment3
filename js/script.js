// Greeting based on the time of day
const greeting = document.getElementById("greeting");
const hour = new Date().getHours();

if (hour < 12) {
  greeting.textContent = "Good morning!";
} else if (hour < 18) {
  greeting.textContent = "Good afternoon!";
} else {
  greeting.textContent = "Good evening!";
}

// Dark/light mode button
const themeButton = document.getElementById("theme-toggle");

// When the page opens, load the saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  themeButton.textContent = "Light Mode";
}

themeButton.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");

  // Update the button text and save the choice
  if (document.body.classList.contains("dark-mode")) {
    themeButton.textContent = "Light Mode";
    localStorage.setItem("theme", "dark");
  } else {
    themeButton.textContent = "Dark Mode";
    localStorage.setItem("theme", "light");
  }
});


// Live search for projects
const searchInput = document.getElementById("project-search");
const projectBoxes = document.querySelectorAll(".project-box");
const noResults = document.getElementById("no-results");

searchInput.addEventListener("input", function () {
  // Lowercase the text so the search ignores capital letters
  const searchText = searchInput.value.toLowerCase().trim();
  let matches = 0;

  projectBoxes.forEach(function (box) {
    // Check the search text against the title and description
    const boxText = box.textContent.toLowerCase();

    if (boxText.includes(searchText)) {
      box.hidden = false;
      matches++;
    } else {
      box.hidden = true;
    }
  });

  // Show the message only when no project matches
  noResults.hidden = matches > 0;
});


// Contact form: live checks, a character counter, and a Send button that
// stays disabled until every field is valid
const form = document.getElementById("contact-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const messageError = document.getElementById("message-error");
const formSuccess = document.getElementById("form-success");
const sendButton = document.getElementById("send-btn");
const sendHint = document.getElementById("send-hint");
const messageCount = document.getElementById("message-count");

const MAX_MESSAGE = 500;
const MIN_MESSAGE = 10;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Each check returns an error message, or "" when the field is fine
function checkName() {
  return nameInput.value.trim() === "" ? "Please enter your name." : "";
}

function checkEmail() {
  return emailPattern.test(emailInput.value.trim())
    ? ""
    : "Please enter a valid email, like name@example.com.";
}

function checkMessage() {
  return messageInput.value.trim().length < MIN_MESSAGE
    ? "Please write a message of at least " + MIN_MESSAGE + " characters."
    : "";
}

// Each field with its error element and its check
const fields = [
  { input: nameInput, error: nameError, check: checkName },
  { input: emailInput, error: emailError, check: checkEmail },
  { input: messageInput, error: messageError, check: checkMessage }
];

// Enable Send only when all fields pass, and hide the hint when it is enabled
function updateSendButton() {
  const allValid = fields.every(function (field) {
    return field.check() === "";
  });
  sendButton.disabled = !allValid;
  sendHint.hidden = allValid;
}

function updateCounter() {
  messageCount.textContent = messageInput.value.length + " / " + MAX_MESSAGE;
}

fields.forEach(function (field) {
  // While typing: clear the error once the field is valid, then update the button
  field.input.addEventListener("input", function () {
    if (field.check() === "") {
      field.error.textContent = "";
    }
    updateSendButton();
  });

  // When leaving the field: show its error if it is wrong
  field.input.addEventListener("blur", function () {
    field.error.textContent = field.check();
  });
});

messageInput.addEventListener("input", updateCounter);

form.addEventListener("submit", function (event) {
  // Stop the page from reloading
  event.preventDefault();
  formSuccess.hidden = true;

  // Check every field again before accepting the form
  let isValid = true;
  fields.forEach(function (field) {
    const message = field.check();
    field.error.textContent = message;
    if (message !== "") {
      isValid = false;
    }
  });

  if (!isValid) {
    return;
  }

  // Everything is valid: confirm, then clear the form
  formSuccess.textContent = "Thanks, " + nameInput.value.trim() + "! Your message was submitted.";
  formSuccess.hidden = false;
  form.reset();
  updateCounter();
  updateSendButton();
});

// Set the starting state
updateCounter();
updateSendButton();

// Quotes: fetch a random quote from the DummyJSON API
const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const quoteButton = document.getElementById("new-quote-btn");
const quoteStatus = document.getElementById("quote-status");

async function loadQuote() {
  // Show a loading message and stop double clicks while we wait
  quoteStatus.textContent = "Loading quote...";
  quoteButton.disabled = true;

  try {
    const response = await fetch("https://dummyjson.com/quotes/random");

    // fetch does not fail on HTTP errors by itself, so we check
    if (!response.ok) {
      throw new Error("Server responded with status " + response.status);
    }

    const data = await response.json();
    quoteText.textContent = "\u201C" + data.quote + "\u201D";
    quoteAuthor.textContent = "\u2014 " + data.author;
    quoteStatus.textContent = "";
  } catch (error) {
    // Tell the user what happened and what to do next
    console.error(error);
    quoteStatus.textContent =
      "Sorry, we could not load a quote. Check your internet connection and click New Quote to try again.";
  } finally {
    // Runs whether it worked or not
    quoteButton.disabled = false;
  }
}

quoteButton.addEventListener("click", loadQuote);

// Load a first quote when the page opens
loadQuote();