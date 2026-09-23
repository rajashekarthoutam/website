/**
 * THOUTAM RAJASHEKAR - INTERACTIVE PORTFOLIO ENGINE
 * Refined, high-performance, minimalist engineering aesthetics
 * Features:
 *  - Ambient Interactive Circuit Canvas (Mouse-reactive node constellation)
 *  - Scroll Progress Bar
 *  - Smooth Lerped 3D Tilt with Specular Glare
 *  - Live IST Clock Badge
 *  - Expandable Architecture Spec Drawers
 *  - Cross-card Tag Focus Highlighting
 *  - Tactile Copy-to-Clipboard with Checkmark Micro-animation
 *  - Scroll Spy Navigation
 */

(function () {
  'use strict';

  // --- 1. AMBIENT CIRCUIT CANVAS ---
  const canvas = document.getElementById('circuit-canvas');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    });

    const mouse = { x: -1000, y: -1000, radius: 140 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    const nodeCount = Math.min(45, Math.floor((width * height) / 25000));
    let nodes = [];

    function initNodes() {
      nodes = [];
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: Math.random() * 1.5 + 1,
          color: Math.random() > 0.5 ? 'rgba(0, 240, 255,' : 'rgba(16, 185, 129,'
        });
      }
    }
    initNodes();

    let isDocumentVisible = true;
    document.addEventListener('visibilitychange', () => {
      isDocumentVisible = !document.hidden;
    });

    function renderCanvas() {
      if (!isDocumentVisible) {
        requestAnimationFrame(renderCanvas);
        return;
      }
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0) n.x = width;
        else if (n.x > width) n.x = 0;
        if (n.y < 0) n.y = height;
        else if (n.y > height) n.y = 0;

        // Draw node
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.color + '0.7)';
        ctx.fill();

        // Connect nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n.x - n2.x;
          const dy = n.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.18 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }

        // Connect to mouse pointer
        const mdx = n.x - mouse.x;
        const mdy = n.y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < mouse.radius) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.35 * (1 - mDist / mouse.radius)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      requestAnimationFrame(renderCanvas);
    }
    requestAnimationFrame(renderCanvas);
  }

  // --- 2. SCROLL PROGRESS INDICATOR ---
  const progressBar = document.getElementById('scroll-progress');
  function updateScrollProgress() {
    if (!progressBar) return;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }
  }

  // --- 3. LIVE IST CLOCK BADGE ---
  const clockEl = document.getElementById('live-clock');
  function updateClock() {
    if (!clockEl) return;
    try {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      clockEl.textContent = 'IST ' + new Intl.DateTimeFormat('en-US', options).format(now);
    } catch {
      // Fallback
    }
  }
  updateClock();
  setInterval(updateClock, 1000);

  // --- 4. SMOOTH LERP 3D PERSPECTIVE CARD TILT ---
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach((card) => {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHovering = false;
    let animId = null;

    function renderTilt() {
      if (!isHovering && Math.abs(currentX) < 0.05 && Math.abs(currentY) < 0.05) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        animId = null;
        return;
      }
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      card.style.transform = `perspective(1000px) rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg) translateY(${isHovering ? '-4px' : '0px'})`;
      animId = requestAnimationFrame(renderTilt);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle, refined tilt angle (max 5.5 deg)
      targetX = ((y - centerY) / centerY) * -5.5;
      targetY = ((x - centerX) / centerX) * 5.5;

      card.style.setProperty('--mouse-x', `${((x / rect.width) * 100).toFixed(1)}%`);
      card.style.setProperty('--mouse-y', `${((y / rect.height) * 100).toFixed(1)}%`);

      if (!isHovering) {
        isHovering = true;
        if (!animId) animId = requestAnimationFrame(renderTilt);
      }
    });

    card.addEventListener('mouseleave', () => {
      isHovering = false;
      targetX = 0;
      targetY = 0;
      if (!animId) animId = requestAnimationFrame(renderTilt);
    });
  });

  // --- 5. INTERACTIVE ARCHITECTURE SPEC DRAWERS ---
  const drawerButtons = document.querySelectorAll('.btn-drawer-toggle');
  drawerButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = btn.getAttribute('data-target');
      const drawer = document.getElementById(targetId);
      if (!drawer) return;

      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isExpanded));

      if (isExpanded) {
        drawer.hidden = true;
      } else {
        drawer.hidden = false;
      }
    });
  });

  // --- 6. INTERACTIVE TAG FOCUS HIGHLIGHTING ---
  const tags = document.querySelectorAll('.tag');
  tags.forEach((tag) => {
    tag.addEventListener('mouseenter', () => {
      const text = tag.textContent.trim().toLowerCase();
      tags.forEach((other) => {
        if (other.textContent.trim().toLowerCase() === text) {
          other.classList.add('active-highlight');
        }
      });
    });
    tag.addEventListener('mouseleave', () => {
      tags.forEach((other) => other.classList.remove('active-highlight'));
    });
  });

  // --- 7. TACTILE COPY EMAIL TO CLIPBOARD ---
  const copyBtn = document.getElementById('btn-copy-email');
  const copyToast = document.getElementById('copy-toast');
  const email = 'rajashekarthoutam06@gmail.com';

  if (copyBtn) {
    const origHTML = copyBtn.innerHTML;
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(email).then(() => {
        copyBtn.innerHTML = '<i class="fa-solid fa-check" style="color: var(--emerald-400);"></i> Copied!';
        if (copyToast) {
          copyToast.textContent = 'Copied ' + email + ' to clipboard!';
          copyToast.classList.add('show');
        }
        setTimeout(() => {
          copyBtn.innerHTML = origHTML;
          if (copyToast) copyToast.classList.remove('show');
        }, 2500);
      }).catch(() => {
        window.location.href = 'mailto:' + email;
      });
    });
  }

  // --- 8. NAVIGATION SCROLL SPY ---
  const navLinks = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id]');

  function updateNav() {
    updateScrollProgress();
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
  updateNav();
})();
