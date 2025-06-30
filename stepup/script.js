const products = [
  { id: 1, name: "Air Max 90", price: 4999, image: "https://images-cdn.ubuy.co.in/67fbdb3369174ad2b80719d6-nike-air-max-90-ltr-cz5594-100-mens.jpg", sizes: ["6", "7", "8", "9", "10"] },
  { id: 2, name: "Nike Revolution", price: 3499, image: "https://m.media-amazon.com/images/I/61CtN2Bp4XL.UY1000.jpg", sizes: ["6", "7", "9", "10"] },
  { id: 3, name: "Adidas Runner", price: 3999, image: "https://sportsstation.in/cdn/shop/files/Response_Runner_Shoes_Black_ID7336_01_standard.jpg?v=1750398805", sizes: ["7", "8", "9", "10"] },
  { id: 4, name: "Puma Smash", price: 2999, image: "https://www.bbassets.com/media/uploads/p/l/40341086_1-puma-by-cliq-mens-smash-pop-white-casual-sneakers.jpg", sizes: ["6", "7", "8", "9"] },
  { id: 5, name: "Reebok Flex", price: 2799, image: "https://imagescdn.reebok.in/img/app/product/7/797917-9389356.jpg", sizes: ["6", "7", "8", "9", "10"] },
  { id: 6, name: "Campus Comfort", price: 1999, image: "https://www.campusshoes.com/cdn/shop/files/LEVEL_LEVEL_WHT-L.GRY_01.webp?v=1751098173", sizes: ["7", "8", "9", "10"] },
  { id: 7, name: "Air Jordan 1", price: 4299, image: "https://cdn.findyourkicks.com/uploads/all/7RG0VK12g4CI9mtqoKKl6dvG6cPhMnT75OkB1CJb.png", sizes: ["6", "7", "8", "9", "10"] },
  { id: 8, name: "Samba OG", price: 5499, image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/3bbecbdf584e40398446a8bf0117cf62_9366/Samba_OG_Shoes_White_B75806_01_00_standard.jpg", sizes: ["6", "7", "9", "10"] },
  { id: 9, name: "New Balance 574", price: 5599, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB_WjAQa_OSAdLZ3AYi7JITE2pHQ4CqaJmlQ&s", sizes: ["7", "8", "9", "10"] },
  { id: 10, name: "Puma Skyrocket", price: 2999, image: "https://shoppinginibiza.com/187117-large_default/puma-skyrocket-lite-379437-01-mens-black-shoes.jpg", sizes: ["6", "7", "8", "9"] },
];

let cart = [];

function renderProducts(filtered = products) {
  const productGrid = document.getElementById("products");
  productGrid.innerHTML = "";
  filtered.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" onclick="showProductDetails(${product.id})" style="cursor: pointer;">
      <h3>${product.name}</h3>
      <p>₹${product.price}</p>
      <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>

    `;
    productGrid.appendChild(card);
  });
}

function addToCart(id) {
  const item = products.find(p => p.id === id);
  cart.push(item);
  updateCartUI();
  populateSizeDropdown(item.sizes);
}


function updateCartUI() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cartMessage = document.getElementById("cartMessage");

  cartItems.innerHTML = "";
  cartMessage.innerText = "";

  if (cart.length === 0) {
    cartMessage.innerText = "🛒 Your cart is empty.";
    cartTotal.innerText = "Total: ₹0";
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    cartItems.innerHTML += `
      <div class="cart-item">
        <span>${item.name} - ₹${item.price}</span>
        <button onclick="removeItem(${index})">Remove</button>
      </div>
    `;
  });
  cartTotal.innerText = `Total: ₹${total}`;
}


function removeItem(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function applyFilters() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const minPrice = parseInt(document.getElementById("minPrice").value) || 0;
  const maxPrice = parseInt(document.getElementById("maxPrice").value) || Infinity;

  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm) &&
    product.price >= minPrice &&
    product.price <= maxPrice
  );

  renderProducts(filtered);
}

function checkout() {
  const paymentMethodInput = document.querySelector('input[name="payment"]:checked');
  const paymentMethod = paymentMethodInput ? paymentMethodInput.value : "";
  const upiId = document.getElementById("upiIdInput").value.trim();
  const address = document.getElementById("addressInput").value.trim();
  const selectedSize = document.getElementById("selectedSize").value;
  const cartMessage = document.getElementById("cartMessage");

  if (cart.length === 0) {
    cartMessage.innerText = "⚠️ Your cart is empty!";
    return;
  }

  if (!selectedSize) {
    cartMessage.innerText = "⚠️ Please select a shoe size!";
    return;
  }

  if (!address) {
    cartMessage.innerText = "⚠️ Please enter your delivery address!";
    return;
  }

  if (!paymentMethod) {
    cartMessage.innerText = "⚠️ Please select a payment method!";
    return;
  }

  if (paymentMethod === "UPI" && !upiId) {
    cartMessage.innerText = "⚠️ Please enter your UPI ID!";
    return;
  }

  cartMessage.innerHTML = `
    ✅ Order placed successfully with <strong>${paymentMethod}</strong>!<br>
    ${paymentMethod === "UPI" ? `📱 UPI ID: <em>${upiId}</em><br>` : ""}
    🏠 Address: <em>${address}</em><br>
    👟 Size: <strong>${selectedSize}</strong><br>
    🙏 Thank you for purchasing from <strong>Step Up</strong>!
  `;

  cart = [];
  document.getElementById("cartItems").innerHTML = "";
  document.getElementById("cartTotal").innerText = "Total: ₹0";
  document.getElementById("addressInput").value = "";
  document.getElementById("selectedSize").innerHTML = '<option value="">Select Size</option>';
  document.querySelectorAll('input[name="payment"]').forEach(el => el.checked = false);
  document.getElementById("upiIdInput").value = "";
  toggleUpiField(); // Hide the UPI input again

  setTimeout(() => {
    cartMessage.innerText = "";
  }, 6000);
}



function openCart() {
  document.getElementById("cartPanel").classList.add("active");
}

function closeCart() {
  document.getElementById("cartPanel").classList.remove("active");
}

window.onload = () => {
  renderProducts();
};

document.getElementById("toggleCartBtn").addEventListener("click", openCart);
function showProductDetails(id) {
  const product = products.find(p => p.id === id);
  if (product) {
    document.getElementById("modalImage").src = product.image;
    document.getElementById("modalImage").alt = product.name;
    document.getElementById("modalName").innerText = product.name;
    document.getElementById("modalPrice").innerText = "Price: ₹" + product.price;

    const sizeList = product.sizes && product.sizes.length
      ? product.sizes.join(", ")
      : "Not available";

    document.getElementById("sizeList").innerText = sizeList;

    document.getElementById("productModal").style.display = "flex";
  }
}

function closeModal() {
  document.getElementById("productModal").style.display = "none";
}
function populateSizeDropdown(sizes = []) {
  const sizeSelect = document.getElementById("selectedSize");
  sizeSelect.innerHTML = '<option value="">Select Size</option>'; // reset

  sizes.forEach(size => {
    const option = document.createElement("option");
    option.value = size;
    option.textContent = size;
    sizeSelect.appendChild(option);
  });
}
function validateSizeSelection() {
  const selectedSize = document.getElementById("selectedSize").value;
  const warningBox = document.getElementById("sizeWarning");

  if (!selectedSize) {
    warningBox.innerText = "";
    return;
  }

  const allSizesAvailable = cart.every(item =>
    item.sizes.includes(selectedSize)
  );

  if (!allSizesAvailable) {
    warningBox.innerText = `⚠️ Size ${selectedSize} is not available for all items in the cart.`;
  } else {
    warningBox.innerText = "";
  }
}
function toggleUpiField() {
  const selectedPayment = document.querySelector('input[name="payment"]:checked').value;
  const upiField = document.getElementById("upiIdField");

  if (selectedPayment === "UPI") {
    upiField.style.display = "block";
  } else {
    upiField.style.display = "none";
  }
}
document.getElementById("contactUsBtn").addEventListener("click", function () {
  const details = document.getElementById("contactDetails");
  details.style.display = details.style.display === "none" ? "block" : "none";
});

