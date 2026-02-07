// Banner Carousel System for E-commerce Site
// Auto-rotating promotional banners with manual controls

class BannerCarousel {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    
    this.banners = this.container.querySelectorAll('.carousel-banner');
    this.currentIndex = 0;
    this.autoRotateInterval = options.interval || 5000;
    this.isPaused = false;
    this.autoRotateTimer = null;
    
    this.init();
  }
  
  init() {
    if (this.banners.length === 0) return;
    
    // Create navigation dots
    this.createDots();
    
    // Create prev/next buttons
    this.createControls();
    
    // Show first banner
    this.showBanner(0);
    
    // Start auto-rotation
    this.startAutoRotate();
    
    // Pause on hover
    this.container.addEventListener('mouseenter', () => this.pause());
    this.container.addEventListener('mouseleave', () => this.resume());
  }
  
  createDots() {
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';
    
    this.banners.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Go to banner ${index + 1}`);
      dot.addEventListener('click', () => this.goToSlide(index));
      dotsContainer.appendChild(dot);
    });
    
    this.container.appendChild(dotsContainer);
    this.dots = dotsContainer.querySelectorAll('.carousel-dot');
  }
  
  createControls() {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-control carousel-prev';
    prevBtn.innerHTML = '&#10094;';
    prevBtn.setAttribute('aria-label', 'Previous banner');
    prevBtn.addEventListener('click', () => this.prev());
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-control carousel-next';
    nextBtn.innerHTML = '&#10095;';
    nextBtn.setAttribute('aria-label', 'Next banner');
    nextBtn.addEventListener('click', () => this.next());
    
    this.container.appendChild(prevBtn);
    this.container.appendChild(nextBtn);
  }
  
  showBanner(index) {
    // Hide all banners
    this.banners.forEach(banner => {
      banner.classList.remove('active');
      banner.style.opacity = '0';
      banner.style.transform = 'translateX(100%)';
    });
    
    // Update dots
    this.dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current banner
    this.banners[index].classList.add('active');
    this.banners[index].style.opacity = '1';
    this.banners[index].style.transform = 'translateX(0)';
    this.dots[index].classList.add('active');
    
    this.currentIndex = index;
  }
  
  next() {
    const nextIndex = (this.currentIndex + 1) % this.banners.length;
    this.showBanner(nextIndex);
  }
  
  prev() {
    const prevIndex = (this.currentIndex - 1 + this.banners.length) % this.banners.length;
    this.showBanner(prevIndex);
  }
  
  goToSlide(index) {
    this.showBanner(index);
    this.resetAutoRotate();
  }
  
  startAutoRotate() {
    this.autoRotateTimer = setInterval(() => {
      if (!this.isPaused) {
        this.next();
      }
    }, this.autoRotateInterval);
  }
  
  resetAutoRotate() {
    clearInterval(this.autoRotateTimer);
    this.startAutoRotate();
  }
  
  pause() {
    this.isPaused = true;
  }
  
  resume() {
    this.isPaused = false;
  }
  
  destroy() {
    clearInterval(this.autoRotateTimer);
  }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const carousel = new BannerCarousel('banner-carousel', {
    interval: 5000 // 5 seconds
  });
});
