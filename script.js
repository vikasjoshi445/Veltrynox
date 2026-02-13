// Mobile nav
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.style.display === 'flex';
    mobileMenu.style.display = isOpen ? 'none' : 'flex';
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.style.display = 'none';
    });
  });
}

// Theme toggle (light/dark)
const themeToggle = document.getElementById('themeToggle');
const prefersDark =
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const storedTheme = window.localStorage.getItem('veltrynox-theme');

function setTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('theme-light');
    if (themeToggle) themeToggle.textContent = '☀';
  } else {
    document.body.classList.remove('theme-light');
    if (themeToggle) themeToggle.textContent = '☾';
  }
  window.localStorage.setItem('veltrynox-theme', theme);
}

setTheme(storedTheme || (prefersDark ? 'dark' : 'dark'));

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = document.body.classList.contains('theme-light') ? 'dark' : 'light';
    setTheme(next);
  });
}

// FAQ accordion
document.querySelectorAll('.faq-item').forEach((item) => {
  const header = item.querySelector('.faq-header');
  header.addEventListener('click', () => {
    const isOpen = item.classList.contains('faq-item--open');
    document
      .querySelectorAll('.faq-item')
      .forEach((i) => i.classList.remove('faq-item--open'));
    if (!isOpen) {
      item.classList.add('faq-item--open');
    }
  });
});

// Back to top visibility
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (!backToTop) return;
  const show = window.scrollY > 450;
  backToTop.classList.toggle('back-to-top--visible', show);
});

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Contact form -> backend
const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contactStatus');

async function submitContactForm(event) {
  event.preventDefault();
  if (!contactForm || !contactStatus) return;

  contactStatus.textContent = 'Sending your message…';

  const formData = new FormData(contactForm);
  const payload = {
    name: formData.get('name') || '',
    email: formData.get('email') || '',
    company: formData.get('company') || '',
    role: formData.get('role') || '',
    timeline: formData.get('timeline') || '',
    message: formData.get('message') || '',
  };

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.ok) {
      throw new Error(data.error || 'Something went wrong. Please try again.');
    }

    contactStatus.textContent =
      data.message || 'Thanks for reaching out – we’ll get back to you shortly.';
    contactForm.reset();
  } catch (err) {
    contactStatus.textContent =
      err.message || 'Could not send your message. Please try again.';
  }
}

if (contactForm) {
  contactForm.addEventListener('submit', submitContactForm);
}