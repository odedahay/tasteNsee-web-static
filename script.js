const menuToggle = document.querySelector('.site-header__menu-toggle');
const primaryNav = document.querySelector('.site-header__nav');
const dropdown = document.querySelector('.site-header__dropdown');
const dropdownToggle = document.querySelector('.site-header__dropdown-toggle');

function closeMenu() {
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Open navigation');
  primaryNav?.classList.remove('is-open');
  document.body.classList.remove('is-menu-open');
}

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  primaryNav?.classList.toggle('is-open', !isOpen);
  document.body.classList.toggle('is-menu-open', !isOpen && window.innerWidth <= 560);
});

dropdownToggle?.addEventListener('click', (event) => {
  event.stopPropagation();
  const isOpen = dropdown?.classList.toggle('is-open') ?? false;
  dropdownToggle.setAttribute('aria-expanded', String(isOpen));
});

document.addEventListener('click', (event) => {
  if (dropdown && !dropdown.contains(event.target)) {
    dropdown.classList.remove('is-open');
    dropdownToggle?.setAttribute('aria-expanded', 'false');
  }
});

primaryNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    closeMenu();
    dropdown?.classList.remove('is-open');
    dropdownToggle?.setAttribute('aria-expanded', 'false');
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1100) closeMenu();
});

const testimonialTrack = document.querySelector('.testimonials__track');
const testimonialDots = [...document.querySelectorAll('.testimonials__dot')];

function showTestimonial(index) {
  if (!testimonialTrack || window.innerWidth > 820) return;
  testimonialTrack.style.transform = `translateX(-${index * 100}%)`;
  testimonialDots.forEach((dot, dotIndex) => {
    dot.classList.toggle('testimonials__dot--active', dotIndex === index);
    dot.setAttribute('aria-pressed', String(dotIndex === index));
  });
}

testimonialDots.forEach((dot, index) => {
  dot.addEventListener('click', () => showTestimonial(index));
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 820 && testimonialTrack) {
    testimonialTrack.style.transform = '';
  }
});

const newsletterForm = document.querySelector('.newsletter__form');
const newsletterMessage = document.querySelector('.newsletter__message');

newsletterForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const emailInput = newsletterForm.querySelector('input[type="email"]');

  if (!emailInput?.checkValidity()) {
    newsletterMessage.textContent = 'Please enter a valid email address.';
    emailInput?.focus();
    return;
  }

  newsletterMessage.textContent = 'Thank you! You’re on the list.';
  newsletterForm.reset();
});

document.querySelectorAll('[data-current-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const galleryFilters = [...document.querySelectorAll('[data-gallery-filter]')];
const galleryCards = [...document.querySelectorAll('.gallery-card[data-category]')];
const galleryCount = document.querySelector('[data-gallery-count]');

galleryFilters.forEach((filterButton) => {
  filterButton.addEventListener('click', () => {
    const selectedCategory = filterButton.dataset.galleryFilter;
    let visibleCount = 0;

    galleryCards.forEach((card) => {
      const isVisible = selectedCategory === 'all' || card.dataset.category === selectedCategory;
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    galleryFilters.forEach((button) => {
      const isActive = button === filterButton;
      button.classList.toggle('gallery-filter--active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    if (galleryCount) galleryCount.textContent = String(visibleCount);
  });
});
