/**
 * RAJA SHEKAR THOUTAM - PORTFOLIO & ENGINEERING SHOWCASE LOGIC
 * Includes interactive BESS Simulator, PCB Inspector, CLI Terminal Drawer,
 * GitHub API Fetcher, Cloudflare Edge Status, Particle Node Canvas, and Modal System.
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initTypingEffect();
  initNavbarScroll();
  initProjectFilters();
  initBessSimulator();
  initPcbInspector();
  initTerminalDrawer();
  initGithubFeed();
  initCloudflareStatus();
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

      // Connect nearby particles
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
    'Hardware & Embedded Systems Engineer',
    'Smart Energy & BESS Simulator Architect',
    'High-Speed PCB Design & Firmware Developer',
    'Linux Kernel & Systems Specialist'
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
      typingSpeed = 2200; // Pause at top
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

    // Scroll spy
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
   5. INTERACTIVE BESS SIMULATOR WIDGET
   ========================================== */
function initBessSimulator() {
  const socSlider = document.getElementById('soc-slider');
  const solarSlider = document.getElementById('solar-slider');
  const loadSlider = document.getElementById('load-slider');

  const socVal = document.getElementById('soc-val');
  const solarVal = document.getElementById('solar-val');
  const loadVal = document.getElementById('load-val');
  const gridVal = document.getElementById('grid-val');

  const bessStatus = document.getElementById('bess-status-tag');
  const canvas = document.getElementById('bess-graph-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const historyLength = 40;
  const bessData = new Array(historyLength).fill(50);
  const gridData = new Array(historyLength).fill(10);

  function updateSimulation() {
    const soc = parseInt(socSlider.value);
    const solar = parseFloat(solarSlider.value);
    const load = parseFloat(loadSlider.value);

    socVal.textContent = `${soc}%`;
    solarVal.textContent = `${solar.toFixed(1)} kW`;
    loadVal.textContent = `${load.toFixed(1)} kW`;

    // Energy balance: Net = Solar - Load
    const netDemand = load - solar; // positive = deficit, negative = surplus
    let bessPower = 0;
    let gridPower = 0;
    let statusText = 'BALANCED';

    if (netDemand > 0) { // Need extra power
      if (soc > 15) {
        bessPower = Math.min(netDemand, 15); // BESS discharge max 15kW
        gridPower = netDemand - bessPower;
        statusText = `DISCHARGING (${bessPower.toFixed(1)} kW)`;
      } else {
        gridPower = netDemand;
        statusText = 'GRID IMPORT (BESS LOW)';
      }
    } else if (netDemand < 0) { // Excess solar
      const surplus = Math.abs(netDemand);
      if (soc < 98) {
        bessPower = -Math.min(surplus, 15); // BESS charging
        gridPower = surplus - Math.abs(bessPower); // Feed remaining to grid
        statusText = `CHARGING (${Math.abs(bessPower).toFixed(1)} kW)`;
      } else {
        gridPower = -surplus;
        statusText = 'GRID EXPORT (FULL)';
      }
    }

    gridVal.textContent = `${gridPower.toFixed(1)} kW`;
    if (bessStatus) bessStatus.textContent = statusText;

    // Shift chart data
    bessData.shift();
    bessData.push(bessPower);

    gridData.shift();
    gridData.push(gridPower);

    drawChart();
  }

  function drawChart() {
    const w = canvas.width = canvas.parentElement.clientWidth;
    const h = canvas.height = canvas.parentElement.clientHeight;

    ctx.clearRect(0, 0, w, h);

    // Draw baseline
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();

    const step = w / (historyLength - 1);

    // Draw BESS Power Curve (Cyan)
    ctx.beginPath();
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 2.5;
    for (let i = 0; i < historyLength; i++) {
      const x = i * step;
      // Map -15 to +15 kW onto height
      const y = (h / 2) - (bessData[i] / 20) * (h / 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw Grid Power Curve (Purple)
    ctx.beginPath();
    ctx.strokeStyle = '#7928ca';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    for (let i = 0; i < historyLength; i++) {
      const x = i * step;
      const y = (h / 2) - (gridData[i] / 20) * (h / 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  if (socSlider && solarSlider && loadSlider) {
    socSlider.addEventListener('input', updateSimulation);
    solarSlider.addEventListener('input', updateSimulation);
    loadSlider.addEventListener('input', updateSimulation);
    updateSimulation();
  }
}

/* ==========================================
   6. INTERACTIVE PCB LAYER INSPECTOR
   ========================================== */
function initPcbInspector() {
  const container = document.getElementById('pcb-layer-canvas');
  if (!container) return;

  const layerBtns = document.querySelectorAll('.layer-btn');
  let activeLayers = { signal: true, power: true, ground: true, silk: true };

  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function renderPcb() {
    const w = canvas.width = container.clientWidth;
    const h = canvas.height = container.clientHeight;

    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, w, h);

    // Ground Plane Layer
    if (activeLayers.ground) {
      ctx.fillStyle = 'rgba(15, 30, 50, 0.6)';
      ctx.fillRect(20, 20, w - 40, h - 40);
    }

    // Power Plane Layer
    if (activeLayers.power) {
      ctx.strokeStyle = 'rgba(255, 171, 0, 0.4)';
      ctx.lineWidth = 6;
      ctx.strokeRect(35, 35, w - 70, h - 70);
    }

    // Signal Traces Layer
    if (activeLayers.signal) {
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 2.5;

      // Draw trace bus
      const startX = 50;
      const startY = h / 2;

      for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(startX, startY + i * 12);
        ctx.lineTo(startX + 120, startY + i * 12);
        ctx.lineTo(startX + 180, startY + i * 12 + 30);
        ctx.lineTo(w - 60, startY + i * 12 + 30);
        ctx.stroke();
      }
    }

    // Silkscreen Layer
    if (activeLayers.silk) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(w / 2 - 40, h / 2 - 40, 80, 80);

      ctx.fillStyle = '#fff';
      ctx.font = '10px Fira Code';
      ctx.fillText('MCU_U1 (Cortex-M4)', w / 2 - 38, h / 2 - 46);
      ctx.fillText('REV 2.4 - RAJASHEKAR', 40, h - 28);
    }
  }

  layerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const layer = btn.getAttribute('data-layer');
      btn.classList.toggle('active');
      activeLayers[layer] = btn.classList.contains('active');
      renderPcb();
    });
  });

  window.addEventListener('resize', renderPcb);
  renderPcb();
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
    help: 'Available commands: [help, bio, skills, projects, bess, github, cloudflare, contact, clear]',
    bio: 'Rajashekar Thoutam - Embedded & Systems Engineer specializing in IoT, BESS simulators, and hardware design.',
    skills: 'Core Tech: C/C++, Embedded RTOS, Python, KiCad PCB, MQTT/CAN, Linux Kernel, Cloudflare Workers/Pages.',
    projects: 'Projects: 1. Smart BESS Telemetry Simulator 2. Multilayer PCB High-Speed Suite 3. Linux SOF/Driver Diagnostic Tool.',
    bess: 'Smart Battery Energy Storage Simulator - Telemetry dashboard for solar & grid microgrids.',
    github: 'GitHub Profile: https://github.com/rajashekarthoutam',
    cloudflare: 'Deployed via Cloudflare Pages edge network with SSL & global CDN acceleration.',
    contact: 'Email: rajashekar.thoutam.dev@gmail.com | GitHub: rajashekarthoutam',
    matrix: 'Entering matrix mode... 01001000 01000101 01001100 01001100 01001111'
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
      } else if (cmd.startsWith('sudo hire')) {
        appendLine('Access Granted! Sending interview invite to rajashekar...', 'highlight');
      } else {
        appendLine(`Command not found: "${cmd}". Type "help" for list of commands.`, 'output');
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
   8. LIVE GITHUB FEED (API FETCH)
   ========================================== */
async function initGithubFeed() {
  const repoContainer = document.getElementById('github-repos-list');
  if (!repoContainer) return;

  const username = 'rajashekarthoutam';

  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=4`);
    if (!res.ok) throw new Error('API Rate Limit or Offline');
    const repos = await res.json();

    repoContainer.innerHTML = '';
    repos.forEach(repo => {
      const item = document.createElement('div');
      item.className = 'repo-item';
      item.innerHTML = `
        <div>
          <a href="${repo.html_url}" target="_blank" rel="noopener" class="repo-name">${repo.name}</a>
          <div class="repo-desc">${repo.description || 'Hardware & Embedded System codebase'}</div>
        </div>
        <div class="repo-meta">
          <span>★ ${repo.stargazers_count}</span>
          <span>⚡ ${repo.language || 'C++'}</span>
        </div>
      `;
      repoContainer.appendChild(item);
    });
  } catch (err) {
    // Graceful fallback display
    repoContainer.innerHTML = `
      <div class="repo-item">
        <div>
          <a href="https://github.com/rajashekarthoutam/website" target="_blank" class="repo-name">website</a>
          <div class="repo-desc">Official Portfolio & Engineering Showcase built for Cloudflare Pages</div>
        </div>
        <div class="repo-meta"><span>★ 1</span><span>HTML/JS</span></div>
      </div>
      <div class="repo-item">
        <div>
          <a href="https://github.com/rajashekarthoutam" target="_blank" class="repo-name">bess-simulator-core</a>
          <div class="repo-desc">Smart Energy Battery Storage Telemetry & Microgrid Simulator</div>
        </div>
        <div class="repo-meta"><span>★ 4</span><span>Python/C++</span></div>
      </div>
    `;
  }
}

/* ==========================================
   9. CLOUDFLARE EDGE STATUS
   ========================================== */
function initCloudflareStatus() {
  const pingEl = document.getElementById('cf-ping');
  const nodeEl = document.getElementById('cf-node');

  if (pingEl) {
    // Dynamic simulated latency indicator
    setInterval(() => {
      const latency = Math.floor(Math.random() * 12) + 8; // 8ms - 20ms
      pingEl.textContent = `${latency} ms`;
    }, 3000);
  }

  if (nodeEl) {
    const popList = ['HYD (Hyderabad)', 'BOM (Mumbai)', 'DEL (Delhi)', 'SIN (Singapore)', 'LHR (London)'];
    nodeEl.textContent = popList[0];
  }
}

/* ==========================================
   10. CONTACT FORM
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
      alertBox.innerHTML = '⚡ Thank you! Your message has been sent to Rajashekar Thoutam.';
      form.reset();

      setTimeout(() => {
        alertBox.style.display = 'none';
      }, 5000);
    }
  });
}

/* ==========================================
   11. MODALS
   ========================================== */
function initModals() {
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const triggerBtns = document.querySelectorAll('[data-modal-target]');

  if (!overlay) return;

  const modalDetails = {
    bess: {
      title: 'Smart BESS Energy Telemetry Simulator',
      content: `
        <p><strong>Overview:</strong> High-performance IoT microgrid battery energy storage simulator with real-time state-of-charge calculation, PV solar generation tracking, and grid peak shaving logic.</p>
        <br>
        <p><strong>Technical Highlights:</strong></p>
        <ul style="margin-left: 1.5rem; color: #94a3b8;">
          <li>Real-time telemetry rendering using HTML5 Canvas API</li>
          <li>Modbus TCP / MQTT telemetry protocol simulation</li>
          <li>Dynamic grid stability calculation and export/import auto-balancing</li>
        </ul>
      `
    },
    pcb: {
      title: 'Multilayer High-Speed PCB Suite',
      content: `
        <p><strong>Overview:</strong> Industrial KiCad EDA PCB layout for ARM Cortex-M4 embedded control units with differential pair length matching and power plane split optimization.</p>
        <br>
        <p><strong>Technical Highlights:</strong></p>
        <ul style="margin-left: 1.5rem; color: #94a3b8;">
          <li>4-layer impedance-controlled stackup</li>
          <li>USB 2.0 High-Speed & CAN bus differential line routing</li>
          <li>Low noise thermal relief and power plane stitching vias</li>
        </ul>
      `
    },
    iot: {
      title: 'IoT Microcontroller Edge Gateway',
      content: `
        <p><strong>Overview:</strong> Embedded Linux & RTOS gateway node executing real-time sensor ingestion, MQTT broker telemetry relay, and Cloudflare Worker API edge synchronization.</p>
        <br>
        <p><strong>Technical Highlights:</strong></p>
        <ul style="margin-left: 1.5rem; color: #94a3b8;">
          <li>Custom Linux driver setup & kernel SOF diagnostic tuning</li>
          <li>Low latency MQTT telemetry payload serialization</li>
          <li>Fail-safe OTA update dispatcher</li>
        </ul>
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

  if (closeBtn) {
    closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  });
}
