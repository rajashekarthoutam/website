/**
 * THOUTAM RAJASHEKAR - PORTFOLIO ENGINE
 * Classic Minimalist & Performant Core
 */

(function () {
  'use strict';

  // 1. Reading Progress Bar
  const progressBar = document.getElementById('scroll-progress');
  function updateProgress() {
    if (!progressBar) return;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total > 0) {
      progressBar.style.width = `${(window.scrollY / total) * 100}%`;
    }
  }

  // 2. Live IST Clock
  const timeEl = document.getElementById('status-time');
  function updateTime() {
    if (!timeEl) return;
    try {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).format(now);
      timeEl.textContent = 'IST ' + formatted;
    } catch {
      // Graceful fallback
    }
  }
  updateTime();
  setInterval(updateTime, 1000);

  // 3. Copy Email to Clipboard
  const copyBtn = document.getElementById('btn-copy-email');
  const toast = document.getElementById('copy-toast');
  const email = 'rajashekarthoutam06@gmail.com';

  if (copyBtn) {
    const defaultHTML = copyBtn.innerHTML;
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(email).then(() => {
        copyBtn.innerHTML = '<i class="fa-solid fa-check" style="color: #10b981;"></i> Copied';
        if (toast) {
          toast.textContent = 'Copied ' + email + ' to clipboard';
          toast.classList.add('show');
        }
        setTimeout(() => {
          copyBtn.innerHTML = defaultHTML;
          if (toast) toast.classList.remove('show');
        }, 2200);
      }).catch(() => {
        window.location.href = 'mailto:' + email;
      });
    });
  }

  // 4. Scroll Spy Navigation
  const navLinks = document.querySelectorAll('.nav-link:not(.external)');
  const sections = document.querySelectorAll('section[id]');

  function updateNav() {
    updateProgress();
    const scrollPos = window.scrollY + 160;
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
  updateNav();
})();
