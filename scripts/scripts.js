// Load navbar and manage hamburger menu
fetch("header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;

    const hamburger = document.getElementById('hamburger');
    const overlayMenu = document.getElementById('overlayMenu');

    function closeMenu() {
      hamburger.classList.remove('active');
      overlayMenu.classList.remove('active');
      document.body.classList.remove('lock-scroll');
    }

    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('active');
      overlayMenu.classList.toggle('active');
      document.body.classList.toggle('lock-scroll', isOpen);
    });

    overlayMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
      if (
        overlayMenu.classList.contains('active') &&
        !overlayMenu.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        closeMenu();
      }
    });
  });

// Loader logic
window.addEventListener("load", () => {
  const loader = document.getElementById("page-loader");
  loader.classList.add("hidden");
});

// Internal link loader
document.querySelectorAll("a").forEach(link => {
  if (!link.href.startsWith("#") && !link.target && link.href.includes(window.location.hostname)) {
    link.addEventListener("click", () => {
      document.getElementById("page-loader").classList.remove("hidden");
    });
  }
});

// Desktop Carousel logic
const slides = document.querySelectorAll('.carousel-slide');
let currentSlide = 0;
let intervalId = null;

function updateCarousel() {
  slides.forEach((slide, index) => {
    slide.classList.remove('active', 'left', 'right');
    if (index === currentSlide) {
      slide.classList.add('active');
    } else if (index === (currentSlide - 1 + slides.length) % slides.length) {
      slide.classList.add('left');
    } else if (index === (currentSlide + 1) % slides.length) {
      slide.classList.add('right');
    }
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  updateCarousel();
}

function startAutoplay() {
  if (intervalId !== null) clearInterval(intervalId);
  intervalId = setInterval(nextSlide, 4000);
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
  startAutoplay();
}

slides.forEach((slide, index) => {
  slide.addEventListener('click', () => goToSlide(index));
});

slides.forEach((slide) => {
  slide.addEventListener('mouseover', () => {
    if (intervalId !== null) clearInterval(intervalId);
  });
  slide.addEventListener('mouseout', () => {
    startAutoplay();
  });
});

window.addEventListener('load', () => {
  updateCarousel();
  startAutoplay();
});

document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("mobile-carousel");
  if (!carousel) return;

  let scrollTimeout;

  function snapToNearestCard() {
    const cards = carousel.querySelectorAll(".mobile-carousel-card");
    const center = carousel.scrollLeft + carousel.offsetWidth / 2;

    let minDistance = Infinity;
    let snapCard = null;

    cards.forEach(card => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(center - cardCenter);
      if (distance < minDistance) {
        minDistance = distance;
        snapCard = card;
      }
    });

    if (snapCard) {
      const scrollTo = snapCard.offsetLeft - (carousel.offsetWidth - snapCard.offsetWidth) / 2;
      carousel.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  }

  carousel.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(snapToNearestCard, 100);
  });
});