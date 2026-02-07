/**
 * Cart Manager - Handles all cart-related operations
 * Shared across all pages
 */

const CartManager = (function () {
    'use strict';

    // Private helper to get user data
    function getUser() {
        return JSON.parse(localStorage.getItem("user_data"));
    }

    // Private helper to get cart storage key
    function getCartKey() {
        const user = getUser();
        return user && (user.id || user.email)
            ? `homemade_cart_user_${user.id || user.email}`
            : "homemade_cart_guest";
    }

    // Get current cart
    function getCart() {
        const cart = localStorage.getItem(getCartKey());
        return cart ? JSON.parse(cart) : [];
    }

    // Save cart
    function saveCart(cart) {
        localStorage.setItem(getCartKey(), JSON.stringify(cart));
        updateCartCount();

        // Dispatch custom event for other components to listen to
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
    }

    // Update cart count badge in header
    function updateCartCount() {
        const total = getCart().reduce((sum, i) => sum + i.quantity, 0);
        const countElements = document.querySelectorAll("#cart-count");
        countElements.forEach(el => el.textContent = total);
    }

    // Add item to cart
    function addItem(product, quantity = 1, imageSrc = '') {
        let cart = getCart();
        const existingItemIndex = cart.findIndex(item => item.id === product.id);

        // Calculate discounted price
        let currentPrice = product.price;
        if (product.discount) {
            currentPrice = product.price * (1 - product.discount / 100);
        } else if (product.currentPrice) {
            currentPrice = product.currentPrice;
        }

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                originalPrice: product.price,
                discountPercent: product.discount || 0,
                currentPrice: parseFloat(currentPrice.toFixed(2)),
                quantity: quantity,
                imageSrc: imageSrc || product.imageSrc || product.image // fallback
            });
        }

        saveCart(cart);

        // Trigger celebration if available
        if (window.showCelebrationMessage && typeof window.showCelebrationMessage === 'function') {
            const newCount = cart.reduce((sum, i) => sum + i.quantity, 0);
            window.showCelebrationMessage(newCount);
        }
    }

    // Update item quantity (absolute value)
    function updateItemQuantity(id, quantity) {
        let cart = getCart();
        const index = cart.findIndex(i => i.id === id);
        if (index > -1) {
            if (quantity > 0) {
                cart[index].quantity = quantity;
            } else {
                cart.splice(index, 1);
            }
            saveCart(cart);
        }
    }

    // Remove item
    function removeItem(id) {
        if (confirm("Remove this item from your cart?")) {
            updateItemQuantity(id, 0);
        }
    }

    // Clear cart (e.g. after checkout)
    function clearCart() {
        localStorage.removeItem(getCartKey());
        updateCartCount();
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: [] } }));
    }

    // Public API
    return {
        getCart,
        addItem,
        updateItemQuantity,
        removeItem,
        clearCart,
        updateCartCount,
        init: function () {
            updateCartCount();
        }
    };

})();

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    CartManager.init();
});
