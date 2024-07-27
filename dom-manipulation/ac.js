// Initialize the quotes array
const quotes = [];

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  const quoteElement = document.createElement('div');
  quoteElement.innerHTML = `<p class="text">${randomQuote.text}</p><p class="category">- ${randomQuote.category}</p>`;
  document.getElementById('quoteDisplay').appendChild(quoteElement);
}

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to load quotes from local storage
function loadQuotes() {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes.push(...JSON.parse(savedQuotes));
  }
}

// Function to add a new quote to the array and update the DOM
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  const newQuote = { text: newQuoteText, category: newQuoteCategory };
  quotes.push(newQuote);
  saveQuotes();
  document.getElementById('newQuoteForm').reset();
  document.getElementById('newQuoteFormContainer').style.display = 'none';
  showRandomQuote();
}

// Function to create an add quote form
function createAddQuoteForm() {
  const formContainer = document.createElement('div');
  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
  document.getElementById('newQuoteFormContainer').appendChild(formContainer);
  document.getElementById('newQuoteFormContainer').style.display = 'block';
}

// Function to handle file import
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

// Function to export quotes as a JSON file
function exportAsJson() {
  const jsonData = JSON.stringify(quotes);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
}

// Event listener for the "Add Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuote').addEventListener('click', createAddQuoteForm);
document.getElementById('exportQuotes').addEventListener('click', exportAsJson);
