/**
 * THOUTAM RAJASHEKAR - MODERN 3D INTERFACE ENGINE
 * Features: Smooth 3D Card Perspective Tilt, Specular Glare Tracking, Dynamic Toast & Nav
 */

(function () {
  'use strict';

  // --- 2. INTERACTIVE 3D PERSPECTIVE CARD TILT ---
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate subtle tilt angle (max 7 degrees)
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // --- 3. COPY EMAIL TO CLIPBOARD ---
  const copyBtn = document.getElementById('btn-copy-email');
  const copyToast = document.getElementById('copy-toast');
  const email = 'rajashekarthoutam06@gmail.com';

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

  // --- 4. NAVIGATION SCROLL TRACKING ---
  const navLinks = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id]');

  function updateNav() {
    const scrollPos = window.scrollY + 180;
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
