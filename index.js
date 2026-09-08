/**
 * THOUTAM RAJASHEKAR - ENGINEERING PORTFOLIO & WEB TOOLKITS SCRIPT
 * Features: Particle Canvas, Spotlight Glows, FPGA FSM & LFSR Simulator,
 * Automotive Sensor Dashboard, Interactive CLI Terminal, Modals, and Filters.
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initNavbarScroll();
  initSpotlightCards();
  initFPGALfsrSimulator();
  initAutomotiveSensorDashboard();
  initEngineeringTerminal();
  initProjectFilters();
  initContactForm();
  initModals();
});

/* ==========================================================================
   1. PARTICLE MATRIX CANVAS (CYBER NODES & CONSTELLATIONS)
   ========================================================================== */
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

  const particleCount = Math.floor(width < 768 ? 32 : 70);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.4 ? 'rgba(0, 242, 254, ' : 'rgba(139, 92, 246, '
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
      ctx.fillStyle = p.color + '0.75)';
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
          ctx.strokeStyle = `rgba(0, 242, 254, ${0.16 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   2. SPOTLIGHT CARDS EFFECT (MOUSE-TRACKING RADIAL GRADIENT)
   ========================================================================== */
function initSpotlightCards() {
  const cards = document.querySelectorAll('.spotlight-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   3. FPGA FSM & LFSR ROLLING CODE SIMULATOR (WEB TOOLKIT 1)
   ========================================================================== */
function initFPGALfsrSimulator() {
  const btnRun = document.getElementById('btn-run-fsm');
  const btnReset = document.getElementById('btn-reset-fsm');
  const seedDisplay = document.getElementById('lfsr-seed-display');
  const otpDisplay = document.getElementById('lfsr-otp-display');
  const relayDisplay = document.getElementById('relay-state-display');
  const statusBadge = document.getElementById('fsm-status-badge');

  const nodes = {
    idle: document.getElementById('fsm-node-idle'),
    lfsr: document.getElementById('fsm-node-lfsr'),
    tx: document.getElementById('fsm-node-tx'),
    verify: document.getElementById('fsm-node-verify'),
    unlock: document.getElementById('fsm-node-unlock')
  };

  const lines = [
    document.getElementById('fsm-line-1'),
    document.getElementById('fsm-line-2'),
    document.getElementById('fsm-line-3'),
    document.getElementById('fsm-line-4')
  ];

  if (!btnRun || !seedDisplay) return;

  let currentLfsr = 0xACE1; // Initial seed 44257
  let isRunning = false;

  function stepLfsr16(val) {
    // Verilog polynomial: x^16 + x^14 + x^13 + x^11 + 1 (Taps: 16, 14, 13, 11)
    let bit = ((val >> 0) ^ (val >> 2) ^ (val >> 3) ^ (val >> 5)) & 1;
    let next = (val >> 1) | (bit << 15);
    return next & 0xFFFF;
  }

  function setActiveNode(activeKey) {
    Object.keys(nodes).forEach(key => {
      if (nodes[key]) {
        if (key === activeKey) {
          nodes[key].classList.add('active');
        } else {
          nodes[key].classList.remove('active');
        }
      }
    });
  }

  function setPulsingLine(index) {
    lines.forEach((line, i) => {
      if (line) {
        if (i === index) line.classList.add('pulsing');
        else line.classList.remove('pulsing');
      }
    });
  }

  btnRun.addEventListener('click', () => {
    if (isRunning) return;
    isRunning = true;
    btnRun.disabled = true;

    // Stage 1: LFSR Calculation
    statusBadge.textContent = 'STATUS: S1 (GEN LFSR)';
    statusBadge.style.color = 'var(--accent-cyan)';
    setActiveNode('lfsr');
    setPulsingLine(0);

    currentLfsr = stepLfsr16(currentLfsr);
    const hexSeed = '0x' + currentLfsr.toString(16).toUpperCase().padStart(4, '0');
    seedDisplay.textContent = `${hexSeed} (${currentLfsr})`;

    // Calculate dynamic 4-digit token
    const calculatedOtp = (currentLfsr % 9000 + 1000).toString();
    otpDisplay.textContent = 'CALCULATING...';
    relayDisplay.textContent = 'WAITING FOR PACKET';
    relayDisplay.style.color = 'var(--text-dim)';

    // Stage 2: Simplex UART Transmission
    setTimeout(() => {
      statusBadge.textContent = 'STATUS: S2 (UART TX)';
      statusBadge.style.color = 'var(--accent-purple)';
      setActiveNode('tx');
      setPulsingLine(1);
      otpDisplay.textContent = `PAYLOAD: [${calculatedOtp}]`;

      // Stage 3: Tang Nano 20K FPGA Verification
      setTimeout(() => {
        statusBadge.textContent = 'STATUS: S3 (FPGA VERIFY)';
        statusBadge.style.color = 'var(--accent-amber)';
        setActiveNode('verify');
        setPulsingLine(2);

        // Stage 4: Verified & Unlock Actuation
        setTimeout(() => {
          statusBadge.textContent = 'STATUS: S4 (UNLOCKED)';
          statusBadge.style.color = 'var(--accent-emerald)';
          setActiveNode('unlock');
          setPulsingLine(3);
          otpDisplay.textContent = `TOKEN VERIFIED: ${calculatedOtp}`;
          relayDisplay.textContent = 'SOLENOID RELAY ENERGIZED (ACTIVE HIGH 3.3V)';
          relayDisplay.style.color = 'var(--accent-emerald)';

          // Return to idle after delay
          setTimeout(() => {
            setActiveNode('idle');
            setPulsingLine(-1);
            statusBadge.textContent = 'STATUS: IDLE';
            statusBadge.style.color = 'var(--accent-emerald)';
            relayDisplay.textContent = 'AUTO-RELOCKED (PASSIVE HOLD)';
            relayDisplay.style.color = 'var(--text-dim)';
            isRunning = false;
            btnRun.disabled = false;
          }, 3500);

        }, 800);
      }, 700);
    }, 600);
  });

  btnReset.addEventListener('click', () => {
    currentLfsr = 0xACE1;
    seedDisplay.textContent = '0xACE1 (44257)';
    otpDisplay.textContent = '----';
    relayDisplay.textContent = 'LOCKED (HIGH IMPEDANCE)';
    relayDisplay.style.color = 'var(--text-dim)';
    statusBadge.textContent = 'STATUS: IDLE';
    statusBadge.style.color = 'var(--accent-emerald)';
    setActiveNode('idle');
    setPulsingLine(-1);
    isRunning = false;
    btnRun.disabled = false;
  });
}

/* ==========================================================================
   4. AUTOMOTIVE MULTI-SENSOR SAFETY DASHBOARD (WEB TOOLKIT 2)
   ========================================================================== */
function initAutomotiveSensorDashboard() {
  const sliderDist = document.getElementById('slider-distance');
  const sliderAlc = document.getElementById('slider-alcohol');
  const sliderTemp = document.getElementById('slider-temp');

  const valDist = document.getElementById('val-distance');
  const valAlc = document.getElementById('val-alcohol');
  const valTemp = document.getElementById('val-temp');

  const hazardBox = document.getElementById('hazard-box');
  const hazardIcon = document.getElementById('hazard-icon');
  const hazardText = document.getElementById('hazard-text');
  const buzzerTag = document.getElementById('hazard-buzzer-tag');
  const sensorStatusBadge = document.getElementById('sensor-status-badge');
  const btnDanger = document.getElementById('btn-test-danger');

  if (!sliderDist || !hazardBox) return;

  function updateSensors() {
    const dist = parseInt(sliderDist.value, 10);
    const alc = parseInt(sliderAlc.value, 10);
    const temp = parseInt(sliderTemp.value, 10);

    valDist.textContent = `${dist} cm ${dist < 30 ? '(CRITICAL <30cm)' : '(Safe >30cm)'}`;
    valAlc.textContent = `${alc} Raw ${alc > 300 ? '(HAZARD >300)' : '(Safe <300)'}`;
    valTemp.textContent = `${temp} °C ${temp > 95 ? '(OVERHEAT >95°C)' : '(Safe <95°C)'}`;

    let hazards = [];
    if (dist < 30) hazards.push(`Obstacle Proximity Warning (${dist}cm)`);
    if (alc > 300) hazards.push(`Alcohol Breath Threshold Exceeded (${alc})`);
    if (temp > 95) hazards.push(`Engine Thermal Overheat (${temp}°C)`);

    if (hazards.length > 0) {
      hazardBox.className = 'hazard-alert-box danger';
      hazardIcon.className = 'fa-solid fa-triangle-exclamation';
      hazardText.textContent = hazards.join(' | ');
      buzzerTag.textContent = 'BUZZER: ACTIVE 2.4kHz PULSE';
      buzzerTag.style.color = '#ef4444';
      buzzerTag.style.fontWeight = '700';

      sensorStatusBadge.textContent = 'CRITICAL HAZARD';
      sensorStatusBadge.style.background = 'rgba(239, 68, 68, 0.2)';
      sensorStatusBadge.style.color = '#ef4444';
    } else {
      hazardBox.className = 'hazard-alert-box';
      hazardIcon.className = 'fa-solid fa-circle-check';
      hazardText.textContent = 'All parameters within safe operating thresholds.';
      buzzerTag.textContent = 'BUZZER: SILENT';
      buzzerTag.style.color = 'var(--accent-emerald)';
      buzzerTag.style.fontWeight = 'normal';

      sensorStatusBadge.textContent = 'SYS NORMAL';
      sensorStatusBadge.style.background = 'rgba(16, 185, 129, 0.15)';
      sensorStatusBadge.style.color = 'var(--accent-emerald)';
    }
  }

  sliderDist.addEventListener('input', updateSensors);
  sliderAlc.addEventListener('input', updateSensors);
  sliderTemp.addEventListener('input', updateSensors);

  if (btnDanger) {
    btnDanger.addEventListener('click', () => {
      sliderDist.value = 18;
      sliderAlc.value = 460;
      sliderTemp.value = 108;
      updateSensors();
    });
  }
}

/* ==========================================================================
   5. INTERACTIVE ENGINEERING CLI TERMINAL
   ========================================================================== */
function initEngineeringTerminal() {
  const stream = document.getElementById('terminal-stream');
  const input = document.getElementById('terminal-cmd-input');
  const chips = document.querySelectorAll('.cmd-chip');
  const tabBash = document.getElementById('tab-cli-bash');
  const tabSpecs = document.getElementById('tab-cli-specs');
  const tabRtl = document.getElementById('tab-cli-rtl');

  if (!stream || !input) return;

  const commands = {
    help: `
Available commands:
  • <span style="color: var(--accent-cyan);">skills</span>     - View core hardware & embedded competencies
  • <span style="color: var(--accent-cyan);">projects</span>   - List featured engineering repositories & projects
  • <span style="color: var(--accent-cyan);">fpga</span>       - Inspect Tang Nano 20K FPGA architecture details
  • <span style="color: var(--accent-cyan);">medha</span>      - Medha Servo Drives industrial apprenticeship notes
  • <span style="color: var(--accent-cyan);">specs</span>      - Environment & workstation specs
  • <span style="color: var(--accent-cyan);">resume</span>     - Open technical resume specification modal
  • <span style="color: var(--accent-cyan);">contact</span>    - View direct contact details & location
  • <span style="color: var(--accent-cyan);">clear</span>      - Clear terminal stream
    `,
    skills: `
<span style="color: var(--accent-purple);">Hardware & Circuit:</span> Verilog HDL, Tang Nano 20K FPGA, Gowin EDA, KiCad, Traction Converters (LTC).
<span style="color: var(--accent-cyan);">Embedded & Protocols:</span> PIC16 (MPLAB X), ESP32 (ESP-NOW), Arduino Uno, UART/SPI/I2C, BLE.
<span style="color: var(--accent-emerald);">Systems & AI:</span> Windows 11 Native Architecture, Scoop, Tailscale Mesh, Local LLMs.
    `,
    projects: `
1. <span style="color: var(--accent-cyan);">Dual-Hardware Secure Locking System</span> - Tang Nano 20K FPGA + ESP-NOW + 16-bit LFSR.
2. <span style="color: var(--accent-pink);">Vehicle Multi-Sensor Safety System</span> - Arduino Uno + HC-SR04 + MQ-3 + Temp.
3. <span style="color: var(--accent-amber);">V2G Smart Energy Infrastructure</span> - Bidirectional power flow & EV BMS logic.
4. <span style="color: var(--accent-blue);">Containerized Mesh Messaging</span> - Dockerized Matrix Synapse + Tailscale.
    `,
    fpga: `
<span style="color: var(--accent-cyan);">FPGA Core:</span> Tang Nano 20K (Gowin GW2AR-18C)
<span style="color: var(--accent-purple);">Synthesis:</span> Gowin EDA / Xilinx Vivado
<span style="color: var(--accent-emerald);">Key Logic:</span> 16-bit LFSR pseudo-random engine, Verilog 6-state FSM, 27 MHz clock.
<span style="color: var(--text-muted);">Decoupled Air-Gap: Simplex UART packet reception with relay drive output.</span>
    `,
    medha: `
<span style="color: var(--accent-purple);">Medha Servo Drives - Assembly & Testing Technician / Apprentice</span>
• Assembled locomotive Traction Converters (LTC) following mechanical & schematic blueprints.
• Routed Optical Fiber Cables (OFC) for noise-immune pulse width modulation firing.
• Conducted high-voltage (HV) insulation resistance and calibration measurements.
    `,
    specs: `
<span style="color: var(--accent-emerald);">Workstation Architecture:</span> Windows 11 Native (Pure CLI, Scoop package manager)
<span style="color: var(--accent-cyan);">Embedded EDA:</span> Gowin EDA v1.9, MPLAB X v6.20, KiCad v8, Arduino CLI
<span style="color: var(--accent-purple);">Mesh Network:</span> Tailscale zero-config encrypted P2P overlay
    `,
    contact: `
<span style="color: var(--accent-cyan);">Email:</span> rajashekar.thoutam.dev@gmail.com
<span style="color: var(--accent-emerald);">Location:</span> Hyderabad, Telangana, India
<span style="color: var(--accent-purple);">GitHub:</span> https://github.com/rajashekarthoutam
<span style="color: var(--accent-cyan);">Domain:</span> https://rajashekarthoutam.in/
    `,
    resume: `Opening Technical Resume Modal...`
  };

  function executeCommand(cmd) {
    const trimmed = cmd.trim().toLowerCase();
    const line = document.createElement('div');
    line.innerHTML = `<span class="prompt-symbol">rajashekar@hardware:~$</span> ${cmd}`;
    stream.appendChild(line);

    if (trimmed === 'clear') {
      stream.innerHTML = `
        <div style="color: var(--accent-cyan);">=== THOUTAM RAJASHEKAR - HARDWARE SHELL v2.4 ===</div>
        <div style="color: var(--text-muted); margin-bottom: 0.75rem;">Type 'help' for available commands or click the chips below.</div>
      `;
    } else if (trimmed === 'resume') {
      const resp = document.createElement('div');
      resp.innerHTML = commands.resume;
      stream.appendChild(resp);
      const navResume = document.getElementById('btn-view-resume-nav');
      if (navResume) navResume.click();
    } else if (commands[trimmed]) {
      const resp = document.createElement('div');
      resp.innerHTML = commands[trimmed];
      stream.appendChild(resp);
    } else if (trimmed !== '') {
      const resp = document.createElement('div');
      resp.innerHTML = `<span style="color: #ef4444;">zsh: command not found: ${trimmed}</span>. Type '<span style="color: var(--accent-cyan);">help</span>' for available commands.`;
      stream.appendChild(resp);
    }

    stream.scrollTop = stream.scrollHeight;
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCommand(input.value);
      input.value = '';
    }
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      executeCommand(cmd);
    });
  });

  // Tab switching inside terminal HUD
  if (tabBash && tabSpecs && tabRtl) {
    tabBash.addEventListener('click', () => {
      tabBash.classList.add('active');
      tabSpecs.classList.remove('active');
      tabRtl.classList.remove('active');
      executeCommand('clear');
    });

    tabSpecs.addEventListener('click', () => {
      tabSpecs.classList.add('active');
      tabBash.classList.remove('active');
      tabRtl.classList.remove('active');
      executeCommand('specs');
    });

    tabRtl.addEventListener('click', () => {
      tabRtl.classList.add('active');
      tabBash.classList.remove('active');
      tabSpecs.classList.remove('active');
      executeCommand('fpga');
    });
  }
}

/* ==========================================================================
   6. NAVBAR & SCROLL SPY
   ========================================================================== */
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

/* ==========================================================================
   7. PROJECTS FILTER SYSTEM
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   8. CONTACT FORM
   ========================================================================== */
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

/* ==========================================================================
   9. MODAL WINDOWS (RESUME & SYSTEM SPECIFICATIONS)
   ========================================================================== */
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
      title: 'Dual-Hardware Secure Locking System (Tang Nano 20K & ESP32)',
      content: `
        <div style="color: #e2e8f0; line-height: 1.7;">
          <h4 style="color: var(--accent-cyan);">Hardware-Isolated Architecture</h4>
          <p>An air-gapped embedded security system decoupling wireless connectivity from physical execution logic.</p>
          <br>
          <ul style="margin-left: 1.5rem; color: #94a3b8;">
            <li><strong>Hardware Root of Trust:</strong> Tang Nano 20K FPGA running a Verilog Finite State Machine (FSM).</li>
            <li><strong>Dynamic Rolling Code:</strong> 16-bit Linear Feedback Shift Register (LFSR) calculating 65,535 non-repeating OTP keys.</li>
            <li><strong>Simplex Pipeline:</strong> Unidirectional UART connection between ESP32 and FPGA preventing physical reverse-probing.</li>
            <li><strong>Token Display Unit:</strong> Secondary ESP32 handheld terminal running ESP-NOW protocol.</li>
          </ul>
        </div>
      `
    },
    car_safety: {
      title: 'Advanced Multi-Modal Automotive Safety & Alert System',
      content: `
        <div style="color: #e2e8f0; line-height: 1.7;">
          <h4 style="color: var(--accent-cyan);">Sensor Ingestion Architecture</h4>
          <p>Arduino Uno based real-time hazard detection system processing three critical metrics:</p>
          <br>
          <ul style="margin-left: 1.5rem; color: #94a3b8;">
            <li><strong>HC-SR04 Ultrasonic Sensors:</strong> 360-degree obstacle detection with a 30 cm safety threshold.</li>
            <li><strong>MQ-3 Alcohol Sensor:</strong> Breathalyzer sobriety sampling with a 300 raw threshold trigger.</li>
            <li><strong>Thermal Sensor:</strong> Continuous engine thermal monitoring to prevent catastrophic overheating.</li>
            <li><strong>Alert Matrix:</strong> Multi-modal warning featuring high-pitch piezoelectric buzzer alarms and an LED indicator array.</li>
          </ul>
        </div>
      `
    },
    v2g: {
      title: 'Vehicle-to-Grid (V2G) Smart Energy Infrastructure',
      content: `
        <div style="color: #e2e8f0; line-height: 1.7;">
          <h4 style="color: var(--accent-cyan);">Major B.Tech Engineering Project</h4>
          <p>Bidirectional power flow control between Electric Vehicles (EVs) and local microgrids.</p>
          <br>
          <ul style="margin-left: 1.5rem; color: #94a3b8;">
            <li>Smart EV Battery Management System (BMS) telemetry integration.</li>
            <li>Grid synchronization protocols and power inverter pulse control algorithms.</li>
            <li>Decentralized peak shaving and microgrid energy exchange.</li>
          </ul>
        </div>
      `
    },
    mesh: {
      title: 'Containerized Home Messaging & Mesh Infrastructure',
      content: `
        <div style="color: #e2e8f0; line-height: 1.7;">
          <h4 style="color: var(--accent-cyan);">Deployment Architecture</h4>
          <p>Self-hosted offline-first messaging network.</p>
          <br>
          <ul style="margin-left: 1.5rem; color: #94a3b8;">
            <li><strong>Matrix Synapse:</strong> Containerized communication server deployed inside Docker.</li>
            <li><strong>Tailscale Mesh:</strong> Encrypted P2P mesh network bridging remote hardware nodes without open public ports.</li>
            <li>Deployed on Windows 11 native environment managed via Scoop.</li>
          </ul>
        </div>
      `
    },
    resume: {
      title: 'Thoutam Rajashekar - Official Technical Resume',
      content: `
        <div style="font-family: var(--font-main); color: #e2e8f0; line-height: 1.6;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
            <div>
              <h3 style="color: var(--accent-cyan); font-size: 1.5rem;">THOUTAM RAJASHEKAR</h3>
              <p style="color: var(--text-muted); font-size: 0.9rem;">Hyderabad, Telangana, India | rajashekar.thoutam.dev@gmail.com</p>
            </div>
            <button class="btn btn-outline btn-sm" onclick="window.print()" style="margin-top: 0.5rem;">
              <i class="fa-solid fa-print"></i> Print / Save PDF
            </button>
          </div>
          <hr style="border-color: rgba(255,255,255,0.1); margin: 1.25rem 0;">

          <h4 style="color: var(--accent-purple); font-size: 1.05rem; margin-bottom: 0.4rem;">EDUCATION</h4>
          <p><strong>B.Tech in Electronics & Communication Engineering</strong> - JBREC, Hyderabad (JNTUH R23 | <strong>CGPA: 7.93</strong>)</p>
          <p><strong>Diploma in ECE</strong> - Government Polytechnic Masabtank (2021–2023)</p>
          <p><strong>Electrician Certification</strong> - Shakthi ITI, Mancherial (2016–2018)</p>

          <br>
          <h4 style="color: var(--accent-purple); font-size: 1.05rem; margin-bottom: 0.4rem;">INDUSTRIAL EXPERIENCE</h4>
          <p><strong>Assembly & Testing Technician / Apprentice</strong> | Medha Servo Drives</p>
          <ul style="margin-left: 1.2rem; font-size: 0.88rem; color: #94a3b8;">
            <li>Assembled & wired locomotive Traction Converters (LTC) following industrial blueprints.</li>
            <li>Executed Optical Fiber Cable (OFC) routing, high-voltage (HV) testing, and equipment calibration.</li>
          </ul>

          <br>
          <p><strong>Virtual Embedded Systems Intern</strong> | Microchip Technology</p>
          <ul style="margin-left: 1.2rem; font-size: 0.88rem; color: #94a3b8;">
            <li>Programmed PIC16 microcontrollers in MPLAB X IDE and implemented BLE applications.</li>
          </ul>

          <br>
          <h4 style="color: var(--accent-purple); font-size: 1.05rem; margin-bottom: 0.4rem;">HARDWARE & SKILLS</h4>
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
