
// Function to add quotes dynamically


const quotes = [
  { text: 'Be the change that you wish to see in the world.', category: 'Inspiration' },
  { text: 'The only way to do great work is to love what you do.', category: 'Work' },
  { text: 'Life is what happens when you’re busy making other plans.', category: 'Life' },
  { text: 'The best way out is always through.', category: 'Adversity' },
  { text: 'Believe you can and you’re halfway there.', category: 'Success' },
  { text: 'Happiness is not something ready made. It comes from your own actions.', category: 'Happiness' },
];

function createAddQuoteForm() {
  const addQuoteContainer = document.createElement('div');
  addQuoteContainer.style.display = 'flex';
  addQuoteContainer.style.flexDirection = 'column';
  addQuoteContainer.style.marginTop = '20px';

  const newQuoteText = document.createElement('input');
  newQuoteText.id = 'newQuoteText';
  newQuoteText.type = 'text';
  newQuoteText.placeholder = 'Enter a new quote';
  addQuoteContainer.appendChild(newQuoteText);

  const newQuoteCategory = document.createElement('input');
  newQuoteCategory.id = 'newQuoteCategory';
  newQuoteCategory.type = 'text';
  newQuoteCategory.placeholder = 'Enter quote category';
  addQuoteContainer.appendChild(newQuoteCategory);

  const addButton = document.createElement('button');
  addButton.innerHTML = 'Add Quote';
  addButton.onclick = () => {
    const newQuote = {
      text: document.getElementById('newQuoteText').value,
      category: document.getElementById('newQuoteCategory').value
    };
    quotes.push(newQuote);
    document.getElementById('category').innerHTML = `<option value="">All Categories</option>`;
    for (const quote of quotes) {
      const option = document.createElement('option');
      option.value = quote.category;
      option.textContent = quote.category;
      document.getElementById('category').appendChild(option);
    }
    showRandomQuote();
    addQuoteContainer.remove();
  };
  addQuoteContainer.appendChild(addButton);

  document.body.appendChild(addQuoteContainer);
}

function showRandomQuote() {
  const quoteDisplay = document.getElementById('category');
  const selectedCategory = quoteDisplay.value;

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  const quoteElement = document.createElement('div');
  quoteElement.classList.add('quotation');
  quoteElement.innerHTML = `<p>${randomQuote.text}</p><span>- ${randomQuote.category}</span>`;

  const quoteDisplayContainer = document.getElementById('quoteDisplay');
  quoteDisplayContainer.innerHTML = '';
  quoteDisplayContainer.appendChild(quoteElement);
}

function addQuoteToList(newQuote) {
  const listItem = document.createElement('li');
  listItem.textContent = `${newQuote.text} - ${newQuote.category}`;
  const list = document.getElementById('quotesList');
  list.appendChild(listItem);
}

document.getElementById('newQuote').addEventListener('click', showRandomQuote);

