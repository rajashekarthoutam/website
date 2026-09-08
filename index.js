/**
 * WEBGL & HOLOGRAPHIC PORTFOLIO TEMPLATE SCRIPT
 * Features: Three.js 3D Silicon Core, Procedural Web Audio Synthesizer,
 * Floating Capsule Pill Nav, Magnetic Cursor, Interactive Simulators & Terminal.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThreeWebGLScene();
  initWebAudioSynthesizer();
  initCustomCursor();
  initCapsulePillNav();
  initFPGALfsrSimulator();
  initAutomotiveSensorDashboard();
  initEngineeringTerminal();
  initProjectFilters();
  initContactForm();
  initModals();
});

/* ==========================================================================
   1. THREE.JS WEBGL 3D HOLOGRAPHIC SCENE
   ========================================================================== */
function initThreeWebGLScene() {
  const container = document.getElementById('webgl-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 18;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const fpgaGroup = new THREE.Group();
  scene.add(fpgaGroup);

  // 1. Central Core Cube with Wireframe overlay
  const dieGeo = new THREE.BoxGeometry(4.2, 4.2, 0.8);
  const dieMat = new THREE.MeshStandardMaterial({
    color: 0x051329,
    metalness: 0.9,
    roughness: 0.2,
    transparent: true,
    opacity: 0.85
  });
  const dieMesh = new THREE.Mesh(dieGeo, dieMat);
  fpgaGroup.add(dieMesh);

  // Wireframe Cage
  const edgeGeo = new THREE.EdgesGeometry(dieGeo);
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x00f2fe, linewidth: 2 });
  const wireframeCage = new THREE.LineSegments(edgeGeo, edgeMat);
  dieMesh.add(wireframeCage);

  // 2. Substrate Grid
  const gridHelper = new THREE.GridHelper(3.8, 8, 0x00f2fe, 0x004880);
  gridHelper.rotation.x = Math.PI / 2;
  gridHelper.position.z = 0.42;
  fpgaGroup.add(gridHelper);

  // 3. Orbiting Rings
  const ring1Geo = new THREE.TorusGeometry(6.2, 0.04, 16, 100);
  const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, wireframe: true });
  const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
  ring1.rotation.x = Math.PI / 3;
  fpgaGroup.add(ring1);

  const ring2Geo = new THREE.TorusGeometry(8.2, 0.05, 16, 100);
  const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.y = Math.PI / 4;
  fpgaGroup.add(ring2);

  // 4. Data Particle Cloud
  const particleCount = 280;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    const radius = 5.5 + Math.random() * 5.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
    particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    particlePositions[i + 2] = radius * Math.cos(phi);
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x00f2fe,
    size: 0.16,
    transparent: true,
    opacity: 0.8
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  fpgaGroup.add(particleSystem);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const pointLightCyan = new THREE.PointLight(0x00f2fe, 3, 50);
  pointLightCyan.position.set(10, 10, 15);
  scene.add(pointLightCyan);

  const pointLightPurple = new THREE.PointLight(0x8b5cf6, 2, 50);
  pointLightPurple.position.set(-10, -10, 10);
  scene.add(pointLightPurple);

  // Mouse Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - windowHalfX) * 0.0012;
    mouseY = (e.clientY - windowHalfY) * 0.0012;
  });

  function animate() {
    requestAnimationFrame(animate);

    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    fpgaGroup.rotation.y += 0.006;
    fpgaGroup.rotation.x += 0.003;

    fpgaGroup.rotation.y += targetX * 0.4;
    fpgaGroup.rotation.x += targetY * 0.4;

    ring1.rotation.z += 0.01;
    ring2.rotation.z -= 0.008;
    particleSystem.rotation.y += 0.003;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

/* ==========================================================================
   2. PROCEDURAL WEB AUDIO SYNTHESIZER
   ========================================================================== */
let audioCtx = null;
let isAudioEnabled = false;

function initWebAudioSynthesizer() {
  const toggleBtn = document.getElementById('sound-toggle');
  if (!toggleBtn) return;

  function createAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  toggleBtn.addEventListener('click', () => {
    createAudioContext();
    isAudioEnabled = !isAudioEnabled;

    if (isAudioEnabled) {
      toggleBtn.classList.add('sound-active');
      playTone(587.33, 0.08, 'sine', 0.15);
      setTimeout(() => playTone(880, 0.12, 'sine', 0.18), 70);
    } else {
      toggleBtn.classList.remove('sound-active');
    }
  });

  const hoverables = document.querySelectorAll('a, button, .cmd-chip, .filter-btn');
  hoverables.forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      if (isAudioEnabled) playTone(920, 0.03, 'sine', 0.04);
    });
    elem.addEventListener('click', () => {
      if (isAudioEnabled) playTone(440, 0.05, 'triangle', 0.1);
    });
  });
}

function playTone(freq, duration, type = 'sine', volume = 0.1) {
  if (!audioCtx || !isAudioEnabled) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Audio policy handling
  }
}

function playUnlockChime() {
  if (!audioCtx || !isAudioEnabled) return;
  const notes = [523.25, 659.25, 783.99, 1046.50];
  notes.forEach((freq, idx) => {
    setTimeout(() => playTone(freq, 0.25, 'sine', 0.12), idx * 100);
  });
}

function playHazardAlert() {
  if (!audioCtx || !isAudioEnabled) return;
  playTone(850, 0.12, 'sawtooth', 0.1);
  setTimeout(() => playTone(650, 0.14, 'sawtooth', 0.12), 110);
}

/* ==========================================================================
   3. CUSTOM MAGNETIC CURSOR
   ========================================================================== */
function initCustomCursor() {
  const cursorWrapper = document.getElementById('custom-cursor');
  if (!cursorWrapper) return;

  let mouseX = 0;
  let mouseY = 0;
  let posX = 0;
  let posY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  window.addEventListener('mousedown', () => cursorWrapper.classList.add('active'));
  window.addEventListener('mouseup', () => cursorWrapper.classList.remove('active'));

  const interactives = document.querySelectorAll('a, button, input, .project-card, .cmd-chip, .filter-btn');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => cursorWrapper.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursorWrapper.classList.remove('hovered'));
  });

  function loop() {
    posX += (mouseX - posX) * 0.22;
    posY += (mouseY - posY) * 0.22;
    cursorWrapper.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
    requestAnimationFrame(loop);
  }
  loop();
}

/* ==========================================================================
   4. CAPSULE PILL NAVIGATION WITH SLIDING BAR
   ========================================================================== */
function initCapsulePillNav() {
  const container = document.getElementById('nav-pill-container');
  const bar = document.getElementById('nav-pill-bar');
  const links = document.querySelectorAll('.nav-pill-link');
  const sections = document.querySelectorAll('section[id]');

  if (!container || !bar || links.length === 0) return;

  function updateBar(targetLink) {
    if (!targetLink) return;
    const linkRect = targetLink.getBoundingClientRect();
    const contRect = container.getBoundingClientRect();
    const offsetLeft = linkRect.left - contRect.left;
    const width = linkRect.width;

    bar.style.transform = `translateX(${offsetLeft}px)`;
    bar.style.width = `${width}px`;

    links.forEach(l => l.classList.remove('active'));
    targetLink.classList.add('active');
  }

  const activeLink = document.querySelector('.nav-pill-link.active') || links[0];
  setTimeout(() => updateBar(activeLink), 100);

  links.forEach(link => {
    link.addEventListener('click', () => updateBar(link));
  });

  window.addEventListener('scroll', () => {
    let currentId = '';
    sections.forEach(section => {
      const top = section.offsetTop - 140;
      if (window.scrollY >= top) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      const currentLink = document.querySelector(`.nav-pill-link[data-nav="${currentId}"]`);
      if (currentLink && !currentLink.classList.contains('active')) {
        updateBar(currentLink);
      }
    }
  });

  window.addEventListener('resize', () => {
    const currentActive = document.querySelector('.nav-pill-link.active');
    if (currentActive) updateBar(currentActive);
  });
}

/* ==========================================================================
   5. FPGA FSM & LFSR SIMULATOR
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

  let currentLfsr = 0xACE1;
  let isRunning = false;

  function stepLfsr16(val) {
    let bit = ((val >> 0) ^ (val >> 2) ^ (val >> 3) ^ (val >> 5)) & 1;
    let next = (val >> 1) | (bit << 15);
    return next & 0xFFFF;
  }

  function setActiveNode(activeKey) {
    Object.keys(nodes).forEach(key => {
      if (nodes[key]) {
        if (key === activeKey) nodes[key].classList.add('active');
        else nodes[key].classList.remove('active');
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

    statusBadge.textContent = 'STATUS: S1 (GEN TOKEN)';
    statusBadge.style.color = 'var(--color-cyan-glow)';
    setActiveNode('lfsr');
    setPulsingLine(0);
    playTone(700, 0.08, 'sine', 0.1);

    currentLfsr = stepLfsr16(currentLfsr);
    const hexSeed = '0x' + currentLfsr.toString(16).toUpperCase().padStart(4, '0');
    seedDisplay.textContent = `${hexSeed} (${currentLfsr})`;

    const calculatedOtp = (currentLfsr % 9000 + 1000).toString();
    otpDisplay.textContent = 'CALCULATING...';
    relayDisplay.textContent = 'WAITING FOR PACKET';
    relayDisplay.style.color = 'var(--color-text-dim)';

    setTimeout(() => {
      statusBadge.textContent = 'STATUS: S2 (PACKET TX)';
      statusBadge.style.color = 'var(--color-purple)';
      setActiveNode('tx');
      setPulsingLine(1);
      otpDisplay.textContent = `PAYLOAD: [${calculatedOtp}]`;
      playTone(850, 0.08, 'sine', 0.1);

      setTimeout(() => {
        statusBadge.textContent = 'STATUS: S3 (VERIFY)';
        statusBadge.style.color = 'var(--color-orange)';
        setActiveNode('verify');
        setPulsingLine(2);
        playTone(1050, 0.08, 'sine', 0.1);

        setTimeout(() => {
          statusBadge.textContent = 'STATUS: S4 (SUCCESS)';
          statusBadge.style.color = 'var(--color-emerald)';
          setActiveNode('unlock');
          setPulsingLine(3);
          otpDisplay.textContent = `VERIFIED: ${calculatedOtp}`;
          relayDisplay.textContent = 'SYSTEM ACTIVE (VERIFIED)';
          relayDisplay.style.color = 'var(--color-emerald)';
          playUnlockChime();

          setTimeout(() => {
            setActiveNode('idle');
            setPulsingLine(-1);
            statusBadge.textContent = 'STATUS: IDLE';
            statusBadge.style.color = 'var(--color-emerald)';
            relayDisplay.textContent = 'STANDBY (READY)';
            relayDisplay.style.color = 'var(--color-text-dim)';
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
    relayDisplay.textContent = 'STANDBY (READY)';
    relayDisplay.style.color = 'var(--color-text-dim)';
    statusBadge.textContent = 'STATUS: IDLE';
    statusBadge.style.color = 'var(--color-emerald)';
    setActiveNode('idle');
    setPulsingLine(-1);
    isRunning = false;
    btnRun.disabled = false;
  });
}

/* ==========================================================================
   6. METRICS & TELEMETRY DASHBOARD
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

    valDist.textContent = `${dist} ms ${dist < 30 ? '(CRITICAL <30ms)' : '(Normal)'}`;
    valAlc.textContent = `${alc} req/s ${alc > 300 ? '(HIGH LOAD >300)' : '(Normal)'}`;
    valTemp.textContent = `${temp} °C ${temp > 95 ? '(THERMAL WARNING >95°C)' : '(Optimal <95°C)'}`;

    let hazards = [];
    if (dist < 30) hazards.push(`Latency Bottleneck Alert (${dist}ms)`);
    if (alc > 300) hazards.push(`Throughput Spike Event (${alc} req/s)`);
    if (temp > 95) hazards.push(`Thermal Compute Load Exceeded (${temp}°C)`);

    if (hazards.length > 0) {
      hazardBox.className = 'hazard-alert-box danger';
      hazardIcon.className = 'fa-solid fa-triangle-exclamation';
      hazardText.textContent = hazards.join(' | ');
      buzzerTag.textContent = 'ALERT: ACTIVE FREQUENCY';
      buzzerTag.style.color = '#ef4444';
      buzzerTag.style.fontWeight = '700';

      sensorStatusBadge.textContent = 'THRESHOLD ALERT';
      sensorStatusBadge.style.background = 'rgba(239, 68, 68, 0.2)';
      sensorStatusBadge.style.color = '#ef4444';

      playHazardAlert();
    } else {
      hazardBox.className = 'hazard-alert-box';
      hazardIcon.className = 'fa-solid fa-circle-check';
      hazardText.textContent = 'All telemetry parameters operating within normal parameters.';
      buzzerTag.textContent = 'ALERT: STANDBY';
      buzzerTag.style.color = 'var(--color-emerald)';
      buzzerTag.style.fontWeight = 'normal';

      sensorStatusBadge.textContent = 'SYS NORMAL';
      sensorStatusBadge.style.background = 'rgba(16, 185, 129, 0.15)';
      sensorStatusBadge.style.color = 'var(--color-emerald)';
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
   7. INTERACTIVE ENGINEERING CLI TERMINAL
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
  • <span style="color: var(--color-cyan-glow);">skills</span>     - View technical competencies & stack
  • <span style="color: var(--color-cyan-glow);">projects</span>   - List featured engineering repositories & projects
  • <span style="color: var(--color-cyan-glow);">specs</span>      - Workstation & development environment specs
  • <span style="color: var(--color-cyan-glow);">resume</span>     - Open technical resume specification modal
  • <span style="color: var(--color-cyan-glow);">contact</span>    - View direct contact details & links
  • <span style="color: var(--color-cyan-glow);">clear</span>      - Clear terminal stream
    `,
    skills: `
<span style="color: var(--color-purple);">Core Languages:</span> TypeScript, JavaScript, Python, Node.js, C/C++, HTML5/CSS3.
<span style="color: var(--color-cyan-glow);">3D & Graphics:</span> Three.js, WebGL, Canvas API, Custom Shaders.
<span style="color: var(--color-emerald);">Architecture:</span> Cloudflare Workers/Pages, Docker, Distributed APIs, Tailscale.
    `,
    projects: `
1. <span style="color: var(--color-cyan-glow);">Interactive 3D Simulation Platform</span> - Three.js WebGL + Real-Time Shaders.
2. <span style="color: var(--color-orange);">Real-Time Telemetry & Monitoring Suite</span> - Node.js + WebSockets + Redis.
3. <span style="color: var(--color-purple);">Distributed Energy & Grid Infrastructure</span> - Smart microgrid algorithm.
4. <span style="color: var(--color-emerald);">Containerized Messaging & Mesh Network</span> - Docker + Tailscale P2P.
    `,
    specs: `
<span style="color: var(--color-emerald);">Environment:</span> Modern Cloud & Native Architecture
<span style="color: var(--color-cyan-glow);">Tooling:</span> Three.js, Node.js, WebGL, Docker, Vite
<span style="color: var(--color-purple);">Deployment:</span> Cloudflare Pages + Edge Network
    `,
    contact: `
<span style="color: var(--color-cyan-glow);">Email:</span> contact@yourdomain.com
<span style="color: var(--color-emerald);">Location:</span> Your City, Country
<span style="color: var(--color-purple);">GitHub:</span> https://github.com/yourusername
    `,
    resume: `Opening Resume Modal...`
  };

  function executeCommand(cmd) {
    const trimmed = cmd.trim().toLowerCase();
    const line = document.createElement('div');
    line.innerHTML = `<span class="prompt-symbol">developer@portfolio:~$</span> ${cmd}`;
    stream.appendChild(line);

    if (trimmed === 'clear') {
      stream.innerHTML = `
        <div style="color: var(--color-cyan-glow);">=== INTERACTIVE DEVELOPER SHELL v3.0 ===</div>
        <div style="color: var(--color-text-muted); margin-bottom: 0.75rem;">Type 'help' for available commands or click the chips below.</div>
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
      resp.innerHTML = `<span style="color: #ef4444;">zsh: command not found: ${trimmed}</span>. Type '<span style="color: var(--color-cyan-glow);">help</span>' for available commands.`;
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
      executeCommand('skills');
    });
  }
}

/* ==========================================================================
   8. PROJECT FILTER SYSTEM
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
   9. CONTACT FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const alertBox = document.getElementById('contact-alert');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (alertBox) {
      alertBox.style.display = 'block';
      alertBox.className = 'hazard-alert-box';
      alertBox.innerHTML = '⚡ Thank you! Your message has been sent successfully.';
      form.reset();

      setTimeout(() => {
        alertBox.style.display = 'none';
      }, 5000);
    }
  });
}

/* ==========================================================================
   10. MODAL WINDOWS
   ========================================================================== */
function initModals() {
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const triggerBtns = document.querySelectorAll('[data-modal-target]');

  const navResumeBtn = document.getElementById('btn-view-resume-nav');

  if (!overlay) return;

  const modalDetails = {
    proj1: {
      title: 'Interactive 3D Simulation Platform',
      content: `
        <div style="color: #e2e8f0; line-height: 1.7;">
          <h4 style="color: var(--color-cyan-glow);">Project Architecture Overview</h4>
          <p>High-performance interactive 3D WebGL application featuring real-time physics and custom GLSL lighting shaders.</p>
          <br>
          <ul style="margin-left: 1.5rem; color: #94a3b8;">
            <li><strong>Renderer:</strong> Three.js WebGL with custom post-processing passes.</li>
            <li><strong>Shaders:</strong> Custom vertex and fragment GLSL shaders.</li>
            <li><strong>State Pipeline:</strong> Low-latency state synchronization.</li>
          </ul>
        </div>
      `
    },
    proj2: {
      title: 'Real-Time Telemetry & Monitoring Suite',
      content: `
        <div style="color: #e2e8f0; line-height: 1.7;">
          <h4 style="color: var(--color-cyan-glow);">System Architecture</h4>
          <p>High-throughput real-time telemetry processing platform.</p>
          <br>
          <ul style="margin-left: 1.5rem; color: #94a3b8;">
            <li><strong>Ingestion:</strong> Low-latency WebSocket connections.</li>
            <li><strong>In-Memory Cache:</strong> Redis pub/sub queuing.</li>
            <li><strong>Alert Engine:</strong> Automated threshold dispatching.</li>
          </ul>
        </div>
      `
    },
    proj3: {
      title: 'Distributed Energy & Grid Infrastructure',
      content: `
        <div style="color: #e2e8f0; line-height: 1.7;">
          <h4 style="color: var(--color-cyan-glow);">Decentralized Optimization</h4>
          <p>Bidirectional power flow control and microgrid balancing algorithms.</p>
        </div>
      `
    },
    proj4: {
      title: 'Containerized Messaging & Mesh Network',
      content: `
        <div style="color: #e2e8f0; line-height: 1.7;">
          <h4 style="color: var(--color-cyan-glow);">Encrypted P2P Architecture</h4>
          <p>Secure self-hosted offline-first messaging network deployed inside isolated containers.</p>
        </div>
      `
    },
    resume: {
      title: 'Curriculum Vitae & Technical Resume',
      content: `
        <div style="font-family: var(--font-main); color: #e2e8f0; line-height: 1.6;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
            <div>
              <h3 style="color: var(--color-cyan-glow); font-size: 1.6rem; font-weight: 800;">YOUR NAME HERE</h3>
              <p style="color: var(--color-text-muted); font-size: 0.9rem;">Your City, Country | contact@yourdomain.com</p>
            </div>
            <button class="btn-pill btn-pill-outline" onclick="window.print()" style="margin-top: 0.5rem;">
              <i class="fa-solid fa-print"></i> Print / Save PDF
            </button>
          </div>
          <hr style="border-color: rgba(255,255,255,0.1); margin: 1.25rem 0;">

          <h4 style="color: var(--color-purple); font-size: 1.1rem; font-weight: 700; margin-bottom: 0.4rem;">SUMMARY</h4>
          <p style="font-size: 0.92rem; color: #94a3b8;">Experienced engineer and developer building high-performance applications, interactive 3D web experiences, and robust architectures.</p>

          <br>
          <h4 style="color: var(--color-purple); font-size: 1.1rem; font-weight: 700; margin-bottom: 0.4rem;">TECHNICAL SKILLS</h4>
          <p style="font-size: 0.9rem; color: #94a3b8;">TypeScript, JavaScript, Python, Node.js, Three.js, WebGL, C/C++, Docker, Cloudflare, Tailscale, Git.</p>
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

  if (closeBtn) closeBtn.addEventListener('click', () => overlay.classList.remove('active'));

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  });
}
