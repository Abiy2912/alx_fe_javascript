const quotes = [
  { text: 'Learning JavaScript deeply is like peeling an onion. The more layers you peel, the more you cry.',
    category: 'JavaScript' },
  { text: 'The only way to do great work is to love what you do.',
    category: 'Motivation' },
  {
     text: "Life is what happens when you're busy making other plans.",
     category: "inspirational"
   },
   {
     text: "The only way to do great work is to love what you do.",
     category: "work"
   },
   {
     text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
     category: "self"
   },
   {
     text: "A journey of a thousand miles begins with a single step.",
     category: "travel"
   },
   {
     text: "You miss 100% of the shots you don't take.",
     category: "sport"
   },
 
  // ... other initial quotes
];

function showRandomQuote() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById('quoteDisplay').innerHTML = `<p>${randomQuote.text}</p><span>- ${randomQuote.category}</span>`;
}

function createAddQuoteForm() {
  const newQuoteButton = document.createElement('button');
  newQuoteButton.innerHTML = 'Add Quote';
  newQuoteButton.addEventListener('click', addQuote);

  const newQuoteText = document.createElement('input');
  newQuoteText.type = 'text';
  newQuoteText.placeholder = 'Enter a new quote';
  newQuoteText.id = 'newQuoteText';

  const newQuoteCategory = document.createElement('input');
  newQuoteCategory.type = 'text';
  newQuoteCategory.placeholder = 'Enter quote category';
  newQuoteCategory.id = 'newQuoteCategory';

  const quoteInputContainer = document.createElement('div');
  quoteInputContainer.appendChild(newQuoteButton);
  quoteInputContainer.appendChild(newQuoteText);
  quoteInputContainer.appendChild(newQuoteCategory);
  document.body.appendChild(quoteInputContainer);
}

document.getElementById('newQuote').addEventListener('click', showRandomQuote);
createAddQuoteForm();

function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);
  saveQuotes();
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  showRandomQuote();
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function loadQuotes() {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  }
}

addQuote();

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

function exportQuotes() {
  const data = new Blob([JSON.stringify(quotes)], { type: 'application/json' });
  const url = URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

function addQuote() {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
    // Populate the category filter with unique categories
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = new Set();
    quotes.forEach( quote => {
      categories.add( quote.category);
    });
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
    // Set the last selected category filter if available
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
    if (lastSelectedCategory) {
      categoryFilter.value = lastSelectedCategory;
      filterQuotes(lastSelectedCategory);
    } else {
      filterQuotes('all');
    }
}
}

function filterQuotes(category) {
  const filteredQuotes = quotes.filter( quote => quote.category === category || category === 'all');
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';
  filteredQuotes.forEach( quote => {
    const paragraph = document.createElement('p');
    paragraph.textContent = quote.text;
    const categorySpan = document.createElement('span');
    categorySpan.textContent = `- ${category}`;
    quoteDisplay.appendChild(paragraph);
    quoteDisplay.appendChild(categorySpan);
  });
  localStorage.setItem('lastSelectedCategory', category);
}

const categoryFilter = document.getElementById('categoryFilter');
categoryFilter.addEventListener('change', event => {
  const selectedCategory = event.target.value;
  filterQuotes(selectededCategory);
});