/**
 * THOUTAM RAJASHEKAR - PORTFOLIO & ENGINEERING SHOWCASE LOGIC
 * Includes interactive FPGA LFSR Simulator, Car Safety Sensor Matrix,
 * Retro CLI Terminal, Resume Modal Viewer, and Particle Canvas.
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initTypingEffect();
  initNavbarScroll();
  initProjectFilters();
  initFpgaLfsrSimulator();
  initCarSafetyMatrix();
  initTerminalDrawer();
  initContactForm();
  initModals();
});

/* ==========================================
   1. PARTICLE CANVAS (CONNECTED NODES)
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

  const particleCount = Math.floor(width < 768 ? 35 : 75);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
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
   2. HERO TYPING EFFECT
   ========================================== */
function initTypingEffect() {
  const target = document.getElementById('typing-text');
  if (!target) return;

  const roles = [
    'Hardware & Embedded Systems Specialist',
    'Tang Nano 20K FPGA & Verilog Logic Designer',
    'Medha Servo Drives Assembly & HV Testing Tech',
    'Hardware Roots of Trust Specialist'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function type() {
    const currentRole = roles[roleIdx];
    if (isDeleting) {
      target.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 35;
    } else {
      target.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 75;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      typingSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }
  type();
}

/* ==========================================
   3. NAVBAR & SCROLL SPY
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
   4. PROJECTS FILTER SYSTEM
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
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================
   5. INTERACTIVE TANG NANO FPGA LFSR SIMULATOR
   ========================================== */
function initFpgaLfsrSimulator() {
  const btnStep = document.getElementById('btn-step-fsm');
  const hexEl = document.getElementById('lfsr-hex');
  const binEl = document.getElementById('lfsr-bin');
  const tapEl = document.getElementById('lfsr-tap');
  const stateTag = document.getElementById('fsm-state-tag');

  if (!btnStep) return;

  let lfsrReg = 0xACE1; // 16-bit seed (44257)

  btnStep.addEventListener('click', () => {
    // 16-bit LFSR taps: bits 15, 13, 12, 10
    const bit15 = (lfsrReg >> 15) & 1;
    const bit13 = (lfsrReg >> 13) & 1;
    const bit12 = (lfsrReg >> 12) & 1;
    const bit10 = (lfsrReg >> 10) & 1;

    const feedbackBit = bit15 ^ bit13 ^ bit12 ^ bit10;

    lfsrReg = ((lfsrReg << 1) & 0xFFFF) | feedbackBit;

    const hexStr = `16'h${lfsrReg.toString(16).toUpperCase().padStart(4, '0')}`;
    const binStr = lfsrReg.toString(2).padStart(16, '0');

    hexEl.textContent = hexStr;
    binEl.textContent = binStr;
    tapEl.textContent = `XOR Bit = ${feedbackBit}`;
    if (stateTag) stateTag.textContent = `FSM PULSED (${hexStr})`;
  });
}

/* ==========================================
   6. CAR SAFETY SENSOR MATRIX WIDGET
   ========================================== */
function initCarSafetyMatrix() {
  const distSlider = document.getElementById('dist-slider');
  const alcoholSlider = document.getElementById('alcohol-slider');
  const tempSlider = document.getElementById('temp-slider');

  const distVal = document.getElementById('dist-val');
  const alcoholVal = document.getElementById('alcohol-val');
  const tempVal = document.getElementById('temp-val');
  const alarmTag = document.getElementById('car-alarm-tag');

  if (!distSlider || !alcoholSlider || !tempSlider) return;

  function evaluateMatrix() {
    const dist = parseInt(distSlider.value);
    const alcohol = parseInt(alcoholSlider.value);
    const temp = parseInt(tempSlider.value);

    distVal.textContent = `${dist} cm ${dist <= 30 ? '⚠️ (OBSTACLE DANGER)' : ''}`;
    alcoholVal.textContent = `${alcohol} ${alcohol > 300 ? '🚨 (ALCOHOL DETECTED)' : '(Safe)'}`;
    tempVal.textContent = `${temp} °C ${temp > 90 ? '🔥 (ENGINE OVERHEAT)' : ''}`;

    let hazards = [];
    if (dist <= 30) hazards.push('OBSTACLE');
    if (alcohol > 300) hazards.push('ALCOHOL');
    if (temp > 90) hazards.push('OVERHEAT');

    if (hazards.length > 0) {
      alarmTag.textContent = `🚨 ALARM: ${hazards.join(' + ')}`;
      alarmTag.style.color = '#ff0080';
      alarmTag.style.borderColor = '#ff0080';
    } else {
      alarmTag.textContent = `STATUS: ALL SYSTEMS NORMAL`;
      alarmTag.style.color = 'var(--accent-emerald)';
      alarmTag.style.borderColor = 'var(--accent-emerald)';
    }
  }

  distSlider.addEventListener('input', evaluateMatrix);
  alcoholSlider.addEventListener('input', evaluateMatrix);
  tempSlider.addEventListener('input', evaluateMatrix);
  evaluateMatrix();
}

/* ==========================================
   7. RETRO CLI TERMINAL DRAWER
   ========================================== */
function initTerminalDrawer() {
  const fab = document.getElementById('terminal-fab');
  const drawer = document.getElementById('terminal-drawer');
  const closeBtn = document.getElementById('terminal-close');
  const input = document.getElementById('terminal-input');
  const body = document.getElementById('terminal-body');

  if (!fab || !drawer) return;

  fab.addEventListener('click', () => drawer.classList.toggle('open'));
  if (closeBtn) closeBtn.addEventListener('click', () => drawer.classList.remove('open'));

  const commands = {
    help: 'Commands: [help, bio, fpga, medha, projects, education, contact, clear, resume]',
    bio: 'Thoutam Rajashekar - ECE Undergraduate @ JBREC Hyderabad. Hardware, FPGA & Embedded Systems Specialist.',
    fpga: 'Tang Nano 20K FPGA with Gowin EDA & Vivado. Built 16-bit LFSR rolling code engine in Verilog HDL.',
    medha: 'Medha Servo Drives Apprentice: Assembled industrial locomotive Traction Converters (LTC), HV testing & OFC routing.',
    projects: '1. Dual-Hardware FPGA Secure Lock 2. Multi-Modal Car Safety System 3. V2G Smart Energy 4. Containerized Mesh Server.',
    education: 'B.Tech ECE @ JBREC (7.93 CGPA) | Diploma ECE @ GPT Masabtank | Electrician Certification @ Shakthi ITI.',
    contact: 'Email: rajashekar.thoutam.dev@gmail.com | Location: Hyderabad, India | GitHub: rajashekarthoutam',
    resume: 'Thoutam Rajashekar Resume: B.Tech ECE | Tang Nano FPGA | Medha Servo Drives | PIC16 | ESP-NOW'
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim().toLowerCase();
      input.value = '';

      if (!cmd) return;

      appendLine(`> ${cmd}`, 'user-cmd');

      if (cmd === 'clear') {
        body.innerHTML = '';
        return;
      }

      if (commands[cmd]) {
        appendLine(commands[cmd], 'output');
      } else {
        appendLine(`Command not recognized: "${cmd}". Type "help" for list of commands.`, 'output');
      }

      body.scrollTop = body.scrollHeight;
    }
  });

  function appendLine(text, className = '') {
    const div = document.createElement('div');
    div.className = `terminal-line ${className}`;
    div.textContent = text;
    body.appendChild(div);
  }
}

/* ==========================================
   8. CONTACT FORM
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
   9. MODALS (PROJECT & RESUME VIEWER)
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
      title: 'Dual-Hardware Secure Locking System (FPGA & ESP32)',
      content: `
        <p><strong>Architecture Overview:</strong> An air-gapped security system that decouples wireless communication from hardware execution logic.</p>
        <br>
        <p><strong>Key Technical Highlights:</strong></p>
        <ul style="margin-left: 1.5rem; color: #94a3b8; line-height: 1.7;">
          <li><strong>FPGA Core:</strong> Tang Nano 20K FPGA running a Verilog Finite State Machine (FSM) acting as the Hardware Root of Trust.</li>
          <li><strong>Rolling Code Engine:</strong> 16-bit Linear Feedback Shift Register (LFSR) dynamic code generator producing hardware-isolated authentication keys.</li>
          <li><strong>Simplex Pipeline:</strong> ESP32 executing router-less ESP-NOW protocol connected via a uni-directional (simplex) UART bus.</li>
          <li><strong>Token Unit:</strong> Handheld secondary ESP32 display token for instant key confirmation.</li>
        </ul>
      `
    },
    car_safety: {
      title: 'Advanced Multi-Modal Vehicle Safety & Alert System',
      content: `
        <p><strong>Overview:</strong> Arduino Uno based multi-sensor automotive safety integration processing real-time collision, sobriety, and thermal metrics.</p>
        <br>
        <p><strong>Sensor Specs & Thresholds:</strong></p>
        <ul style="margin-left: 1.5rem; color: #94a3b8; line-height: 1.7;">
          <li><strong>HC-SR04 Ultrasonic Sensors:</strong> 360-degree obstacle detection with a 30 cm danger threshold.</li>
          <li><strong>MQ-3 Gas Sensor:</strong> Analog alcohol breathalyzer sampling with a 300 raw threshold trigger.</li>
          <li><strong>Temperature Monitoring:</strong> Continuous engine thermal tracking to alert on overheat risks.</li>
          <li><strong>Alert Matrix:</strong> Multi-modal warning featuring high-pitch piezoelectric buzzer alarms & LED visual indicator array.</li>
        </ul>
      `
    },
    v2g: {
      title: 'Vehicle-to-Grid (V2G) Smart Energy Infrastructure',
      content: `
        <p><strong>Major B.Tech Engineering Project:</strong> Focused on bidirectional power flow control between Electric Vehicles (EVs) and the local power grid.</p>
        <br>
        <ul style="margin-left: 1.5rem; color: #94a3b8; line-height: 1.7;">
          <li>Smart EV Battery Management System (BMS) telemetry integration.</li>
          <li>Grid synchronization protocols and power inverter pulse control algorithms.</li>
          <li>Decentralized peak shaving and microgrid energy exchange.</li>
        </ul>
      `
    },
    mesh: {
      title: 'Containerized Home Messaging & Mesh Infrastructure',
      content: `
        <p><strong>Infrastructure Overview:</strong> Self-hosted offline-first messaging network.</p>
        <br>
        <ul style="margin-left: 1.5rem; color: #94a3b8; line-height: 1.7;">
          <li><strong>Matrix Synapse:</strong> Containerized communication server deployed inside Docker.</li>
          <li><strong>Tailscale Mesh:</strong> Encrypted P2P mesh network bridging remote hardware nodes without open public ports.</li>
          <li>Deployed on Windows 11 native environment managed via Scoop.</li>
        </ul>
      `
    },
    resume: {
      title: 'Thoutam Rajashekar - Technical Resume',
      content: `
        <div style="font-family: var(--font-main); color: #e2e8f0; line-height: 1.6;">
          <h3 style="color: var(--accent-cyan);">THOUTAM RAJASHEKAR</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Hyderabad, Telangana, India | rajashekar.thoutam.dev@gmail.com | github.com/rajashekarthoutam</p>
          <hr style="border-color: rgba(255,255,255,0.1); margin: 1rem 0;">

          <h4 style="color: var(--accent-purple);">EDUCATION</h4>
          <p><strong>B.Tech in ECE</strong> - Joginpally B R Engineering College (JBREC), Hyderabad | CGPA: 7.93 (JNTUH R23)</p>
          <p><strong>Diploma in ECE</strong> - Government Polytechnic Masabtank (2021–2023)</p>
          <p><strong>Electrician Certification</strong> - Shakthi ITI, Mancherial (2016–2018)</p>

          <br>
          <h4 style="color: var(--accent-purple);">INDUSTRIAL EXPERIENCE</h4>
          <p><strong>Medha Servo Drives</strong> - Assembly & Testing Technician / Apprentice</p>
          <ul style="margin-left: 1.2rem; font-size: 0.88rem; color: #94a3b8;">
            <li>Assembled Traction Converters (LTC) for locomotives & routed Optical Fiber Cables (OFC).</li>
            <li>Executed high-voltage (HV) testing, torque calibration, and multimeter verification.</li>
          </ul>

          <br>
          <p><strong>Microchip Technology</strong> - Virtual Embedded Systems Intern</p>
          <ul style="margin-left: 1.2rem; font-size: 0.88rem; color: #94a3b8;">
            <li>Programmed PIC16 microcontrollers in MPLAB X IDE and implemented BLE applications.</li>
          </ul>

          <br>
          <h4 style="color: var(--accent-purple);">HARDWARE & SKILLS</h4>
          <p style="font-size: 0.9rem; color: #94a3b8;">Tang Nano 20K FPGA, Verilog HDL, Gowin EDA, Xilinx Vivado, KiCad, PIC16, ESP32 (ESP-NOW), Arduino Uno, Tailscale, Docker, Cloudflare Pages.</p>
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
