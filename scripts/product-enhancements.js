// Auto-add Wishlist Hearts and Enhanced Cart Features
// This script automatically adds heart icons to all product cards

document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // AUTO-ADD WISHLIST HEARTS TO ALL PRODUCTS
    // ========================================

    function addWishlistHeartsToAllProducts() {
        const productCards = document.querySelectorAll('.product-card');
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        productCards.forEach((card, index) => {
            // Skip if heart already exists
            if (card.querySelector('.wishlist-heart')) return;

            // Get product info
            const addToCartBtn = card.querySelector('.btn-add-to-cart');
            if (!addToCartBtn) return;

            const productId = addToCartBtn.getAttribute('data-id') || `product-${index + 1}`;
            const isFavorite = favorites.some(fav => fav.id === productId);

            // Get discount percentage for badge
            const discountElem = card.querySelector('.offer-percent');
            const discountText = discountElem ? discountElem.textContent.trim() : null;

            // Create wishlist heart
            const heart = document.createElement('div');
            heart.className = 'wishlist-heart';
            if (isFavorite) {
                heart.classList.add('active');
                heart.innerHTML = '♥';
            } else {
                heart.innerHTML = '♡';
            }
            heart.onclick = function () {
                if (typeof window.toggleWishlist === 'function') {
                    window.toggleWishlist(this);
                }
            };

            // Create sale badge if discount exists
            if (discountText && !card.querySelector('.badge-sale')) {
                const badge = document.createElement('div');
                badge.className = 'badge-sale';
                badge.textContent = discountText;
                card.insertBefore(badge, card.firstChild);
            }

            // Create quick view overlay if not exists
            const cardInfo = card.querySelector('.card-info');
            if (cardInfo && !card.querySelector('.quick-view-overlay')) {
                const quickView = document.createElement('div');
                quickView.className = 'quick-view-overlay';
                quickView.textContent = 'Quick View';
                quickView.onclick = function () {
                    if (typeof window.viewProductDetails === 'function') {
                        window.viewProductDetails(productId);
                    }
                };
                cardInfo.appendChild(quickView);
            }

            // Insert heart at the beginning of the card
            card.insertBefore(heart, card.firstChild);
        });
    }

    // Run immediately
    addWishlistHeartsToAllProducts();

    // Re-run after a short delay to catch any dynamically loaded products
    setTimeout(addWishlistHeartsToAllProducts, 500);


    // ========================================
    // ENHANCED CART CELEBRATION ANIMATIONS
    // ========================================

    // ========================================
    // ENHANCED CART CELEBRATION ANIMATIONS
    // ========================================

    // Confetti animation - Make global for access from other scripts
    window.createConfetti = function () {
        const colors = ['#D4AF37', '#C2185B', '#667eea', '#43e97b', '#f093fb'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 3000);
        }
    }

    // Enhanced add to cart and quantity buttons with celebration
    // Delegate to document body for dynamically added buttons
    document.body.addEventListener('click', function (e) {
        const target = e.target;

        // Handle Quantity Buttons
        if (target.closest('.qty-btn')) {
            const btn = target.closest('.qty-btn');
            const action = btn.dataset.action;
            const input = document.getElementById(btn.dataset.target);

            if (input) {
                let currentValue = parseInt(input.value) || 0;
                let maxValue = parseInt(input.max) || 99;

                if (action === 'increment') {
                    input.value = Math.min(maxValue, currentValue + 1);
                } else if (action === 'decrement') {
                    input.value = Math.max(1, currentValue - 1);
                }
            }
        }

        // Handle Add to Cart
        if (target.closest('.btn-add-to-cart')) {
            const btn = target.closest('.btn-add-to-cart');

            // Prevent default just in case, but usually we want valid clicks
            // e.preventDefault(); 

            // Trigger confetti
            createConfetti();

            // Animate the button
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 200);

            // Handle Cart Addition via CartManager
            if (typeof CartManager !== 'undefined') {
                const productCard = btn.closest('.product-card');
                const qtyInput = productCard.querySelector('input[type="number"]');
                const quantity = qtyInput ? parseInt(qtyInput.value) : 1;

                const productId = btn.getAttribute('data-id');
                const name = btn.getAttribute('data-name');
                const price = parseFloat(btn.getAttribute('data-price'));
                const discount = parseInt(btn.getAttribute('data-discount') || 0);
                const image = productCard.querySelector('img') ? productCard.querySelector('img').src : '';

                CartManager.addItem({
                    id: productId,
                    name: name,
                    price: price,
                    discount: discount,
                    imageSrc: image
                }, quantity);

                showNotification(`${quantity} x ${name} added to cart!`, 'success');

            } else {
                console.error("CartManager is strictly required but not found.");
            }
        }
    });

    // Celebration message with smart suggestions - Make global
    window.showCelebrationMessage = function (itemCount) {
        const messages = [
            {
                threshold: 1,
                icon: '🎉',
                title: 'Great Choice!',
                message: 'Add 2 more items to unlock FREE SHIPPING! 🚚',
                color: '#667eea'
            },
            {
                threshold: 2,
                icon: '🔥',
                title: 'You\'re on Fire!',
                message: 'Just 1 more item for FREE SHIPPING + Extra 10% OFF! 🎁',
                color: '#f093fb'
            },
            {
                threshold: 3,
                icon: '✨',
                title: 'Awesome!',
                message: 'FREE SHIPPING Unlocked! Add ₹500 more for 15% OFF! 💰',
                color: '#43e97b'
            },
            {
                threshold: 5,
                icon: '🎊',
                title: 'Amazing!',
                message: 'You\'re a VIP Shopper! Extra 20% OFF applied! 👑',
                color: '#D4AF37'
            }
        ];

        // Find appropriate message
        let selectedMessage = messages[0];
        for (let msg of messages) {
            if (itemCount >= msg.threshold) {
                selectedMessage = msg;
            }
        }

        // Create celebration modal
        const modal = document.createElement('div');
        modal.className = 'celebration-modal';
        modal.innerHTML = `
      <div class="celebration-content" style="border-top: 5px solid ${selectedMessage.color}">
        <div class="celebration-icon">${selectedMessage.icon}</div>
        <h3 class="celebration-title">${selectedMessage.title}</h3>
        <p class="celebration-message">${selectedMessage.message}</p>
        <div class="celebration-actions">
          <button class="btn-continue" onclick="this.closest('.celebration-modal').remove()">
            Continue Shopping
          </button>
          <a href="cart.html" class="btn-view-cart">
            View Cart (${itemCount})
          </a>
        </div>
      </div>
    `;

        document.body.appendChild(modal);

        setTimeout(() => modal.classList.add('show'), 100);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }, 5000);
    }

    // Celebration message with smart suggestions
    function showCelebrationMessage(itemCount) {
        const messages = [
            {
                threshold: 1,
                icon: '🎉',
                title: 'Great Choice!',
                message: 'Add 2 more items to unlock FREE SHIPPING! 🚚',
                color: '#667eea'
            },
            {
                threshold: 2,
                icon: '🔥',
                title: 'You\'re on Fire!',
                message: 'Just 1 more item for FREE SHIPPING + Extra 10% OFF! 🎁',
                color: '#f093fb'
            },
            {
                threshold: 3,
                icon: '✨',
                title: 'Awesome!',
                message: 'FREE SHIPPING Unlocked! Add ₹500 more for 15% OFF! 💰',
                color: '#43e97b'
            },
            {
                threshold: 5,
                icon: '🎊',
                title: 'Amazing!',
                message: 'You\'re a VIP Shopper! Extra 20% OFF applied! 👑',
                color: '#D4AF37'
            }
        ];

        // Find appropriate message
        let selectedMessage = messages[0];
        for (let msg of messages) {
            if (itemCount >= msg.threshold) {
                selectedMessage = msg;
            }
        }

        // Create celebration modal
        const modal = document.createElement('div');
        modal.className = 'celebration-modal';
        modal.innerHTML = `
      <div class="celebration-content" style="border-top: 5px solid ${selectedMessage.color}">
        <div class="celebration-icon">${selectedMessage.icon}</div>
        <h3 class="celebration-title">${selectedMessage.title}</h3>
        <p class="celebration-message">${selectedMessage.message}</p>
        <div class="celebration-actions">
          <button class="btn-continue" onclick="this.closest('.celebration-modal').remove()">
            Continue Shopping
          </button>
          <a href="cart.html" class="btn-view-cart">
            View Cart (${itemCount})
          </a>
        </div>
      </div>
    `;

        document.body.appendChild(modal);

        setTimeout(() => modal.classList.add('show'), 100);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }, 5000);
    }


    // ========================================
    // SCROLL PROGRESS INDICATOR
    // ========================================

    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });


    // ========================================
    // BACK TO TOP BUTTON
    // ========================================

    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

});
