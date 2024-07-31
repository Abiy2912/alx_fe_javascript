// Quote array with objects containing text and category
let quotes = [
  { text: 'Learning JavaScript deeply is like peeling an onion. The more layers you peel, the more you cry.', category: 'JavaScript' },
  { text: 'The only way to do great work is to love what you do.', category: 'Motivation' },
  // ... other initial quotes
];

// Load quotes from local storage
if (localStorage.getItem("quotes")) {
  quotes = JSON.parse(localStorage.getItem("quotes"));
}

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    <p>${randomQuote.text}</p>
    <p>Category: ${randomQuote.category}</p>
  `;
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();
    populateCategories();
    showRandomQuote();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  }
}

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to populate categories in the dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = Array.from(new Set(quotes.map(quote => quote.category)));
  categoryFilter.innerHTML = `
    <option value="all">All Categories</option>
    ${categories.map(category => `<option value="${category}">${category}</option>`).join("")}
  `;
}

// Function to filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory || selectedCategory === "all");
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";
  filteredQuotes.forEach(quote => {
    quoteDisplay.innerHTML += `
      <p>${quote.text}</p>
      <p>Category: ${quote.category}</p>
    `;
  });
  localStorage.setItem("lastFilter", selectedCategory);
}

// Function to export quotes to JSON file
function exportToJsonFile() {
  const jsonQuotes = JSON.stringify(quotes);
  const blob = new Blob([jsonQuotes], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Initialize the application
showRandomQuote();
populateCategories();

// Load last selected filter from local storage
const lastFilter = localStorage.getItem("lastFilter");
if (lastFilter) {
  document.getElementById("categoryFilter").value = lastFilter;
  filterQuotes();
}