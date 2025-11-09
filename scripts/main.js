document.addEventListener('DOMContentLoaded', () => {

  
  const allProducts = [
    'Diwal Hamper', 'Mini Diwal Box', 'Handmade Diwali Card', 'Luxury Diwali Hamper',
    'Diwali Hamper', 'Diwali hamper box', 'Customised Birthday Hamper',
    'Hand Embroidered Handkerchief', 'Birthday hamper box',
    'Customised S Letter handkerchief', 'Heart Shaped Chocolate Box',
    'Handmade Birthday Letter', 'Handmade Woolen Keychain',
    'A Letter Customisable Handkerchief', 'Customisable Embroidered Weddinghoop'
  ];

  const featuredSection = document.getElementById('featured-products');
  const searchInput = document.getElementById('search-input');
  const suggestionsDiv = document.getElementById('search-suggestions');
  const productCards = document.querySelectorAll('.product-card');

 
  const userLoggedIn = localStorage.getItem('user_logged_in') === 'true';
  const userData = JSON.parse(localStorage.getItem('user_data'));
  const userId = userData ? (userData.id || userData.email) : null;

 
  function getCartKey() {
    return userId ? `homemade_cart_user_${userId}` : 'homemade_cart_guest';
  }

  function getCart() {
    const data = localStorage.getItem(getCartKey());
    return data ? JSON.parse(data) : [];
  }

  function saveCart(cart) {
    localStorage.setItem(getCartKey(), JSON.stringify(cart));
    updateCartCount();
  }

  function updateCartCount() {
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
      const cart = getCart();
      const total = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
      cartCountEl.textContent = total;
    }
  }

  function addItemToCart(product, quantity, imageSrc) {
    if (!userLoggedIn) {
      alert("Please log in to add items to your cart!");
      window.location.href = "login.html";
      return;
    }

    let cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id);
    const discountedPrice = product.price * (1 - product.discount / 100);

    if (quantity > 0) {
      if (existingIndex > -1) {
        cart[existingIndex].quantity = quantity;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          originalPrice: product.price,
          discountPercent: product.discount,
          currentPrice: parseFloat(discountedPrice.toFixed(2)),
          quantity: quantity,
          imageSrc: imageSrc
        });
      }
      alert(`${quantity} unit(s) of "${product.name}" added to your cart!`);
    } else if (existingIndex > -1) {
      cart.splice(existingIndex, 1);
      alert(`"${product.name}" removed from your cart.`);
    }

    saveCart(cart);
  }

 
  updateCartCount();

 
  if (featuredSection) {
    featuredSection.addEventListener('click', (e) => {
      const target = e.target;

      if (target.classList.contains('qty-btn')) {
        const action = target.dataset.action;
        const input = document.getElementById(target.dataset.target);
        let currentValue = parseInt(input.value);
        input.value = action === 'increment'
          ? Math.min(parseInt(input.max), currentValue + 1)
          : Math.max(0, currentValue - 1);
      }

      if (target.classList.contains('btn-add-to-cart')) {
        const qtyInput = document.getElementById(target.dataset.qtyInput);
        const quantity = parseInt(qtyInput.value) || 0;

        const productCard = target.closest('.product-card');
        const image = productCard.querySelector('img');
        const product = {
          id: target.dataset.id,
          name: target.dataset.name,
          price: parseFloat(target.dataset.price),
          discount: parseInt(target.dataset.discount) || 0
        };

        addItemToCart(product, quantity, image.src);
      }
    });
  }

 
  if (searchInput && suggestionsDiv) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      suggestionsDiv.innerHTML = '';
      if (query.length === 0) return;

      const filtered = allProducts.filter(p => p.toLowerCase().includes(query));
      filtered.forEach(item => {
        const div = document.createElement('div');
        div.textContent = item;
        div.classList.add('suggestion-item');
        div.addEventListener('click', () => {
          searchInput.value = item;
          suggestionsDiv.innerHTML = '';
        });
        suggestionsDiv.appendChild(div);
      });
    });
  }

  
  function checkLoginStatus() {
    const loginLink = document.getElementById('login-link');
    const userDisplay = document.getElementById('user-display');

    if (!loginLink) return;

    if (userLoggedIn && userData && userData.email) {
      const userName = userData.email.split('@')[0];
      loginLink.textContent = `👋 Hi, ${userName}`;
      loginLink.href = "dashboard.html";

     
      if (userDisplay) {
        userDisplay.innerHTML = `
          👋 Hi, ${userName} | <span id="logout-btn" style="color:#b12704;cursor:pointer;text-decoration:underline;">Logout</span>
        `;
        document.body.addEventListener('click', (e) => {
          if (e.target.id === 'logout-btn') {
            localStorage.removeItem('user_data');
            localStorage.removeItem('user_logged_in');
            window.location.href = "login.html";
          }
        });
      }
    } else {
      loginLink.textContent = 'Sign In / Register';
      loginLink.href = 'login.html';
    }
  }

  checkLoginStatus();
});
