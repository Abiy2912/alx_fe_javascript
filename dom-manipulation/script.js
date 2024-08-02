let quotes = [];
    const apiEndpoint = 'https://jsonplaceholder.typicode.com/posts';
    let lastFetchTime = Date.now(); // Keep track of the last fetch time

    // Function to fetch quotes from the mock API
    async function fetchJson(url) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Failed to fetch data:', error);
        return []; // Return an empty array if there's an error
      }
    }

    // Function to fetch and sync quotes from the server
    async function fetchQuotesFromServer() {
      try {
        const serverQuotes = await fetchJson(apiEndpoint);
        quotes = serverQuotes;
        saveQuotes();
        filterQuotes('all'); // Update UI with the fetched data
      } catch (error) {
        console.error('Failed to fetch quotes:', error);
        alert('Failed to fetch quotes from the server. Using local storage data.');
      }
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

    // Function to save quotes to local storage
    function saveQuotes() {
      localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    // Function to load quotes from local storage
    function loadQuotes() {
      const savedQuotes = JSON.parse(localStorage.getItem('quotes') || '[]');
      if (savedQuotes) {
        quotes = savedQuotes;
      } else {
        fetchJson(apiEndpoint)
          .then(quotes => {
            quotes = quotes;
            saveQuotes();
            filterQuotes('all'); // Update UI with the fetched data
          })
          .catch(error => {
            console.error('Failed to fetch quotes:', error);
            alert('Failed to fetch quotes from the server. Using mock data.');
        });
      }
    }

    // Function to populate the category filter
    function populateCategories() {
      const uniqueCategories = new Set();
      quotes.forEach(( quote) => {
        uniqueCategories.add( quote.category);
      });

      const categoryFilter = document.getElementById('categoryFilter');
      uniqueCategories.forEach((category) => {
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
      activeFilters.forEach((filter) => {
        filter.classList.remove('active');
      });

      // Map the quotes to create filtered HTML elements
      const filteredQuotes = quotes.map(( quote) => {
        if (category === 'all' || quote.category === category) {
          return `<div class="category-filter ${category === 'all' ? 'active' : ''}" data-category="${category}" data-id=${category === 'all' ? 'all' : quote.id}>
                    <p>${ quote.content}</p><span>- ${ quote.category}</span>
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
        content: contentInput.value,
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
      newQuoteElement.innerHTML = `<p>${newQuote.content}</p><span>- ${newQuote.category}</span>`;
      document.getElementById('quotes-container').appendChild(newQuoteElement);
    });

    // Event listener for the "Show New Quote" button
    document.getElementById('newQuote').addEventListener('click', () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const randomQuote = quotes[randomIndex];
      showQuote(randomQuote);
    });

    // Event listener for the category filter
    document.getElementById('categoryFilter').addEventListener('change', (e) => {
      const selectedCategory = e.target.value;
      filterQuotes(selectededCategory);
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

    // Function to show a random quote
    function showQuote(randomQuote) {
      const quoteElement = document.createElement('div');
      quoteElement.classList.add('category-filter');
      quoteElement.innerHTML = `<p>${randomQuote.content}</p><span>- ${randomQuote.category}</span>`;
      document.getElementById('quotes-container').appendChild(quoteElement);
    }

    // Initialize the UI with the saved quotes and start the periodic sync
    loadQuotes();
    startPeriodicSync();

    // Periodically sync data with the server
    setInterval(fetchQuotesFromServer, 300000); // Sync every 5 minutes for demonstration purposes

    // Event listener for the "Sync with Server" button
    document.getElementById('syncButton').addEventListener('click', async () => {
      try {
        const serverData = await fetchJson(apiEndpoint);
        quotes = serverData;
        saveQuotes();
        filterQuotes('all'); // Update UI with the fetched data
      } catch (error) {
        console.error('Failed to sync data with server:', error);
        alert('Failed to sync data with the server. Using local storage data.');
      }
    });

    // Add the "Sync with Server" button to the UI
    const syncButtonEl = document.createElement('button');
    syncButtonEl.textContent = 'Sync with Server';
    syncButtonEl.id = 'syncButton';
    document.body.appendChild(syncButtonEl);