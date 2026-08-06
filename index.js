/**
 * THOUTAM RAJASHEKAR - PERSONAL PORTFOLIO & RESUME SCRIPT
 * Handles Particle Canvas, Category Filter Tags, Modal Windows, and Smooth Scroll.
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initNavbarScroll();
  initProjectFilters();
  initContactForm();
  initModals();
});

/* ==========================================
   1. PARTICLE CANVAS (DARK CYBER NODES)
   ========================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.floor(width < 768 ? 30 : 65);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? 'rgba(0, 242, 254, ' : 'rgba(121, 40, 202, '
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + '0.7)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${0.15 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================
   2. NAVBAR & SCROLL SPY
   ========================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinksMenu = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navLinksMenu.classList.toggle('active');
    });
  }
}

/* ==========================================
   3. PROJECTS FILTER SYSTEM (UI Directive 2)
   ========================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================
   4. CONTACT FORM
   ========================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const alertBox = document.getElementById('contact-alert');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (alertBox) {
      alertBox.style.display = 'block';
      alertBox.className = 'badge-status';
      alertBox.innerHTML = '⚡ Thank you! Your message has been sent to Thoutam Rajashekar.';
      form.reset();

      setTimeout(() => {
        alertBox.style.display = 'none';
      }, 5000);
    }
  });
}

/* ==========================================
   5. MODAL WINDOWS (Resume & Logic Specs)
   ========================================== */
function initModals() {
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const triggerBtns = document.querySelectorAll('[data-modal-target]');

  const navResumeBtn = document.getElementById('btn-view-resume-nav');
  const heroResumeBtn = document.getElementById('btn-open-resume-hero');

  if (!overlay) return;

  const modalDetails = {
    fpga_lock: {
      title: 'Dual-Hardware Secure Locking System (Logic & Block Spec)',
      content: `
        <div style="color: #e2e8f0; line-height: 1.7;">
          <h4 style="color: var(--accent-cyan);">System Architecture Specs</h4>
          <p>Air-gapped security system decoupling communication from hardware logic.</p>
          <br>
          <ul style="margin-left: 1.5rem; color: #94a3b8;">
            <li><strong>FPGA Core:</strong> Tang Nano 20K FPGA running a Verilog Finite State Machine (FSM) acting as the Hardware Root of Trust.</li>
            <li><strong>Rolling Code Engine:</strong> 16-bit Linear Feedback Shift Register (LFSR) dynamic rolling code engine.</li>
            <li><strong>Wireless Link:</strong> ESP32 unit running router-less ESP-NOW protocol linked via a simplex UART pipeline.</li>
            <li><strong>Display Token:</strong> Handheld secondary ESP32 unit functioning as an interactive display token.</li>
          </ul>
        </div>
      `
    },
    car_safety: {
      title: 'Advanced Multi-Modal Vehicle Safety & Alert System',
      content: `
        <div style="color: #e2e8f0; line-height: 1.7;">
          <h4 style="color: var(--accent-cyan);">Sensor Integration Layout</h4>
          <p>Arduino Uno based multi-sensor real-time hazard detection system.</p>
          <br>
          <ul style="margin-left: 1.5rem; color: #94a3b8;">
            <li><strong>HC-SR04 Ultrasonic Sensors:</strong> Multi-directional obstacle detection with 30 cm threshold.</li>
            <li><strong>MQ-3 Alcohol Sensor:</strong> >300 raw analog threshold trigger for sobriety monitoring.</li>
            <li><strong>Temperature Sensor:</strong> Continuous engine overheat monitoring.</li>
            <li><strong>Alert Mechanism:</strong> Visual LED array & high-pitch piezoelectric buzzer alerts.</li>
          </ul>
        </div>
      `
    },
    v2g: {
      title: 'Vehicle-to-Grid (V2G) Smart Energy Infrastructure',
      content: `
        <div style="color: #e2e8f0; line-height: 1.7;">
          <h4 style="color: var(--accent-cyan);">Major Engineering Project</h4>
          <p>Bidirectional power flow control, smart EV battery management systems (BMS), and grid synchronization protocols for decentralized energy exchange.</p>
        </div>
      `
    },
    mesh: {
      title: 'Containerized Home Messaging & Mesh Infrastructure',
      content: `
        <div style="color: #e2e8f0; line-height: 1.7;">
          <h4 style="color: var(--accent-cyan);">Container & Network Deployment</h4>
          <p>Self-hosted Matrix Synapse communication server inside isolated cloud containers, securely bridged to personal hardware via Tailscale mesh networking.</p>
        </div>
      `
    },
    resume: {
      title: 'Thoutam Rajashekar - Official Technical Resume',
      content: `
        <div style="font-family: var(--font-main); color: #e2e8f0; line-height: 1.6;">
          <h3 style="color: var(--accent-cyan);">THOUTAM RAJASHEKAR</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Hyderabad, Telangana, India | rajashekar.thoutam.dev@gmail.com | github.com/rajashekarthoutam</p>
          <hr style="border-color: rgba(255,255,255,0.1); margin: 1rem 0;">

          <h4 style="color: var(--accent-purple);">SUMMARY</h4>
          <p style="font-size: 0.9rem; color: #94a3b8;">Electronics & Communication Engineering Undergraduate | Hardware & Embedded Systems Specialist. "Bridging Physical Electronics, FPGA Logic, and Hardware Roots of Trust."</p>

          <br>
          <h4 style="color: var(--accent-purple);">WORK EXPERIENCE</h4>
          <p><strong>Assembly & Testing Technician / Apprentice</strong> | Medha Servo Drives</p>
          <ul style="margin-left: 1.2rem; font-size: 0.88rem; color: #94a3b8;">
            <li>Assembled & wired locomotive Traction Converters (LTC) following technical drawings.</li>
            <li>Executed torque tightening, Optical Fiber Cable (OFC) routing, HV testing, and equipment calibration.</li>
          </ul>
          <br>
          <p><strong>Virtual Embedded Systems Intern</strong> | Microchip Technology</p>
          <ul style="margin-left: 1.2rem; font-size: 0.88rem; color: #94a3b8;">
            <li>Programmed PIC16 microcontrollers using MPLAB X IDE and deployed BLE applications.</li>
          </ul>

          <br>
          <h4 style="color: var(--accent-purple);">EDUCATION</h4>
          <p><strong>B.Tech in ECE</strong> - JBREC, Hyderabad (JNTUH R23 | CGPA: 7.93)</p>
          <p><strong>Diploma in ECE</strong> - GPT Masabtank (2021–2023)</p>
          <p><strong>Electrician Certification</strong> - Shakthi ITI, Mancherial (2016–2018)</p>
        </div>
      `
    }
  };

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetKey = btn.getAttribute('data-modal-target');
      const data = modalDetails[targetKey];

      if (data) {
        modalTitle.textContent = data.title;
        modalBody.innerHTML = data.content;
        overlay.classList.add('active');
      }
    });
  });

  const openResumeModal = (e) => {
    if (e) e.preventDefault();
    const data = modalDetails.resume;
    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.content;
    overlay.classList.add('active');
  };

  if (navResumeBtn) navResumeBtn.addEventListener('click', openResumeModal);
  if (heroResumeBtn) heroResumeBtn.addEventListener('click', openResumeModal);

  if (closeBtn) closeBtn.addEventListener('click', () => overlay.classList.remove('active'));

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  });
}
