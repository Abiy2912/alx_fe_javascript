// Function to display a random quote
function showRandomQuote() {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>${quote.text}</p><span>- ${quote.category}</span>`;
}

// Function to add a new quote to the quotes array
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  document.getElementById('newQuoteText').classList.add('hidden');
  document.getElementById('newQuoteCategory').classList.add('hidden');
  saveQuotes(); // Save the new quote to local storage
  filterQuotes(newQuoteCategory); // Filter quotes by the new category
}

// Function to save the current quote array to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to load quotes from local storage when the page is initialized
function loadQuotes() {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  }
}

// Function to export quotes to a JSON file
function exportJson() {
  const quotesJson = JSON.stringify(quotes);
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
    quotes.push(...importedQuotes);
    saveQuotes();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to populate the category filter
function populateCategories() {
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
}

// Function to filter quotes based on the selected category
function filterQuotes(category = 'all') {
  // Clear any existing filters
  const activeFilters = document.querySelectorAll('.category-filter.active');
  activeFilters.forEach(filter => {
    filter.classList.remove('active');
  });

  // Update the selected filter's class
  const selectedFilter = document.querySelector(`#categoryFilter[value="${category}"]`);
  selectedFilter.classList.add('active');

  // Map the quotes to create filtered HTML elements
  const filteredQuotes = quotes.map( quote => {
    if (category === 'all' || quote.category === category) {
      return `<div class="category-filter ${category === 'all' ? 'active' : ''}">
                <p>${ quote.text}</p><span>- ${ quote.category}</span>
              </div>`;
    }
    return ''; // Return an empty string if the quote doesn't match the filter
  }).filter(Boolean).join(''); // Remove empty strings and join the filtered HTML

  // Clear the current quote container
  const quoteContainer = document.getElementById('quotes-container');
  quoteContainer.innerHTML = '';

  // Update the UI with the filtered quotes
  quoteContainer.innerHTML = filteredQuotes;
}

// Function to initialize the category filter
function initializeCategoryFilter() {
  // Populate the category filter
  populateCategories();

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
  saveQuotes(); // Save the new quote to local storage

  // Update the UI with the new quote
  const newQuoteElement = document.createElement('div');
  newQuoteElement.classList.add('category-filter');
  newQuoteElement.innerHTML = `<p>${newQuote.text}</p><span>- ${newQuote.category}</span>`;
  document.getElementById('quotes-container').appendChild(newQuoteElement);
});

// Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Event listener for the category filter
document.getElementById('categoryFilter').addEventListener('change', (e) => {
  const selectedCategory = e.target.value;
  filterQuotes(selectededCategory);
});

// Initialize the category filter when the page loads
initializeCategoryFilter();
