/**
 * THOUTAM RAJASHEKAR - DAVID HECKHOFF INSPIRED WEBGL & HOLOGRAPHIC SCRIPT
 * Features: Three.js 3D FPGA Core, Procedural Web Audio Synthesizer,
 * Floating Capsule Pill Nav, Magnetic Cursor, Hardware Simulators & Terminal.
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
   1. THREE.JS WEBGL 3D HOLOGRAPHIC SCENE (HARDWARE FPGA DIE & ORBITING PARTICLES)
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

  // Group to rotate together
  const fpgaGroup = new THREE.Group();
  scene.add(fpgaGroup);

  // 1. Central Silicon Die (Cube with Wireframe overlay)
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

  // 2. Inner Chip Substrate Grid
  const gridHelper = new THREE.GridHelper(3.8, 8, 0x00f2fe, 0x004880);
  gridHelper.rotation.x = Math.PI / 2;
  gridHelper.position.z = 0.42;
  fpgaGroup.add(gridHelper);

  // 3. Orbiting Logic Bus Rings (Torus)
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

  // 4. Data Packet Particle Cloud
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

  // Animation Loop
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

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

/* ==========================================================================
   2. PROCEDURAL WEB AUDIO SYNTHESIZER (DAVID HECKHOFF AUDIO TOGGLE)
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
      playTone(587.33, 0.08, 'sine', 0.15); // D5 chime
      setTimeout(() => playTone(880, 0.12, 'sine', 0.18), 70); // A5 chime
    } else {
      toggleBtn.classList.remove('sound-active');
    }
  });

  // Attach hover sound to clickable elements
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
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 major chord
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
   3. CUSTOM MAGNETIC CURSOR (DAVID HECKHOFF STYLE)
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
   4. CAPSULE PILL NAVIGATION WITH SLIDING BAR (DAVID HECKHOFF STYLE)
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

  // Initial position for Home
  const activeLink = document.querySelector('.nav-pill-link.active') || links[0];
  setTimeout(() => updateBar(activeLink), 100);

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      updateBar(link);
    });
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
   5. FPGA FSM & LFSR SIMULATOR (WITH AUDIO & REAL ALGORITHMIC STEPPING)
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

    // Stage 1: LFSR Calculation
    statusBadge.textContent = 'STATUS: S1 (GEN LFSR)';
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

    // Stage 2: Simplex UART Transmission
    setTimeout(() => {
      statusBadge.textContent = 'STATUS: S2 (UART TX)';
      statusBadge.style.color = 'var(--color-purple)';
      setActiveNode('tx');
      setPulsingLine(1);
      otpDisplay.textContent = `PAYLOAD: [${calculatedOtp}]`;
      playTone(850, 0.08, 'sine', 0.1);

      // Stage 3: Tang Nano 20K FPGA Verification
      setTimeout(() => {
        statusBadge.textContent = 'STATUS: S3 (FPGA VERIFY)';
        statusBadge.style.color = 'var(--color-orange)';
        setActiveNode('verify');
        setPulsingLine(2);
        playTone(1050, 0.08, 'sine', 0.1);

        // Stage 4: Verified & Unlock Actuation
        setTimeout(() => {
          statusBadge.textContent = 'STATUS: S4 (UNLOCKED)';
          statusBadge.style.color = 'var(--color-emerald)';
          setActiveNode('unlock');
          setPulsingLine(3);
          otpDisplay.textContent = `TOKEN VERIFIED: ${calculatedOtp}`;
          relayDisplay.textContent = 'SOLENOID RELAY ENERGIZED (ACTIVE HIGH 3.3V)';
          relayDisplay.style.color = 'var(--color-emerald)';
          playUnlockChime(); // Celebratory harmonic chime

          // Return to idle after delay
          setTimeout(() => {
            setActiveNode('idle');
            setPulsingLine(-1);
            statusBadge.textContent = 'STATUS: IDLE';
            statusBadge.style.color = 'var(--color-emerald)';
            relayDisplay.textContent = 'AUTO-RELOCKED (PASSIVE HOLD)';
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
    relayDisplay.textContent = 'LOCKED (HIGH IMPEDANCE)';
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
   6. AUTOMOTIVE MULTI-SENSOR TELEMETRY DASHBOARD
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

      playHazardAlert();
    } else {
      hazardBox.className = 'hazard-alert-box';
      hazardIcon.className = 'fa-solid fa-circle-check';
      hazardText.textContent = 'All parameters within safe operating thresholds.';
      buzzerTag.textContent = 'BUZZER: SILENT';
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
  • <span style="color: var(--color-cyan-glow);">skills</span>     - View core hardware & embedded competencies
  • <span style="color: var(--color-cyan-glow);">projects</span>   - List featured engineering repositories & projects
  • <span style="color: var(--color-cyan-glow);">fpga</span>       - Inspect Tang Nano 20K FPGA architecture details
  • <span style="color: var(--color-cyan-glow);">medha</span>      - Medha Servo Drives industrial apprenticeship notes
  • <span style="color: var(--color-cyan-glow);">specs</span>      - Workstation & development environment specs
  • <span style="color: var(--color-cyan-glow);">resume</span>     - Open technical resume specification modal
  • <span style="color: var(--color-cyan-glow);">contact</span>    - View direct contact details & location
  • <span style="color: var(--color-cyan-glow);">clear</span>      - Clear terminal stream
    `,
    skills: `
<span style="color: var(--color-purple);">Hardware & Circuit:</span> Verilog HDL, Tang Nano 20K FPGA, Gowin EDA, KiCad, Traction Converters (LTC).
<span style="color: var(--color-cyan-glow);">Embedded & Protocols:</span> PIC16 (MPLAB X), ESP32 (ESP-NOW), Arduino Uno, UART/SPI/I2C, BLE.
<span style="color: var(--color-emerald);">Systems & AI:</span> Windows 11 Native Architecture, Scoop, Tailscale Mesh, Local LLMs.
    `,
    projects: `
1. <span style="color: var(--color-cyan-glow);">Dual-Hardware Secure Locking System</span> - Tang Nano 20K FPGA + ESP-NOW + 16-bit LFSR.
2. <span style="color: var(--color-orange);">Vehicle Multi-Sensor Safety System</span> - Arduino Uno + HC-SR04 + MQ-3 + Temp.
3. <span style="color: var(--color-purple);">V2G Smart Energy Infrastructure</span> - Bidirectional power flow & EV BMS logic.
4. <span style="color: var(--color-emerald);">Containerized Mesh Messaging</span> - Dockerized Matrix Synapse + Tailscale.
    `,
    fpga: `
<span style="color: var(--color-cyan-glow);">FPGA Core:</span> Tang Nano 20K (Gowin GW2AR-18C)
<span style="color: var(--color-purple);">Synthesis:</span> Gowin EDA / Xilinx Vivado
<span style="color: var(--color-emerald);">Key Logic:</span> 16-bit LFSR pseudo-random engine, Verilog 6-state FSM, 27 MHz clock.
<span style="color: var(--color-text-muted);">Decoupled Air-Gap: Simplex UART packet reception with relay drive output.</span>
    `,
    medha: `
<span style="color: var(--color-purple);">Medha Servo Drives - Assembly & Testing Technician / Apprentice</span>
• Assembled locomotive Traction Converters (LTC) following mechanical & schematic blueprints.
• Routed Optical Fiber Cables (OFC) for noise-immune pulse width modulation firing.
• Conducted high-voltage (HV) insulation resistance and calibration measurements.
    `,
    specs: `
<span style="color: var(--color-emerald);">Workstation Architecture:</span> Windows 11 Native (Pure CLI, Scoop package manager)
<span style="color: var(--color-cyan-glow);">Embedded EDA:</span> Gowin EDA v1.9, MPLAB X v6.20, KiCad v8, Arduino CLI
<span style="color: var(--color-purple);">Mesh Network:</span> Tailscale zero-config encrypted P2P overlay
    `,
    contact: `
<span style="color: var(--color-cyan-glow);">Email:</span> rajashekar.thoutam.dev@gmail.com
<span style="color: var(--color-emerald);">Location:</span> Hyderabad, Telangana, India
<span style="color: var(--color-purple);">GitHub:</span> https://github.com/rajashekarthoutam
<span style="color: var(--color-cyan-glow);">Domain:</span> https://rajashekarthoutam.in/
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
        <div style="color: var(--color-cyan-glow);">=== THOUTAM RAJASHEKAR - HARDWARE SHELL v3.0 ===</div>
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
      executeCommand('fpga');
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
      alertBox.innerHTML = '⚡ Thank you! Your message has been sent to Thoutam Rajashekar.';
      form.reset();

      setTimeout(() => {
        alertBox.style.display = 'none';
      }, 5000);
    }
  });
}

/* ==========================================================================
   10. MODAL WINDOWS (RESUME & SYSTEM SPECIFICATIONS)
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
    fpga_lock: {
      title: 'Dual-Hardware Secure Locking System (Tang Nano 20K & ESP32)',
      content: `
        <div style="color: #e2e8f0; line-height: 1.7;">
          <h4 style="color: var(--color-cyan-glow);">Hardware-Isolated Architecture</h4>
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
          <h4 style="color: var(--color-cyan-glow);">Sensor Ingestion Architecture</h4>
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
          <h4 style="color: var(--color-cyan-glow);">Major B.Tech Engineering Project</h4>
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
          <h4 style="color: var(--color-cyan-glow);">Deployment Architecture</h4>
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
              <h3 style="color: var(--color-cyan-glow); font-size: 1.6rem; font-weight: 800;">THOUTAM RAJASHEKAR</h3>
              <p style="color: var(--color-text-muted); font-size: 0.9rem;">Hyderabad, Telangana, India | rajashekar.thoutam.dev@gmail.com</p>
            </div>
            <button class="btn-pill btn-pill-outline" onclick="window.print()" style="margin-top: 0.5rem;">
              <i class="fa-solid fa-print"></i> Print / Save PDF
            </button>
          </div>
          <hr style="border-color: rgba(255,255,255,0.1); margin: 1.25rem 0;">

          <h4 style="color: var(--color-purple); font-size: 1.1rem; font-weight: 700; margin-bottom: 0.4rem;">EDUCATION</h4>
          <p><strong>B.Tech in Electronics & Communication Engineering</strong> - JBREC, Hyderabad (JNTUH R23 | <strong>CGPA: 7.93</strong>)</p>
          <p><strong>Diploma in ECE</strong> - Government Polytechnic Masabtank (2021–2023)</p>
          <p><strong>Electrician Certification</strong> - Shakthi ITI, Mancherial (2016–2018)</p>

          <br>
          <h4 style="color: var(--color-purple); font-size: 1.1rem; font-weight: 700; margin-bottom: 0.4rem;">INDUSTRIAL EXPERIENCE</h4>
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
          <h4 style="color: var(--color-purple); font-size: 1.1rem; font-weight: 700; margin-bottom: 0.4rem;">HARDWARE & SKILLS</h4>
          <p style="font-size: 0.9rem; color: #94a3b8;">Tang Nano 20K FPGA, Verilog HDL, Gowin EDA, Xilinx Vivado, KiCad, PIC16, ESP32 (ESP-NOW), Arduino Uno, Tailscale, Docker, Cloudflare Pages, WebGL.</p>
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
