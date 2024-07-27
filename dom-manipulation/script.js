const quotes = [];
const savedQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

// Display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  displayQuote(createQuoteElement(quote));
}

// Display the provided quote element
function displayQuote(element) {
  const quoteDisplay = document.getElementById("quoteblock");
  quoteDisplay.innerHTML = "";
  quoteDisplay.appendChild(element);
}

// Create a quote element from an object
function createQuoteElement({ text, category }) {
  const p = document.createElement("p");
  p.textContent = text;
  const categoryButton = document.createElement("button");
  categoryButton.textContent = category;
  categoryButton.addEventListener("click", () => filterQuotes(category));
  return categoryButton;
}

// Function to add a new quote
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value;
  const quoteCategory = document.getElementById("newQuoteCategory").value;
  if (!quoteText || !quoteCategory) {
    alert("Please enter both quote and category.");
    return;
  }
  const newQuote = { text: quoteText, category: quoteCategory };
  quotes.push(newQuote);
  localStorage.setItem("quotes", JSON.stringify(quotes));
  toggleForm();
  showRandomQuote();
}

// Function to toggle the form container
function toggleForm() {
  const formContainer = document.getElementById("formContainer");
  formContainer.style.display = formContainer.style.display === "none" ? "block" : "none";
}

// Function to filter quotes based on selected category
function filterQuotes(category = "all") {
  const filteredQuotes = category === "all" ? quotes : quotes.filter(q => q.category === category);
  localStorage.setItem("currentFilter", category);
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.value = category;
  displayQuote(createFilteredQuoteElement(filteredQuotes));
}

// Function to create an element to display filtered quotes
function createFilteredQuoteElement(quotes) {
  const div = document.createElement("div");
  for (const quote of quotes) {
    const p = createQuoteElement(quote);
    div.appendChild(p);
  }
  return div;
}

// Function to update the category filter dropdown
function updateCategoryFilter() {
  const categoryFilter = document.getElementById("categoryFilter");
  const options = [];
  let allCategories = new Set();
  for (const quote of quotes) {
    allCategories.add(quote.category);
  }
  const categories = Array.from(allCategories);
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Categories";
  categoryFilter.appendChild(allOption);
  for (const category of categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  }
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    localStorage.setItem("quotes", JSON.stringify(quotes));
    updateCategoryFilter();
    displayQuote(createFilteredQuoteElement(quotes));
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to export quotes to a JSON file
function exportQuotes() {
  const data = new Blob([JSON.stringify(quotes)], {type: 'application/json'});
  const url = URL.createObjectURL(data);
  const a = document.createElement('a');
  a.style = 'display:none';
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
}

// Initialize the application with saved quotes
function init() {
  // Load quotes from local storage
  if (savedQuotes.length) {
    quotes.push(...savedQuotes);
  }

  // Display the first quote
  showRandomQuote();

  // Update the category filter dropdown
  updateCategoryFilter();
}

// Check if the filter category is saved in local storage and filter if it is
function initFilter() {
  const savedFilter = localStorage.getItem("currentFilter");
  if (savedFilter) {
    filterQuotes(savedFilter);
  }
}

init();
initFilter();