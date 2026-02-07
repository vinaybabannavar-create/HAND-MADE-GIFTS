// Universal Header and Favorites System
// This script injects the modern header and favorites panel into all pages

(function () {
  'use strict';

  // Check if header already exists
  if (document.querySelector('.main-header')) {
    console.log('Header already exists');
    return;
  }

  const headerHTML = `
  <!-- Modern Enhanced Header -->
  <header class="main-header">
    <!-- Top Bar with Promo Message -->
    <div class="header-promo-bar">
      <div class="promo-message">
        <span class="promo-icon">🎉</span>
        <span>Free Shipping on Orders Above ₹999 | Use Code: HANDMADE25 for Extra 25% OFF</span>
        <span class="promo-icon">✨</span>
      </div>
    </div>

    <!-- Main Header Content -->
    <div class="header-main">
      <div class="header-container">
        
        <!-- Logo Section -->
        <div class="header-logo-section">
          <a href="index.html" style="text-decoration: none;">
            <div class="shop-logo">
              <span class="logo-icon">🎁</span>
              <span class="logo-text">
                <span class="logo-main">HandMade</span>
                <span class="logo-sub">Gifts</span>
              </span>
            </div>
          </a>
          <p class="logo-tagline">Crafted with Love ❤️</p>
        </div>

        <!-- Search Section -->
        <div class="search-container-modern">
          <div class="search-wrapper">
            <span class="search-icon">🔍</span>
            <input type="text" id="search-input" placeholder="Search for handcrafted gifts, hampers, decorations...">
            <button id="search-button" class="search-btn">Search</button>
          </div>
          <div id="search-suggestions"></div>
        </div>

        <!-- User Actions Section -->
        <nav class="user-actions">
          <!-- Favorites/Wishlist -->
          <div class="header-action favorites-action">
            <button class="action-btn" id="favorites-btn" onclick="toggleFavoritesPanel()">
              <span class="action-icon">♥</span>
              <span class="action-label">Favorites</span>
              <span id="favorites-count" class="action-badge">0</span>
            </button>
          </div>

          <!-- Cart -->
          <div class="header-action cart-action">
            <a href="cart.html" class="action-btn">
              <span class="action-icon">🛒</span>
              <span class="action-label">Cart</span>
              <span id="cart-count" class="action-badge">0</span>
            </a>
          </div>

          <!-- Account -->
          <div class="header-action account-action">
            <a href="login.html" id="login-link" class="action-btn">
              <span class="action-icon">👤</span>
              <span class="action-label">Account</span>
            </a>
          </div>
        </nav>

      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="main-nav-modern">
      <div class="nav-container">
        <a href="index.html" class="nav-link" data-page="index">
          <span class="nav-icon">🏠</span>
          <span>Home</span>
        </a>
        <a href="about.html" class="nav-link" data-page="about">
          <span class="nav-icon">ℹ️</span>
          <span>About Us</span>
        </a>
        <a href="contact.html" class="nav-link" data-page="contact">
          <span class="nav-icon">📞</span>
          <span>Contact</span>
        </a>
        <a href="dashboard.html" class="nav-link" data-page="dashboard">
          <span class="nav-icon">📊</span>
          <span>Dashboard</span>
        </a>
        <a href="cart.html" class="nav-link" data-page="cart">
          <span class="nav-icon">🛍️</span>
          <span>Shopping</span>
        </a>
        <a href="index.html#featured-products" class="nav-link">
          <span class="nav-icon">✨</span>
          <span>Explore Products</span>
        </a>
        <div class="nav-indicator"></div>
      </div>
    </nav>
  </header>

  <!-- Favorites Sidebar Panel -->
  <div id="favorites-panel" class="favorites-panel">
    <div class="favorites-header">
      <h3>
        <span class="fav-icon">♥</span>
        My Favorites
      </h3>
      <button class="close-panel" onclick="toggleFavoritesPanel()">✕</button>
    </div>
    <div class="favorites-content" id="favorites-list">
      <div class="empty-favorites">
        <span class="empty-icon">♡</span>
        <p>No favorites yet!</p>
        <p class="empty-subtitle">Click the heart icon on products to save them here</p>
      </div>
    </div>
    <div class="favorites-footer">
      <button class="btn-primary" onclick="toggleFavoritesPanel()">Continue Shopping</button>
    </div>
  </div>

  <!-- Overlay for Favorites Panel -->
  <div id="favorites-overlay" class="favorites-overlay" onclick="toggleFavoritesPanel()"></div>
  `;

  // Insert header at the beginning of body
  document.body.insertAdjacentHTML('afterbegin', headerHTML);

  // Set active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const page = link.getAttribute('data-page');
    if (page === currentPage) {
      link.classList.add('active');
    }
  });

  // Update Account Login Status
  function updateAccountStatus() {
    const userLoggedIn = localStorage.getItem('user_logged_in') === 'true';
    const userData = JSON.parse(localStorage.getItem('user_data'));
    const loginLink = document.getElementById('login-link');
    const accountLabel = loginLink.querySelector('.action-label');

    if (userLoggedIn && userData) {
      loginLink.href = 'dashboard.html';
      // Optional: Change icon or label
      if (accountLabel) accountLabel.textContent = 'My Account';
    } else {
      loginLink.href = 'login.html';
      if (accountLabel) accountLabel.textContent = 'Sign In';
    }
  }
  updateAccountStatus();


  // ========================================
  // FAVORITES/WISHLIST SYSTEM
  // ========================================

  // Initialize favorites from localStorage
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  // Toggle Favorites Panel
  window.toggleFavoritesPanel = function () {
    const panel = document.getElementById('favorites-panel');
    const overlay = document.getElementById('favorites-overlay');

    if (!panel || !overlay) return;

    panel.classList.toggle('active');
    overlay.classList.toggle('active');

    if (panel.classList.contains('active')) {
      renderFavorites();
    }
  };

  // Toggle Wishlist (Add/Remove from Favorites)
  window.toggleWishlist = function (element) {
    const productCard = element.closest('.product-card');
    if (!productCard) return;

    const addToCartBtn = productCard.querySelector('.btn-add-to-cart');
    const productId = addToCartBtn ? addToCartBtn.getAttribute('data-id') : null;
    const productName = productCard.querySelector('.product-name') ? productCard.querySelector('.product-name').textContent : 'Unknown Product';
    const productPriceElem = productCard.querySelector('.product-price');
    const productPrice = productPriceElem ? productPriceElem.textContent : '0.00';
    const productImgElem = productCard.querySelector('img');
    const productImg = productImgElem ? productImgElem.src : '';
    const numericPrice = parseFloat(productPrice.replace(/[^\d.]/g, '')) || 0;

    if (!productId) return;

    const product = {
      id: productId,
      name: productName,
      price: productPrice, // string with currency
      numericPrice: numericPrice,
      image: productImg
    };

    const index = favorites.findIndex(fav => fav.id === productId);

    if (index > -1) {
      // Remove from favorites
      favorites.splice(index, 1);
      element.classList.remove('active');
      element.innerHTML = '♡';
      showNotification('Removed from favorites', 'info');
    } else {
      // Add to favorites
      favorites.push(product);
      element.classList.add('active');
      element.innerHTML = '♥';
      showNotification('Added to favorites!', 'success');
    }

    // Save to localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesCount();
  };

  // Render Favorites in Panel
  function renderFavorites() {
    const favoritesList = document.getElementById('favorites-list');
    if (!favoritesList) return;

    if (favorites.length === 0) {
      favoritesList.innerHTML = `
            <div class="empty-favorites">
              <span class="empty-icon">♡</span>
              <p>No favorites yet!</p>
              <p class="empty-subtitle">Click the heart icon on products to save them here</p>
            </div>
          `;
      return;
    }

    favoritesList.innerHTML = favorites.map(product => `
          <div class="favorite-item" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="favorite-item-img">
            <div class="favorite-item-info">
              <div class="favorite-item-name">${product.name}</div>
              <div class="favorite-item-price">${product.price}</div>
               <button class="btn-move-to-cart" onclick="moveFavoriteToCart('${product.id}')">Move to Cart</button>
            </div>
            <button class="favorite-item-remove" onclick="removeFromFavorites('${product.id}')">
              ✕
            </button>
          </div>
        `).join('');
  }

  // Move Single Item to Cart
  window.moveFavoriteToCart = function (productId) {
    const favoriteItem = favorites.find(fav => fav.id === productId);
    if (favoriteItem) {
      // Use global CartManager if available
      if (typeof CartManager !== 'undefined') {
        CartManager.addItem({
          id: favoriteItem.id,
          name: favoriteItem.name,
          price: favoriteItem.numericPrice,
          imageSrc: favoriteItem.image
        });

        // Show celebration
        if (typeof createConfetti === 'function') createConfetti();

        // Remove from favorites after adding to cart
        removeFromFavorites(productId);
        showNotification('Moved to Cart!', 'success');
        toggleFavoritesPanel(); // Compute user intent: likely wants to see cart or stay
      } else {
        console.error("CartManager not found");
      }
    }
  };

  // Remove from Favorites
  window.removeFromFavorites = function (productId) {
    favorites = favorites.filter(fav => fav.id !== productId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites();
    updateFavoritesCount();

    // Update heart icon on product card
    const productCard = document.querySelector(`.btn-add-to-cart[data-id="${productId}"]`)?.closest('.product-card');
    if (productCard) {
      const heart = productCard.querySelector('.wishlist-heart');
      if (heart) {
        heart.classList.remove('active');
        heart.innerHTML = '♡';
      }
    }
  };

  // Update Favorites Count
  function updateFavoritesCount() {
    const count = favorites.length;
    const badge = document.getElementById('favorites-count');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  // Show Notification
  function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification-toast notification-${type}`;
    notification.innerHTML = `
          <span class="notification-icon">${type === 'success' ? '✓' : 'ℹ'}</span>
          <span class="notification-message">${message}</span>
        `;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Initialize favorites on page load
  updateFavoritesCount();

  // Re-check hearts when content changes (e.g. dynamic load)
  document.addEventListener('DOMContentLoaded', () => {
    updateFavoritesCount();
  });

  console.log('Universal header and Favorites system injected successfully');
})();
