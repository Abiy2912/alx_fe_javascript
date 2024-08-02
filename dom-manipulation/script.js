// Function to fetch and sync quotes from the server when the page loads
function fetchAndSyncQuotes() {
  fetchJson(apiEndpoint)
    .then(serverQuotes => {
      quotes = serverQuotes;
      saveQuotes();
      filterQuotes('all'); // Update UI with the fetched data
    })
    .catch(error => {
      console.error('Failed to fetch quotes:', error);
      alert('Failed to fetch quotes from the server. Using local storage data.');
    });
}

// Function to start the periodic sync with the server
function startPeriodicSync() {
  setInterval(() => {
    if (Date.now() - lastFetchTime > 300000) { // Fetch new data every 5 minutes
      lastFetchTime = Date.now();
      fetchQuotesFromServer();
    }
  }, 60000); // Check if it's time to sync every minute
}

// Function to show a random quote from the quotes array
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  const quoteElement = document.createElement('div');
  quoteElement.classList.add('category-filter');
  quoteElement.innerHTML = `<p>${randomQuote.text}</p><span>- ${randomQuote.category}</span>`;
  document.getElementById('quotes-container').appendChild(quoteElement);
}

// Initialize the UI with the saved quotes
loadQuotes();
initializeCategoryFilter();
startPeriodicSync();

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

  // Optionally, send the new quote to the server
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

// Event listener for the "Add Quote" button
document.getElementById('submit-button').addEventListener('click', function(e) {
  e.preventDefault();
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);
  saveQuotes();
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
});

// Event listener for the "Import Quotes" button
document.getElementById('importFile').addEventListener('change', importFromJsonFile);

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

  // Optionally, send the new quote to the server
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




//`https://jsonplaceholder.typicode.com/quotes` for fetching data (GET request)
 //`https://jsonplaceholder.typicode.com/quotes` for posting updates (POST request)



const fetchData = async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/quotes');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

const syncDataWithServer = async () => {
  const serverData = await fetchData();
  const localData = JSON.parse(localStorage.getItem('quotes') || '[]');

  // Resolve conflicts by taking the server data precedence
  const mergedData = serverData.map((serverQuote) => {
    const localQuote = localData.find((local) => local.id === serverQuote.id);
    if (localQuote) {
      // If a local version exists, merge it with the server version
      // For simplicity, we'll just update the content with the server's version
      localQuote.content = serverQuote.content;
    } else {
      // If no local version exists, add the server quote directly
      localData.push(serverQuote);
    }
    return localQuote || serverQuote;
  });

  // Store the merged data in local storage
  localStorage.setItem('quotes', JSON.stringify(mergedData));

  // Update the UI with the merged data
  updateUI(mergedData);
};

const showNotification = (message) => {
  const notificationEl = document.createElement('div');
  notificationEl.classList.add('notification');
  notificationEl.textContent = message;
  document.body.appendChild(notificationEl);

  setTimeout(() => {
    notificationEl.remove();
  }, 3000);
};

// Update the UI function to handle notifications
const updateUI = (data) => {
  // ... (Your existing UI update code)

  // Check for updates and show notifications
  if (data.length > 0) {
    showNotification('Data has been updated from the server.');
  } else {
    showNotification('No new data from the server.');
  }
};



const syncButton = document.createElement('button');
syncButton.textContent = 'Sync with Server';
syncButton.addEventListener('click', syncDataWithServer);
document.body.appendChild(syncButton);

// Periodically sync data with the server
setInterval(syncDataWithServer, 10000); // Sync every 10 seconds for demonstration purposes

// Initialize the UI with the saved quotes and start the periodic sync
loadQuotes();
initializeCategoryFilter();
startPeriodicSync();