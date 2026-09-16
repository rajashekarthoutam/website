/**
 * Minimalist portfolio interactions
 * Zero lag, fast copy-to-clipboard, smooth scroll tracking.
 */

(function () {
  'use strict';

  // Copy Email to Clipboard
  const copyBtn = document.getElementById('btn-copy-email');
  const copyToast = document.getElementById('copy-toast');
  const email = 'rajashekar.thoutam.dev@gmail.com';

  if (copyBtn && copyToast) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(email).then(() => {
        copyToast.textContent = 'Copied ' + email + ' to clipboard!';
        copyToast.classList.add('show');
        setTimeout(() => {
          copyToast.classList.remove('show');
        }, 3000);
      }).catch(() => {
        window.location.href = 'mailto:' + email;
      });
    });
  }

  // Active navigation link tracking
  const navLinks = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id]');

  function updateNav() {
    const scrollPos = window.scrollY + 200;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
})();
