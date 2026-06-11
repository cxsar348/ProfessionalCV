/* SECTION: THEME CONTROLLER
   PURPOSE: Manage dark mode state and persist user preference.
   BEHAVIOR: Toggles CSS variables using a data-theme attribute. */

const themeToggle = document.getElementById('theme-toggle');
const rootElement = document.documentElement;
const STORAGE_THEME = 'preferredTheme';

function setTheme(theme) {
  rootElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_THEME, theme);
  themeToggle.innerHTML = theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode';
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Activate dark mode' : 'Activate light mode');
}

function loadTheme() {
  const savedTheme = localStorage.getItem(STORAGE_THEME);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  setTheme(theme);
}

/* SECTION: SMOOTH NAVIGATION
   PURPOSE: Highlight nav links and support smooth scrolling behavior.
   BEHAVIOR: Uses IntersectionObserver to detect active sections on scroll. */

const navLinks = document.querySelectorAll('.page-nav .nav-link');
const sections = document.querySelectorAll('section[id]');

function setActiveLink(id) {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('active', isActive);
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const section = entry.target;
      if (entry.isIntersecting) {
        section.classList.add('is-visible');
        setActiveLink(section.id);
      }
    });
  },
  {
    threshold: 0.35,
  }
);

sections.forEach((section) => {
  sectionObserver.observe(section);
});

/* SECTION: PAGE LOAD INITIALIZATION
   PURPOSE: Initialize theme and interactions after DOM is ready.
   BEHAVIOR: Sets up event listeners and reveals visible sections. */

document.addEventListener('DOMContentLoaded', () => {
  loadTheme();

  themeToggle.addEventListener('click', () => {
    const currentTheme = rootElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  const activeSection = Array.from(sections).find((section) => section.getBoundingClientRect().top >= 0);
  if (activeSection) {
    setActiveLink(activeSection.id);
  }
});
