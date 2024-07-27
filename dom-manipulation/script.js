// Initialize the quotes array
let quotes = [];

// Load quotes from local storage
function loadQuotes() {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  }
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><span>- ${randomQuote.author}</span><span class="category">[${randomQuote.category}]</span>`;
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// Function to add a new quote to the array and the DOM
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  const newQuote = { text: newQuoteText, author: 'Anonymous', category: newQuoteCategory };
  quotes.push(newQuote);
  saveQuotes();
  createAddQuoteForm();
  showRandomQuote();
}

// Function to create a form for adding a new quote
function createAddQuoteForm() {
  const quoteForm = document.createElement('div');
  quoteForm.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
  document.body.appendChild(quoteForm);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to export quotes to a JSON file
function exportToJson() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  link.click();
}

// Function to filter quotes by category
function filterQuotes(category = 'all') {
  const filteredQuotes = quotes.filter(quote => quote.category === category || category === 'all');
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';
  filteredQuotes.forEach(quot => {
    quoteDisplay.innerHTML += `<p>${quot.text}</p><span>- ${quot.author}</span><span class="category">[${quot.category}]</span><br>`;
  });
}

// Update the categories in the filter dropdown
function updateCategoryFilter() {
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  const uniqueCategories = new Set(quotes.map(quot => quot.category));
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Initialize the application
loadQuotes();
createAddQuoteForm();
updateCategoryFilter();

// Event listener for button to show new quote
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Event listener for button to import quotes
document.getElementById('importFile').addEventListener('change', importFromJsonFile);

// Event listener for button to export quotes
document.getElementById('exportJson').addEventListener('click', exportToJson);

// Event listener for category filter change
document.getElementById('categoryFilter').addEventListener('change', () => {
  const selectedCategory = document.getElementById('categoryFilter').value;
  filterQuotes(selectededCategory);
});

// Event listener for adding a new quote
document.getElementById('addQuote').addEventListener('click', () => {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  if (!newQuoteText || !newQuoteCategory) {
    alert('Please fill in both the quote and category fields.');
    return;
  }
  const newQuote = { text: newQuoteText, author: 'Anonymous', category: newQuoteCategory };
  quotes.push(newQuote);
  saveQuotes();
  updateCategoryFilter();
  showRandomQuote();
});

// Event listener for generating a new quote
document.getElementById('generateQuote').addEventListener('click', () => {
  const selectedCategory = document.getElementById('categoryFilter').value;
  filterQuotes(selectededCategory);
});

