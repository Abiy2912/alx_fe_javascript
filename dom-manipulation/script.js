const quotes = [
  { text: 'Be the change that you wish to see in the world.', category: 'Inspiration' },
  { text: 'The only way to do great work is to love what you do.', category: 'Work' },
  { text: 'Life is what happens when you’re busy making other plans.', category: 'Life' },
  { text: 'The best way out is always through.', category: 'Adversity' },
  { text: 'Believe you can and you’re halfway there.', category: 'Success' },
  { text: 'Happiness is not something ready made. It comes from your own actions.', category: 'Happiness' },
];
let categories = new Set();
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  if (quotes.length === 0) {
    quoteDisplay.textContent = 'No quotes available.';
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteDisplay.textContent = `"${quotes[randomIndex].text}" - ${quotes[randomIndex].category}`;
}

// Initialize an object to store quotes and their categories
const quoteMap = {};

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  if (newQuoteText && newQuoteCategory) {
    if (!quoteMap[newQuoteCategory]) {
      quoteMap[newQuoteCategory] = [];
    }
    quoteMap[newQuoteCategory].push(newQuoteText);
    saveQuotes();
    populateCategoryFilter(); // Update category filter options
  }
}

// Function to populate category filter dropdown
function populateCategoryFilter() {
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  for (const category in quoteMap) {
    categoryFilter.innerHTML += `<option value="${category}">${category}</option>`;
  }
}
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const filteredQuotes = selectedCategory === 'all'
    ? Object.values(quoteMap).flat()
    : quoteMap[selectedCategory] || [];
  // Display filtered quotes (update the DOM as needed)
  // ...
}


// Load existing quotes from local storage on page load
const storedQuotes = localStorage.getItem('quotes');
if (storedQuotes) {
  const parsedQuotes = JSON.parse(storedQuotes);
  quotes = parsedQuotes;
  parsedQuotes.forEach((quote) => categories.add(quote.category));
  populateCategoryFilter();
}
localStorage.setItem('selectedCategory', selectedCategory);

// Show an initial random quote
const storedSelectedCategory = localStorage.getItem('selectedCategory');
if (storedSelectedCategory) {
  document.getElementById('categoryFilter').value = storedSelectedCategory;
  filterQuotes(); // Apply the filter immediately
}

showRandomQuote();
// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
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


