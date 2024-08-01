let quotes = [
  { text: 'Love is not only something you feel, it is something you do.', category: 'Love' },
  { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', category: 'Success' },
  { text: 'Be yourself; everyone else is already taken.', category: 'Identity' },
  { text: 'You miss 100% of the shots you don’t take.', category: 'Motivation' }
];

function showRandomQuote() {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>${quote.text}</p><span>- ${quote.category}</span>`;
}

function addQuote(newQuoteText, newQuoteCategory) {
  const newQuote = { id: quotes.length + 1, text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  const newQuoteElement = document.createElement('div');
  newQuoteElement.classList.add('category-filter');
  newQuoteElement.innerHTML = `<p>${newQuote.text}</p><span>- ${newQuote.category}</span>`;
  document.getElementById('quotes-container').appendChild(newQuoteElement);
  saveQuotes();
  showRandomQuote();
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function loadQuotes() {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
    populateCategories();
    filterQuotes(null);
  }
}

function exportJson() {
  const quotesJson = JSON.stringify(quotes);
  const blob = new Blob([quotesJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
}

function importJson(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    filterQuotes(null);
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

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

function filterQuotes(category) {
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
    if (!category || quote.category === category) {
      const quoteElement = document.createElement('div');
      quoteElement.classList.add('category-filter');
      quoteElement.innerHTML = `<p>${ quote.text}</p><span>- ${ quote.category}</span>`;
      quoteContainer.appendChild(quoteElement);
    }
  });
}

function initializeCategoryFilter() {
  // Populate the category filter
  populateCategories();

  // Load the last selected category from local storage
  const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
  if (lastSelectedCategory) {
    filterQuotes(lastSelectedCategory);
  } else {
    filterQuotes(null); // Default to 'all' if no filter is selected
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
loadQuotes();
initializeCategoryFilter();