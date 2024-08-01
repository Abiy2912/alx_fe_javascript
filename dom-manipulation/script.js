
// Function to fetch data from the server and update the UI
async function fetchAndSyncQuotes() {
  try {
    const serverQuotes = await fetchJson(apiEndpoint);
    quotes = serverQuotes;
    saveQuotes();
    filterQuotes('all'); // Update UI with the fetched data
  } catch (error) {
    console.error('Failed to fetch quotes:', error);
    alert('Failed to fetch quotes from the server. Initializing with empty data.');
  }
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

  // Optionally, you can now also send the new quote to the server to be saved
  fetchJson(`${apiEndpoint}/${quotes.length}`, {
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
});

// Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Event listener for the category filter
document.getElementById('categoryFilter').addEventListener('change', (e) => {
  const selectedCategory = e.target.value;
  filterQuotes(selectededCategory);
});

// Function to start periodic synchronization with the server
function startPeriodicSync() {
  setInterval(() => {
    fetchAndSyncQuotes();
  }, 300000); // Fetch new quotes from the server every 5 minutes (300000 milliseconds)
}

// Function to fetch data from the API and handle JSON parsing and errors
async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}