const quotes = [];
const quoteContainer = document.getElementById('quotation');
const newQuoteButton = document.getElementById('newQuote');
const importFileInput = document.getElementById('importFile');
const addQuoteButton = document.getElementById('addQuote');
const categoryContainer = document.getElementById('categoryContainer');
const categoryFilterContainer = document.getElementById('categoryFilterContainer');

// Load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
    populateCategoryFilter();
    showRandomQuote();
  }
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const quoteElement = document.createElement('div');
  quoteElement.classList.add('quotation');
  quoteElement.innerHTML = `<p>${quote.text}</p><span class="category">- ${quote.category}</span>`;
  quoteContainer.appendChild(quoteElement);
}

// Add a new quote
function addQuoteToList(newQuote) {
  quotes.push(newQuote);
  saveQuotes();
  showRandomQuote();
}

// Display add quote form
function createQuoteForm() {
  const addQuoteContainer = document.getElementById('addQuoteContainer');
  const form = document.createElement('form');
  form.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="submitQuote()">Submit</button>
  `;
  addQuoteContainer.innerHTML = '';
  addQuoteContainer.appendChild(form);
  addQuoteContainer.classList.remove('hidden');
}

// Handle adding a new quote
function submitQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  addQuoteToList(newQuote);
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  document.getElementById('addQuoteContainer').classList.add('hidden');
}

// Populate the category filter dropdown
function populateCategoryFilter() {
  const categoryFilter = document.createElement('select');
  categoryFilter.id = 'categoryFilter';
  categoryFilter.addEventListener('change', filterQuotes);
  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = 'All Categories';
  categoryFilter.appendChild(allOption);
  const uniqueCategories = new Set(quotes.map(q => q.category));
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  categoryFilterContainer.innerHTML = '';
  categoryFilterContainer.appendChild(categoryFilter);
}

// Filter quotes by category
function filterQuotes(event) {
  const selectedCategory = event.target.value;
  const filteredQuotes = quotes.filter(q => q.category === selectedCategory || selectedCategory === 'all');
  quoteContainer.innerHTML = '';
  filteredQuotes.forEach(q => {
    const quoteElement = document.createElement('div');
    quoteElement.classList.add('quotation');
    quoteElement.innerHTML = `<p>${q.text}</p><span class="category">- ${q.category}</span>`;
    quoteContainer.appendChild(quoteElement);
  });
}

// Export quotes to JSON
function exportQuotes() {
  const quotesJson = JSON.stringify(quotes);
  const blob = new Blob([quotesJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategoryFilter();
    showRandomQuote();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Populate the category buttons
function populateCategories() {
  const categories = new Set(quotes.map(q => q.category));
  categories.forEach(category => {
    const button = document.createElement('button');
    button.classList.add('categoryButton');
    button.textContent = category;
    button.addEventListener('click', () => {
      filterQuotes({ target: { value: category } });
    });
    categoryContainer.appendChild(button);
  });
}

// Event listener for new quote button
newQuoteButton.addEventListener('click', showRandomQuote);

// Initialize the app
loadQuotes();
populateCategories();
populateCategoryFilter();