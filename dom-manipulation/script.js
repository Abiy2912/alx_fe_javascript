
// Function to display a random quote
function showRandomQuote() {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>${quote.text}</p><span>- ${quote.category}</span>`;
}

// Function to create a form to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  document.getElementById('newQuoteText').classList.add('hidden');
  document.getElementById('newQuoteCategory').classList.add('hidden');
  showRandomQuote();
}

// Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Function to save the current quote array to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to load quotes from local storage when the page is initialized
function loadQuotes() {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
    // Populate the UI with the loaded quotes
    populateQuotes();
  }
}

// Function to export quotes to a JSON file
function exportJson() {
  const quotesJson = JSON.stringify(quotes, null, 2); // Add indentation for better readability
  const blob = new Blob([quotesJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes = [...quotes, ...importedQuotes];
    saveQuotes();
    populateQuotes();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to populate the quotes container with the current list of quotes
function populateQuotes() {
  const quoteContainer = document.getElementById('quotes-container');
  quoteContainer.innerHTML = '';

  quotes.forEach( quote => {
    const quoteElement = document.createElement('div');
    quoteElement.classList.add('category-filter');
    quoteElement.innerHTML = `<p>${ quote.text}</p><span>- ${ quote.category}</span>`;
    quoteContainer.appendChild(quoteElement);
  });
}

// Function to filter quotes based on the selected category
function filterQuotes(category = 'all') {
  const quoteContainer = document.getElementById('quotes-container');
  quoteContainer.innerHTML = '';

  // Clear any existing filters
  const activeFilters = document.querySelectorAll('.category-filter.active');
  activeFilters.forEach(filter => {
    filter.classList.remove('active');
  });

  // Update the selected filter's class
  const selectedFilter = document.querySelector(`#categoryFilter[value="${category}"]`);
  selectedFilter.classList.add('active');

  // Filter the quotes
  quotes.forEach( quote => {
    if (category === 'all' || quote.category === category) {
      const quoteElement = document.createElement('div');
      quoteElement.classList.add('category-filter');
      quoteElement.innerHTML = `<p>${ quote.text}</p><span>- ${ quote.category}</span>`;
      quoteContainer.appendChild(quoteElement);
    }
  });
}

// Function to initialize the category filter
function initializeCategoryFilter() {
  // Populate the category filter
  const uniqueCategories = new Set();
  quotes.forEach( quote => {
    uniqueCategories.add( quote.category);
  });

  const categoryFilter = document.getElementById('categoryFilter');
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Load the last selected category from local storage
  const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
  if (lastSelectedCategory) {
    filterQuotes(lastSelectedCategory);
  } else {
    filterQuotes('all'); // Default to 'all' if no filter is selected
  }
}

// Event listener for adding new quotes
document.getElementById('submit-button').addEventListener('click', function(e) {
  e.preventDefault();
  const contentInput = document.getElementById('newQuoteText');
  const authorInput = document.getElementById('newQuoteCategory');

  // Validate inputs
  if (!contentInput.value || !authorInput.value) {
    alert('Please fill in all fields.');
    return;
  }

  // Add the new quote to the quotes array
  const newQuote = {
    id: quotes.length + 1,
    text: contentInput.value,
    category: authorInput.value
  };
  quotes.push(newQuote);
  saveQuotes();

  // Update the UI with the new quote
  const newQuoteElement = document.createElement('div');
  newQuoteElement.classList.add('category-filter');
  newQuoteElement.innerHTML = `<p>${newQuote.text}</p><span>- ${newQuote.category}</span>`;
  document.getElementById('quotes-container').appendChild(newQuoteElement);
});

// Initialize the category filter when the page loads
loadQuotes();
initializeCategoryFilter();