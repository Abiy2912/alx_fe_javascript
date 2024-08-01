
// Function to add quotes dynamically


const quotes = [
  { text: 'Be the change that you wish to see in the world.', category: 'Inspiration' },
  { text: 'The only way to do great work is to love what you do.', category: 'Work' },
  { text: 'Life is what happens when you’re busy making other plans.', category: 'Life' },
  { text: 'The best way out is always through.', category: 'Adversity' },
  { text: 'Believe you can and you’re halfway there.', category: 'Success' },
  { text: 'Happiness is not something ready made. It comes from your own actions.', category: 'Happiness' },
];

//-----------------------------------
function showRandomQuote(){
  let quote = quotes[Math.floor(Math.random() * quotes.length)];
  const quoteElement = document.createElement('div');
  quoteElement.innerHTML = `<p class="text">${quote.text}</p><p class="category">- ${quote.category}</p>`;
  document.getElementById('quoteDisplay').appendChild(quoteElement);
}

function addQuote(){
  const newQuoteText = document.getElementById('newQuoteText').value.trim();
  const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();
  if(newQuoteText === '' || newQuoteCategory === ''){
    alert('Please enter both quote text and category.');
    return;
  }
  const userQuote = {text: newQuoteText, category: newQuoteCategory};
  quotes.push(userQuote);
  saveQuotes();
  updateCategoryFilter();
  document.getElementById('newQuoteFormContainer').style.display = 'none';

  showRandomQuote();
  document.getElementById('newQuoteForm').reset();
}

function saveQuotes(){
  localStorage.setItem('quotes', JSON.stringify(quotes));
  localStorage.setItem('lastFilteredCategory', document.getElementById('categoryFilter').value);
}

function loadQuotes(){
  const savedQuotes = localStorage.getItem('quotes');
  if(savedQuotes){
    quotes = JSON.parse(savedQuotes);
  }
  updateCategoryFilter();
}

function updateCategoryFilter(){
  const categories = new Set(quotes.map(q => q.category));
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.text = category;
    categoryFilter.appendChild(option);
  });
}

function filterQuotes(category = 'all'){
  const filteredQuotes = category === 'all' ? quotes : quotes.filter(q => q.category === category);
  const quoteContainer = document.getElementById('quoteDisplay');
  quoteContainer.innerHTML = '';
  filteredQuotes.forEach(q => {
    const quoteElement = document.createElement('div');
    quoteElement.innerHTML = `<p class="text">${q.text}</p><p class="category">- ${q.category}</p>`;
    quoteContainer.appendChild(quoteElement);
  });
  document.getElementById('lastFilteredCategory').value = category;
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

document.addEventListener('DOMContentLoaded', () => {
  loadQuotes();
  filterQuotes(localStorage.getItem('lastFilteredCategory') || 'all');
});

document.getElementById('newQuote').addEventListener('click', () => {
  if(document.getElementById('newQuoteFormContainer').style.display === 'none'){
    document.getElementById('newQuoteFormContainer').style.display = 'block';
  } else {
    addQuote();
  }
});

document.getElementById('categoryFilter').addEventListener('change', () => {
  filterQuotes(document.getElementById('categoryFilter').value);
});