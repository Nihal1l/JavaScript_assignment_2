let cartCount = 0;

const loadAllProduct = (query = 'a') => {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`)
    .then((res) => res.json())
    .then((data) => {
      displayProduct(data.drinks);
    });
};

const displayProduct = (products) => {
  const productContainer = document.getElementById("product-container");
  const errorMessage = document.getElementById("error-message");
  
  productContainer.innerHTML = ''; // Clear previous results
  errorMessage.innerText = ''; // Clear error message

  if (!products) {
      errorMessage.innerText = "No drinks found!";
      return;
  }

  products.forEach((product) => {
    const div = document.createElement("div");
    div.classList.add("card");
    
    // Instructions limit to 15 letters
    const instructions = product.strInstructions ? product.strInstructions.slice(0, 15) : "No instructions";

    div.innerHTML = `
        <img class="card-img" src="${product.strDrinkThumb}" alt="${product.strDrink}" />
        <h5>${product.strDrink}</h5>
        <h6>Category: ${product.strCategory}</h6>
        <p>Instructions: ${instructions}...</p>
        <div class="card-buttons">
            <button class="btn-add" onclick="handleAddToCart('${product.strDrink.replace(/'/g, "\\'")}', '${product.strDrinkThumb}')">Add to Group</button>
            <button class="btn-details" onclick="singleProduct('${product.idDrink}')">Details</button>
        </div>
        `;

    productContainer.appendChild(div);
  });
};

const handleSearch = () => {
    const searchBox = document.getElementById("search-box");
    const query = searchBox.value;
    loadAllProduct(query);
};

const handleAddToCart = (name, image) => {
  if (cartCount >= 7) {
      alert("Can not add more than 7 drinks to a group");
      return;
  }

  cartCount = cartCount + 1;
  document.getElementById("count").innerText = cartCount;

  const container = document.getElementById("cart-main-container");

  const div = document.createElement("div");
  div.classList.add("cart-info");
  div.innerHTML = `
    <span class="index">${cartCount}</span>
    <img src="${image}" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;">
    <p>${name}</p>
    `;
  container.appendChild(div);
};

const singleProduct = (id) => {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then((res) => res.json())
    .then((data) => {
        showModal(data.drinks[0]);
    });
};

const showModal = (drink) => {
    const modal = document.getElementById("details-modal");
    const modalInfo = document.getElementById("modal-info");

    modalInfo.innerHTML = `
        <div class="modal-details">
            <img src="${drink.strDrinkThumb}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 10px; margin-bottom: 20px;">
            <h2>${drink.strDrink}</h2>
            <p><strong>Category:</strong> ${drink.strCategory}</p>
            <p><strong>Alcoholic:</strong> ${drink.strAlcoholic}</p>
            <p><strong>Glass:</strong> ${drink.strGlass}</p>
            <p><strong>Instructions:</strong> ${drink.strInstructions}</p>
        </div>
    `;
    
    modal.style.display = "block";
};

const closeModal = () => {
    const modal = document.getElementById("details-modal");
    modal.style.display = "none";
};

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById("details-modal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Initial load
loadAllProduct();
