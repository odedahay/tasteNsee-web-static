const menuToggle = document.querySelector('.site-header__menu-toggle');
const primaryNav = document.querySelector('.site-header__nav');
const dropdown = document.querySelector('.site-header__dropdown');
const dropdownToggle = document.querySelector('.site-header__dropdown-toggle');
const siteHeader = document.querySelector('.site-header');

function updateStickyHeader() {
  siteHeader?.classList.toggle('site-header--scrolled', window.scrollY > 8);
}

updateStickyHeader();
window.addEventListener('scroll', updateStickyHeader, { passive: true });

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

const testimonialsSlider = document.querySelector('[data-testimonials-slider]');

if (testimonialsSlider && window.Swiper) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  new window.Swiper(testimonialsSlider, {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    speed: prefersReducedMotion ? 0 : 700,
    autoplay: prefersReducedMotion
      ? false
      : {
          delay: 4500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
    pagination: {
      el: '.testimonials__pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.testimonials__button--next',
      prevEl: '.testimonials__button--previous',
    },
    a11y: {
      prevSlideMessage: 'Previous testimonial',
      nextSlideMessage: 'Next testimonial',
      paginationBulletMessage: 'Go to testimonial group {{index}}',
    },
    breakpoints: {
      700: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      1100: {
        slidesPerView: 3,
        spaceBetween: 48,
      },
    },
  });
}

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
const galleryModal = document.querySelector('#gallery-modal');

if (galleryModal) {
  const modalImage = galleryModal.querySelector('[data-gallery-modal-image]');
  const modalTitle = galleryModal.querySelector('.gallery-modal__title');
  const modalCategory = galleryModal.querySelector('[data-gallery-modal-category]');

  document.querySelectorAll('[data-gallery-title]').forEach((card) => {
    card.addEventListener('click', () => {
      const photo = card.querySelector('img');
      modalImage.src = photo.currentSrc || photo.src;
      modalImage.alt = photo.alt;
      modalTitle.textContent = card.dataset.galleryTitle;
      modalCategory.textContent = card.dataset.galleryCategory || card.querySelector('.gallery-card__tag')?.textContent || '';
      galleryModal.showModal();
      document.body.classList.add('is-gallery-modal-open');
    });
  });

  galleryModal.querySelector('.gallery-modal__close').addEventListener('click', () => galleryModal.close());
  galleryModal.addEventListener('click', (event) => {
    const bounds = galleryModal.getBoundingClientRect();
    if (event.target === galleryModal && (
      event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom
    )) galleryModal.close();
  });
  galleryModal.addEventListener('close', () => {
    document.body.classList.remove('is-gallery-modal-open');
  });
}

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

document.querySelectorAll('[data-faq-trigger]').forEach((trigger) => {
  const panelId = trigger.getAttribute('aria-controls');
  const panel = panelId ? document.getElementById(panelId) : null;

  if (!panel) return;

  function setAccordionState(isOpen) {
    trigger.setAttribute('aria-expanded', String(isOpen));
    panel.setAttribute('aria-hidden', String(!isOpen));
    panel.dataset.open = String(isOpen);
    trigger.querySelector('i')?.classList.toggle('ri-add-line', !isOpen);
    trigger.querySelector('i')?.classList.toggle('ri-subtract-line', isOpen);
  }

  setAccordionState(trigger.getAttribute('aria-expanded') === 'true');

  trigger.addEventListener('click', () => {
    const willOpen = trigger.getAttribute('aria-expanded') !== 'true';
    setAccordionState(willOpen);
  });
});

const copyLinkButtons = [...document.querySelectorAll('[data-copy-link]')];
const copyMessage = document.querySelector('[data-copy-message]');

copyLinkButtons.forEach((copyLinkButton) => {
  copyLinkButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      if (copyMessage) copyMessage.textContent = 'Page link copied.';
    } catch {
      if (copyMessage) copyMessage.textContent = 'Copy unavailable. Please copy the address from your browser.';
    }
  });
});

const consultationForm = document.querySelector('.consultation-form');
const consultationMessage = document.querySelector('[data-consultation-message]');

consultationForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const isContactForm = consultationForm.dataset.formType === 'contact';
  const isQuoteForm = consultationForm.dataset.formType === 'quote';

  if (!consultationForm.checkValidity()) {
    consultationForm.reportValidity();
    if (consultationMessage) {
      consultationMessage.textContent = isQuoteForm
        ? 'Please complete all required quote details.'
        : isContactForm
          ? 'Please complete all required fields.'
          : 'Please complete your name and email.';
    }
    return;
  }

  if (consultationMessage) {
    consultationMessage.textContent = isQuoteForm
      ? 'Thank you! Your cake quote request is ready to send.'
      : isContactForm
        ? 'Thank you! Your message is ready to send.'
        : 'Thank you! Your consultation request is ready to send.';
  }
});

const inspirationUpload = document.querySelector('[data-upload-input]');
const inspirationUploadLabel = document.querySelector('[data-upload-label]');

inspirationUpload?.addEventListener('change', () => {
  const selectedFiles = inspirationUpload.files;
  if (inspirationUploadLabel) {
    inspirationUploadLabel.textContent = selectedFiles?.length
      ? `${selectedFiles.length} image${selectedFiles.length === 1 ? '' : 's'} selected`
      : 'Browse images';
  }
});

document.querySelectorAll('[data-character-counter]').forEach((counter) => {
  const fieldId = counter.dataset.characterCounter;
  const field = fieldId ? document.getElementById(fieldId) : null;

  field?.addEventListener('input', () => {
    counter.textContent = `${field.value.length} chars`;
  });
});

const registrationForm = document.querySelector('.registration-form');
const registrationMessage = document.querySelector('[data-registration-message]');

registrationForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!registrationForm.checkValidity()) {
    registrationForm.reportValidity();
    if (registrationMessage) registrationMessage.textContent = 'Please complete all required fields and consent choices.';
    return;
  }

  if (registrationMessage) {
    registrationMessage.textContent = registrationForm.id === 'private-event-booking-form'
      ? 'Thank you! Your private event request details are complete.'
      : 'Thank you! Your workshop registration details are complete.';
  }
});

document.querySelectorAll('.workshops-events-page .activity-card').forEach((card) => {
  const body = card.querySelector('.activity-card__body');
  if (!body || body.querySelector('.activity-card__read-more')) return;

  const actions = document.createElement('div');
  actions.className = 'activity-card__actions';

  const readMore = document.createElement('a');
  readMore.className = 'activity-card__read-more';
  const cardCollection = card.closest('[data-card-details-page]');
  readMore.href = cardCollection?.dataset.cardDetailsPage || 'workshop-details.html';
  readMore.innerHTML = 'Read More <i class="ri-arrow-right-s-line" aria-hidden="true"></i>';
  actions.append(readMore);

  const registrationLink = body.querySelector('.activity-card__event-button');
  if (registrationLink) actions.append(registrationLink);

  body.append(actions);
});

const blogPosts = [...document.querySelectorAll('[data-blog-post]')];
const blogEmptyMessage = document.querySelector('[data-blog-empty]');
const blogFilterButtons = [...document.querySelectorAll('[data-blog-filter]')];
const blogQueryButtons = [...document.querySelectorAll('[data-blog-query]')];
const blogTopicLinks = [...document.querySelectorAll('[data-blog-topic]')];

function filterBlogPosts({ category = 'all', query = '' } = {}) {
  const normalizedQuery = query.trim().toLowerCase();
  let visibleCount = 0;

  blogPosts.forEach((post) => {
    const matchesCategory = category === 'all' || post.dataset.blogCategory === category;
    const matchesQuery = !normalizedQuery || post.dataset.blogSearchText?.includes(normalizedQuery);
    const isVisible = matchesCategory && matchesQuery;
    post.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  if (blogEmptyMessage) blogEmptyMessage.hidden = visibleCount !== 0;

  blogFilterButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.blogFilter === category);
  });

  blogQueryButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.blogQuery === normalizedQuery);
  });
}

blogFilterButtons.forEach((button) => {
  button.addEventListener('click', () => filterBlogPosts({ category: button.dataset.blogFilter }));
});

blogQueryButtons.forEach((button) => {
  button.addEventListener('click', () => filterBlogPosts({ query: button.dataset.blogQuery }));
});

blogTopicLinks.forEach((link) => {
  link.addEventListener('click', () => filterBlogPosts({ category: link.dataset.blogTopic }));
});

const blogSubscribeForm = document.querySelector('[data-blog-subscribe]');
const blogSubscribeMessage = document.querySelector('[data-blog-subscribe-message]');

blogSubscribeForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const emailInput = blogSubscribeForm.querySelector('input[type="email"]');

  if (!emailInput?.checkValidity()) {
    if (blogSubscribeMessage) blogSubscribeMessage.textContent = 'Please enter a valid email address.';
    emailInput?.focus();
    return;
  }

  if (blogSubscribeMessage) blogSubscribeMessage.textContent = 'Thank you! You’re on the list.';
  blogSubscribeForm.reset();
});
