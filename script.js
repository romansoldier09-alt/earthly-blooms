/* ============================================
   EARTHLY BLOOMS - JavaScript
   Handles: floating leaves, carousel, cart, parallax
   ============================================ */

(function() {
  'use strict';

  // ============================================
  // CART FUNCTIONALITY
  // ============================================
  let cartCount = 0;
  const cartCountEl = document.getElementById('cartCount');
  const cartToast = document.getElementById('cartToast');
  const toastMessage = document.getElementById('toastMessage');

  function showCartToast(productName) {
    toastMessage.textContent = 'Added "' + productName + '" to cart!';
    cartToast.classList.add('show');
    setTimeout(function() {
      cartToast.classList.remove('show');
    }, 3000);
  }

  function initCart() {
    var buttons = document.querySelectorAll('.add-to-cart-btn');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function() {
        var productName = this.getAttribute('data-product');
        cartCount++;
        cartCountEl.textContent = cartCount;
        showCartToast(productName);
        
        var cartIcon = document.getElementById('cartIcon');
        cartIcon.style.transform = 'scale(1.15)';
        setTimeout(function() {
          cartIcon.style.transform = '';
        }, 200);
      });
    }
  }

  // ============================================
  // FLOATING LEAVES ANIMATION
  // ============================================
  var leafContainer = document.getElementById('floatingLeaves');

  function createLeaf() {
    if (!leafContainer) return;
    
    var leaf = document.createElement('div');
    leaf.className = 'floating-leaf';
    leaf.style.left = (Math.random() * 100) + '%';
    
    var duration = 15 + Math.random() * 8;
    leaf.style.animationDuration = duration + 's';
    leaf.style.animationDelay = (Math.random() * 8) + 's';
    
    var size = 18 + Math.random() * 14;
    leaf.style.width = size + 'px';
    leaf.style.height = size + 'px';
    
    leafContainer.appendChild(leaf);
    
    setTimeout(function() {
      if (leaf.parentNode) {
        leaf.parentNode.removeChild(leaf);
      }
    }, duration * 1000);
  }

  function initLeaves() {
    if (!leafContainer) return;
    for (var i = 0; i < 5; i++) {
      createLeaf();
    }
    setInterval(createLeaf, 4000);
  }

  // ============================================
  // PRODUCT CAROUSEL
  // ============================================
  var carouselTrack = document.getElementById('carouselTrack');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var indicators = document.querySelectorAll('.indicator');

  var currentIndex = 0;
  var totalSlides = 4;
  var cardWidth = 260; // card width + gap

  function getVisibleCards() {
    var w = window.innerWidth;
    if (w <= 480) return 1;
    if (w <= 768) return 2;
    return 3;
  }

  function updateCarousel() {
    if (!carouselTrack) return;
    var offset = -currentIndex * cardWidth;
    carouselTrack.style.transform = 'translateX(' + offset + 'px)';
    
    var maxIndex = totalSlides - getVisibleCards();
    for (var i = 0; i < indicators.length; i++) {
      indicators[i].classList.remove('active');
      indicators[i].setAttribute('aria-selected', 'false');
      if (i === currentIndex || (currentIndex >= maxIndex && i === maxIndex)) {
        indicators[i].classList.add('active');
        indicators[i].setAttribute('aria-selected', 'true');
      }
    }
  }

  function initCarousel() {
    if (!prevBtn || !nextBtn) return;
    
    prevBtn.addEventListener('click', function() {
      var maxIndex = totalSlides - getVisibleCards();
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

    nextBtn.addEventListener('click', function() {
      var maxIndex = totalSlides - getVisibleCards();
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
      }
    });

    for (var i = 0; i < indicators.length; i++) {
      indicators[i].addEventListener('click', function(idx) {
        return function() {
          currentIndex = idx;
          updateCarousel();
        };
      }(i));
    }

    window.addEventListener('resize', function() {
      currentIndex = Math.min(currentIndex, totalSlides - getVisibleCards());
      updateCarousel();
    });

    // ============================================
    // TOUCH SWIPE SUPPORT
    // ============================================
    var carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
      var touchStartX = 0;
      var touchEndX = 0;
      var minSwipeDistance = 50;

      carouselContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      carouselContainer.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });

      function handleSwipe() {
        var swipeDistance = touchEndX - touchStartX;
        var maxIndex = totalSlides - getVisibleCards();
        
        // Swipe left = next product
        if (swipeDistance < -minSwipeDistance) {
          if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
          }
        }
        // Swipe right = previous product
        else if (swipeDistance > minSwipeDistance) {
          if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
          }
        }
      }
    }
  }

  // ============================================
  // PRODUCT DETAIL MODAL
  // ============================================
  var productData = {
    'lavender-sage': {
      name: 'Lavender & Sage Soap',
      description: 'Calming lavender with grounding sage essential oils.',
      ingredients: 'Olive oil, coconut oil, shea butter, lavender essential oil, sage essential oil, lye, distilled water.',
      price: '$15.00',
      gradient: 'linear-gradient(135deg, #9aaa8d 0%, #7a8a6d 100%)',
      label: 'Lavender & Sage'
    },
    'honey-oat': {
      name: 'Honey & Oat Bar',
      description: 'Raw honey and colloidal oatmeal for gentle cleansing.',
      ingredients: 'Olive oil, coconut oil, shea butter, raw honey, colloidal oats, lye, distilled water.',
      price: '$15.00',
      gradient: 'linear-gradient(135deg, #c98254 0%, #a66b3f 100%)',
      label: 'Honey & Oat'
    },
    'eucalyptus-refresh': {
      name: 'Eucalyptus Refresh',
      description: 'Refreshing eucalyptus with a hint of peppermint.',
      ingredients: 'Olive oil, coconut oil, shea butter, eucalyptus essential oil, peppermint essential oil, lye, distilled water.',
      price: '$15.00',
      gradient: 'linear-gradient(135deg, #8b9a7d 0%, #6b7a5d 100%)',
      label: 'Eucalyptus'
    },
    'citrus-bliss': {
      name: 'Citrus Bliss Bar',
      description: 'Bright citrus blend with orange and lemon oils.',
      ingredients: 'Olive oil, coconut oil, shea butter, orange essential oil, lemon essential oil, lye, distilled water.',
      price: '$15.00',
      gradient: 'linear-gradient(135deg, #b8956e 0%, #9a7a54 100%)',
      label: 'Citrus Blend'
    }
  };

  var modal = document.getElementById('productModal');
  var modalClose = document.getElementById('modalClose');
  var modalTitle = document.getElementById('modalTitle');
  var modalImage = document.getElementById('modalImage');
  var modalDescription = document.querySelector('.modal-description');
  var modalIngredients = document.querySelector('.modal-ingredients p');
  var modalPrice = document.querySelector('.modal-price');
  var modalAddToCart = document.getElementById('modalAddToCart');
  var modalOrderBtn = document.getElementById('modalOrderBtn');
  var currentProduct = '';

  function openModal(productId) {
    var data = productData[productId];
    if (!data) return;
    
    currentProduct = productId;
    modalTitle.textContent = data.name;
    modalDescription.textContent = data.description;
    modalIngredients.textContent = data.ingredients;
    modalPrice.textContent = data.price;
    modalImage.style.background = data.gradient;
    modalImage.innerHTML = '<span class="placeholder-text">' + data.label + '</span>';
    
    modalAddToCart.setAttribute('data-product', data.name);
    modalOrderBtn.href = 'mailto:hello@earthlyblooms.com?subject=Soap Order Inquiry&body=Hi, I would like to order: ' + encodeURIComponent(data.name);
    
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus trap for accessibility
    setTimeout(function() {
      modalClose.focus();
    }, 100);
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function initModal() {
    if (!modal) return;
    
    // Open modal on View Details button click
    var viewDetailsBtns = document.querySelectorAll('.view-details-btn');
    for (var i = 0; i < viewDetailsBtns.length; i++) {
      viewDetailsBtns[i].addEventListener('click', function() {
        var productId = this.getAttribute('data-product');
        openModal(productId);
      });
    }
    
    // Close modal on close button click
    if (modalClose) {
      modalClose.addEventListener('click', function() {
        closeModal();
      });
    }
    
    // Close modal on overlay click
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // ============================================
  // PARALLAX EFFECT
  // ============================================
  var aboutSection = document.querySelector('.about');

  function initParallax() {
    if (!aboutSection) return;
    window.addEventListener('scroll', function() {
      var scrolled = window.pageYOffset;
      var aboutTop = aboutSection.offsetTop;
      var aboutHeight = aboutSection.offsetHeight;
      
      if (scrolled + window.innerHeight > aboutTop && 
          scrolled < aboutTop + aboutHeight) {
        var val = (scrolled - aboutTop) * 0.1;
        aboutSection.style.backgroundPosition = 'center ' + val + 'px';
      }
    });
  }

  // ============================================
  // BUTTON RIPPLE EFFECT
  // ============================================
  function initRipple() {
    var buttons = document.querySelectorAll('.btn');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function(e) {
        var btn = this;
        var circle = document.createElement('span');
        var diameter = Math.max(btn.clientWidth, btn.clientHeight);
        var radius = diameter / 2;

        circle.style.width = circle.style.height = diameter + 'px';
        circle.style.left = (e.clientX - btn.getBoundingClientRect().left - radius) + 'px';
        circle.style.top = (e.clientY - btn.getBoundingClientRect().top - radius) + 'px';
        circle.className = 'ripple';

        var existing = btn.getElementsByClassName('ripple')[0];
        if (existing) existing.parentNode.removeChild(existing);

        btn.appendChild(circle);
      });
    }
  }

  // ============================================
  // SMOOTH SCROLL
  // ============================================
  function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < anchors.length; i++) {
      anchors[i].addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href && href.length > 1) {
          var target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    }
  }

  // ============================================
  // INITIALIZE ALL
  // ============================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initCart();
      initLeaves();
      initCarousel();
      initModal();
      initParallax();
      initRipple();
      initSmoothScroll();
    });
  } else {
    initCart();
    initLeaves();
    initCarousel();
    initModal();
    initParallax();
    initRipple();
    initSmoothScroll();
  }

})();
