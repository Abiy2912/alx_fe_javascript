const quotes = [
  { text: 'Be the change that you wish to see in the world.', category: 'Inspiration' },
  { text: 'The only way to do great work is to love what you do.', category: 'Work' },
  { text: 'Life is what happens when you’re busy making other plans.', category: 'Life' },
  { text: 'The best way out is always through.', category: 'Adversity' },
  { text: 'Believe you can and you’re halfway there.', category: 'Success' },
  { text: 'Happiness is not something ready made. It comes from your own actions.', category: 'Happiness' },
];

function populateCategories() {
  const uniqueCategories = new Set(quotes.map(item => item.category));
  const categoryFilter = document.getElementById('categoryFilter');
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function filterQuotes(category = 'all') {
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';
  const filteredQuotes = quotes.filter(q => category === 'all' || q.category === category);
  filteredQuotes.forEach(q => {
    const quoteElement = document.createElement('div');
    quoteElement.innerHTML = `<p class="text">${q.text}</p><p class="category">- ${q.category}</p>`;
    quoteDisplay.appendChild(quoteElement);
  });
  saveFilter(category);
}

function saveFilter(category) {
  localStorage.setItem('lastFilter', category);
}

function loadFilter() {
  const lastFilter = localStorage.getItem('lastFilter');
  if (lastFilter) {
    filterQuotes(lastFilter);
  } else {
    filterQuotes('all');
  }
}

function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value.trim();
  const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();
  if (newQuoteText === '' || newQuoteCategory === '') {
    alert('Please enter both quote text and category.');
    return;
  }
  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories(); // Update the categories in the dropdown with the new category
  filterQuotes(newQuoteCategory); // Display the newly added quote
  document.getElementById('newQuoteFormContainer').style.display = 'none';
  document.getElementById('newQuoteForm').reset();
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function loadQuotes() {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
    populateCategories();
    loadFilter();
  }
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    filterQuotes(localStorage.getItem('lastFilter') || 'all'); // Set the filter to the last selected category or 'all' if not set
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', () => {
  if (document.getElementById('newQuoteFormContainer').style.display === 'none') {
    document.getElementById('newQuoteFormContainer').style.display = 'block';
  } else {
    filterQuotes(document.getElementById('categoryFilter').value);
  }
});

document.getElementById('newQuoteFormContainer').addEventListener('submit', event => {
  event.preventDefault();
  addQuote();
});

document.getElementById('categoryFilter').addEventListener('change', event => {
  filterQuotes(event.target.value);
});

document.getElementById('importFile').addEventListener('change', importFromJsonFile);

// Initialize the quote display and filter loading
loadQuotes();