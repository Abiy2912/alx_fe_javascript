// Array of quote objects
let quotes = [
  { text: 'Learning JavaScript deeply is like peeling an onion. The more layers you peel, the more you cry.', category: 'JavaScript' },
  { text: 'The only way to do great work is to love what you do.', category: 'Motivation' },
  // ... other initial quotes
];

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Function to display a random quote
function showRandomQuote(category) {
  let filteredQuotes = quotes;
  if (category!== "all") {
    filteredQuotes = quotes.filter(quote => quote.category === category);
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML = `<p>${quote.text}</p><p>Category: ${quote.category}</p>`;
}

// Function to create and display the add quote form
function createAddQuoteForm() {
  const addQuoteForm = document.getElementById("addQuoteForm");
  addQuoteForm.style.display = "block";
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    saveQuotes();
    populateCategories();
    showRandomQuote(getSelectedCategory());
  }
}

// Function to update the category filter dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(quote => quote.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.text = category;
    categoryFilter.appendChild(option);
  });
  const lastSelectedCategory = localStorage.getItem("lastSelectedCategory");
  if (lastSelectedCategory) {
    categoryFilter.value = lastSelectedCategory;
  }
}

// Function to get the selected category from the filter dropdown
function getSelectedCategory() {
  const categoryFilter = document.getElementById("categoryFilter");
  return categoryFilter.value;
}

// Function to filter quotes based on the selected category
function filterQuotes() {
  const category = getSelectedCategory();
  showRandomQuote(category);
  localStorage.setItem("lastSelectedCategory", category);
}

// Function to export quotes to a JSON file
function exportToJson() {
  const json = JSON.stringify(quotes);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    updateCategoryFilter();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", () => showRandomQuote(getSelectedCategory()));
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);