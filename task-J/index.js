document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('header nav');

  toggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
});