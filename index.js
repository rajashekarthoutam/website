/**
 * RAJASHEKAR THOUTAM - HARDWARE & EMBEDDED SHOWCASE SCRIPT
 * Features: Three.js 3D FPGA Core, Procedural Web Audio Synthesizer,
 * Floating Capsule Pill Nav, Magnetic Cursor, FSM & LFSR Simulator, Architecture Modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThreeWebGLScene();
  initWebAudioSynthesizer();
  initCustomCursor();
  initCapsulePillNav();
  initFPGALfsrSimulator();
  initContactForm();
  initModals();
});

/* ==========================================================================
   1. THREE.JS WEBGL 3D HOLOGRAPHIC SCENE (FPGA SILICON DIE & ORBITING BUS RINGS)
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

  // 1. Central Tang Nano 20K FPGA Die (Dark Metallic Core with Emerald Edges)
  const dieGeo = new THREE.BoxGeometry(4.4, 4.4, 0.85);
  const dieMat = new THREE.MeshStandardMaterial({
    color: 0x03120d,
    metalness: 0.9,
    roughness: 0.18,
    transparent: true,
    opacity: 0.88
  });
  const dieMesh = new THREE.Mesh(dieGeo, dieMat);
  fpgaGroup.add(dieMesh);

  // Wireframe Cage with Emerald Glow
  const edgeGeo = new THREE.EdgesGeometry(dieGeo);
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 2 });
  const wireframeCage = new THREE.LineSegments(edgeGeo, edgeMat);
  dieMesh.add(wireframeCage);

  // 2. Substrate Logic Grid
  const gridHelper = new THREE.GridHelper(3.8, 8, 0x10b981, 0x4c1d95);
  gridHelper.rotation.x = Math.PI / 2;
  gridHelper.position.z = 0.45;
  fpgaGroup.add(gridHelper);

  // 3. Orbiting Logic Bus Rings (Emerald & Violet Matrix)
  const ring1Geo = new THREE.TorusGeometry(6.2, 0.045, 16, 100);
  const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true });
  const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
  ring1.rotation.x = Math.PI / 3;
  fpgaGroup.add(ring1);

  const ring2Geo = new THREE.TorusGeometry(8.2, 0.05, 16, 100);
  const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.y = Math.PI / 4;
  fpgaGroup.add(ring2);

  // 4. Data Packet Electron Particle Cloud
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
    color: 0x05f29d,
    size: 0.16,
    transparent: true,
    opacity: 0.85
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  fpgaGroup.add(particleSystem);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambientLight);

  const pointLightEmerald = new THREE.PointLight(0x10b981, 3, 50);
  pointLightEmerald.position.set(10, 10, 15);
  scene.add(pointLightEmerald);

  const pointLightViolet = new THREE.PointLight(0x8b5cf6, 2.5, 50);
  pointLightViolet.position.set(-10, -10, 10);
  scene.add(pointLightViolet);

  // Mouse Parallax & Interaction
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
      playTone(587.33, 0.08, 'sine', 0.15); // D5
      setTimeout(() => playTone(880, 0.12, 'sine', 0.18), 70); // A5
    } else {
      toggleBtn.classList.remove('sound-active');
    }
  });

  const hoverables = document.querySelectorAll('a, button');
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
  const notes = [523.25, 659.25, 783.99, 1046.50]; // Ascending C Major chord
  notes.forEach((freq, idx) => {
    setTimeout(() => playTone(freq, 0.25, 'sine', 0.12), idx * 100);
  });
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

  const interactives = document.querySelectorAll('a, button, input');
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
   5. TANG NANO 20K FPGA FSM & LFSR SIMULATOR
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

    // Stage 1: LFSR Calculation
    statusBadge.textContent = 'STATUS: S1 (GEN LFSR)';
    statusBadge.style.color = 'var(--color-emerald-glow)';
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

    // Stage 2: Simplex UART Packet Transmission
    setTimeout(() => {
      statusBadge.textContent = 'STATUS: S2 (UART TX)';
      statusBadge.style.color = 'var(--color-violet)';
      setActiveNode('tx');
      setPulsingLine(1);
      otpDisplay.textContent = `PAYLOAD: [${calculatedOtp}]`;
      playTone(850, 0.08, 'sine', 0.1);

      // Stage 3: Tang Nano 20K FPGA Verification
      setTimeout(() => {
        statusBadge.textContent = 'STATUS: S3 (FPGA VERIFY)';
        statusBadge.style.color = 'var(--color-cyan)';
        setActiveNode('verify');
        setPulsingLine(2);
        playTone(1050, 0.08, 'sine', 0.1);

        // Stage 4: Verified & Unlock Actuation
        setTimeout(() => {
          statusBadge.textContent = 'STATUS: S4 (RELAY UNLOCKED)';
          statusBadge.style.color = 'var(--color-emerald-glow)';
          setActiveNode('unlock');
          setPulsingLine(3);
          otpDisplay.textContent = `TOKEN VERIFIED: ${calculatedOtp}`;
          relayDisplay.textContent = 'SOLENOID RELAY ENERGIZED (ACTIVE-HIGH 3.3V)';
          relayDisplay.style.color = 'var(--color-emerald-glow)';
          playUnlockChime();

          // Return to idle after hold
          setTimeout(() => {
            setActiveNode('idle');
            setPulsingLine(-1);
            statusBadge.textContent = 'STATUS: IDLE';
            statusBadge.style.color = 'var(--color-emerald-glow)';
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
    relayDisplay.textContent = 'LOCKED (HIGH IMPEDANCE PASSIVE)';
    relayDisplay.style.color = 'var(--color-text-dim)';
    statusBadge.textContent = 'STATUS: IDLE';
    statusBadge.style.color = 'var(--color-emerald-glow)';
    setActiveNode('idle');
    setPulsingLine(-1);
    isRunning = false;
    btnRun.disabled = false;
  });
}

/* ==========================================================================
   6. CONTACT FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const alertBox = document.getElementById('contact-alert');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (alertBox) {
      alertBox.style.display = 'block';
      alertBox.className = 'sim-chip';
      alertBox.style.width = '100%';
      alertBox.style.padding = '0.75rem';
      alertBox.style.marginTop = '1rem';
      alertBox.innerHTML = '⚡ Thank you! Your message has been sent to Rajashekar Thoutam.';
      form.reset();

      setTimeout(() => {
        alertBox.style.display = 'none';
      }, 5000);
    }
  });
}

/* ==========================================================================
   7. MODAL WINDOWS (FPGA ARCHITECTURE SPECIFICATION)
   ========================================================================== */
function initModals() {
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const triggerBtns = document.querySelectorAll('[data-modal-target]');

  if (!overlay) return;

  const modalDetails = {
    fpga_lock: {
      title: 'Dual-Hardware Secure Locking System (Tang Nano 20K FPGA & ESP32)',
      content: `
        <div style="color: #e2e8f0; line-height: 1.7; font-family: var(--font-main);">
          <h4 style="color: var(--color-emerald-glow); font-size: 1.2rem; font-weight: 800; text-transform: uppercase;">
            Hardware-Isolated Root of Trust Architecture
          </h4>
          <p style="color: var(--color-text-muted); margin-top: 0.5rem;">
            An air-gapped embedded security architecture that physically decouples wireless RF communication from hardware execution logic.
          </p>
          <br>
          <div style="background: #020408; padding: 1.25rem; border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.3); font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6; margin-bottom: 1.5rem;">
            <div>[ESP32 Token Unit] ──(ESP-NOW RF)──► [Receiver ESP32] ──(Simplex UART)──► [Tang Nano 20K FPGA]</div>
            <div style="color: var(--color-emerald-glow); margin-top: 0.5rem;">Root of Trust: 16-bit LFSR Verilog FSM (Hardware Isolated) ──► Solenoid Relay</div>
          </div>
          <ul style="margin-left: 1.5rem; color: #cbd5e1; line-height: 1.8;">
            <li><strong>Hardware Root of Trust:</strong> Tang Nano 20K FPGA (Gowin GW2AR-18C) running a 6-state Verilog Finite State Machine clocked at 27 MHz.</li>
            <li><strong>Dynamic Rolling Code Engine:</strong> 16-bit Linear Feedback Shift Register (LFSR) with maximal-length taps ($x^{16} + x^{14} + x^{13} + x^{11} + 1$) calculating 65,535 non-repeating dynamic OTP authentication keys.</li>
            <li><strong>Simplex Pipeline:</strong> Unidirectional physical UART bus between the ESP32 receiver and the FPGA core, making physical reverse-probing from external interfaces mathematically impossible.</li>
            <li><strong>Token Display Unit:</strong> Handheld secondary ESP32 unit executing router-less peer-to-peer ESP-NOW protocol for instant token confirmation.</li>
          </ul>
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

  if (closeBtn) closeBtn.addEventListener('click', () => overlay.classList.remove('active'));

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  });
}
