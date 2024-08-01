let quotes = [
  { text: 'Love is not only something you feel, it is something you do.', category: 'Love' },
  { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', category: 'Success' },
  { text: 'Be yourself; everyone else is already taken.', category: 'Identity' },
  { text: 'You miss 100% of the shots you don’t take.', category: 'Motivation' }
];

// Function to display a random quote
function showRandomQuote() {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  const quoteDisplay = document.getElementById('quotes-container');
  quoteDisplay.innerHTML = `<div><p>${quote.text}</p><span>- ${quote.category}</span></div>`;
}

// Function to create a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  filterQuotes(newQuoteCategory); // Display the new quote after adding it
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

  // Map the quotes to create filtered HTML elements
  const filteredQuotes = quotes.map( quote => {
    if (category === 'all' || quote.category === category) {
      return `<div class="category-filter ${category === 'all' ? 'active' : ''}">
                <p>${ quote.text}</p><span>- ${ quote.category}</span>
              </div>`;
    }
    return ''; // Return an empty string if the quote doesn't match the filter
  }).filter(Boolean).join(''); // Remove empty strings and join the filtered HTML

  quoteContainer.innerHTML = filteredQuotes;
}

// Function to populate the category filter dropdown
function populateCategories() {
  const uniqueCategories = new Set();
  quotes.forEach( quote => {
    uniqueCategories.add( quote.category);
  });

  const categoryFilterSelect = document.getElementById('categoryFilter');
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilterSelect.appendChild(option);
  });
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

  // Update the UI with the new quote
  const newQuoteElement = document.createElement('div');
  newQuoteElement.classList.add('category-filter');
  newQuoteElement.innerHTML = `<p>${newQuote.text}</p><span>- ${newQuote.category}</span>`;
  document.getElementById('quotes-container').appendChild(newQuoteElement);

  // Set the last selected category to the new category
  localStorage.setItem('lastSelectedCategory', newQuote.category);
  filterQuotes(newQuote.category);
});

// Initialize the category filter when the page loads
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

// Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Event listener for the category filter select
document.getElementById('categoryFilter').addEventListener('change', filterQuotes);

// Call the loadQuotes function to initialize the quotes
loadQuotes();

// Initialize the category filter
initializeCategoryFilter();