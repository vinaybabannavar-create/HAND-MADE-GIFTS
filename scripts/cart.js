document.addEventListener('DOMContentLoaded', () => {
  const featuredSection = document.getElementById('featured-products');


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

  function addItemToCart(product, quantity = 1) {
    if (!userLoggedIn) {
      alert("Please log in to add items to your cart!");
      window.location.href = "login.html";
      return;
    }

    let cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id);
    const discountedPrice = product.price * (1 - product.discount / 100);

    if (existingIndex > -1) {
      cart[existingIndex].quantity = quantity; // update
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        originalPrice: product.price,
        discountPercent: product.discount,
        currentPrice: parseFloat(discountedPrice.toFixed(2)),
        quantity: quantity,
        imageSrc: product.imageSrc || ''
      });
    }

    saveCart(cart);
    alert(`${quantity} unit(s) of "${product.name}" added to your cart!`);
  }

  
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
          discount: parseInt(target.dataset.discount) || 0,
          imageSrc: image ? image.src : ''
        };

        if (quantity > 0) {
          addItemToCart(product, quantity);
        } else {
         
          const cart = getCart().filter(item => item.id !== product.id);
          saveCart(cart);
          alert(`"${product.name}" removed from your cart.`);
        }
      }
    });
  }

  
  updateCartCount();
});
