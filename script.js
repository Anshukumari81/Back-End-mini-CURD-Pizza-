const apiUrl = 'http://localhost:3000/items';

// Show the form and set the mode (Add or Edit)
function showForm(mode, pizza = {}) {
  const formSection = document.getElementById('form-section');
  const formTitle = document.getElementById('form-title');
  const pizzaId = document.getElementById('pizza-id');
  const nameInput = document.getElementById('name');
  const priceInput = document.getElementById('price');

  if (mode === 'add') {
    formTitle.textContent = 'Add New Pizza';
    pizzaId.value = '';
    nameInput.value = '';
    priceInput.value = '';
  } else if (mode === 'edit') {
    formTitle.textContent = 'Edit Pizza';
    pizzaId.value = pizza.id;
    nameInput.value = pizza.name;
    priceInput.value = pizza.price;
  }
  formSection.style.display = 'block';
}

// Handle form submission
function handleFormSubmit(event) {
  event.preventDefault();

  const id = document.getElementById('pizza-id').value;
  const name = document.getElementById('name').value;
  const price = parseFloat(document.getElementById('price').value);

  if (id) {
    // Update existing pizza
    fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, price })
    })
    .then(response => response.json())
    .then(data => {
      fetchPizzas();
      showForm('add');
    });
  } else {
    // Add new pizza
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, price })
    })
    .then(response => response.json())
    .then(data => {
      fetchPizzas();
      showForm('add');
    });
  }
}

// Fetch and display all pizzas
function fetchPizzas() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(pizzas => {
      const pizzaList = document.getElementById('pizza-list');
      pizzaList.innerHTML = '';
      pizzas.forEach(pizza => {
        const listItem = document.createElement('li');
        listItem.textContent = `${pizza.name} - $${pizza.price.toFixed(2)}`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deletePizza(pizza.id);
        listItem.appendChild(deleteButton);
        listItem.onclick = () => showForm('edit', pizza);
        pizzaList.appendChild(listItem);
      });
    });
}

// Delete a pizza by ID
function deletePizza(id) {
  fetch(`${apiUrl}/${id}`, {
    method: 'DELETE'
  })
  .then(() => {
    fetchPizzas();
  });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', fetchPizzas);
