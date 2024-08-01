// Assume you have a fetchJson function that fetches data from a mock API and returns a promise with JSON data
function fetchJson(url) {
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return data;
    });
}

// Assume you have an API endpoint to fetch and save quotes, e.g., 'https://jsonplaceholder.typicode.com/quotes'
const apiEndpoint = 'https://jsonplaceholder.typicode.com/quotes';

let quotes = [];
let lastFetchTime = 0;

// Function to fetch new quotes from the server every 5 minutes
function fetchQuotesFromServer() {
  fetchJson(apiEndpoint)
    .then(serverQuotes => {
      // Set the server quotes as the new source of data
      quotes = serverQuotes;
      saveQuotes();
      filterQuotes('all'); // Update UI with the fetched data
    })
    .catch(error => {
      console.error('Failed to fetch quotes:', error);
      alert('Failed to fetch quotes from the server. Please check your internet connection and try again.');
    });
}



// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);
  saveQuotes();
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  // Optionally, you can now also send the new quote to the server to be saved
  fetchJson(`${apiEndpoint}/${quotes.length + 1}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newQuote)
  })
    .then(() => {
      console.log('Quote added to server');
    })
    .catch(error => {
      console.error('Failed to add quote to server:', error);
      alert('Failed to add quote to the server. The quote has been saved locally.');
    });
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    filterQuotes('all'); // Update UI with the imported quotes
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to load quotes from local storage when the page is initialized
function loadQuotes() {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  } else {
    fetchAndSyncQuotes(); // Fetch quotes from the server if none are saved locally
  }
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
      return `<div class="category-filter ${category === 'all' ? 'active' : ''}" data-category="${category}" data-id=${category === 'all' ? 'all' : quote.id}>
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

  // Load the last selected category from local storage or default to 'all'
  const lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';
  filterQuotes(lastSelectedCategory);
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

// Initialize the category filter and start the periodic sync when the page loads
loadQuotes();
initializeCategoryFilter();
startPeriodicSync();
