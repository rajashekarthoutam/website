/**
 * THOUTAM RAJASHEKAR - MODERN 3D INTERFACE ENGINE
 * Features: Three.js Interactive Silicon Core, Smooth 3D Card Perspective Tilt, and Dynamic Glare
 */

(function () {
  'use strict';

  // --- 1. THREE.JS 3D INTERACTIVE SILICON LOGIC CORE ---
  const canvas3D = document.getElementById('hero-3d-canvas');
  const heroCard = document.getElementById('hero-3d-wrapper');

  if (canvas3D && window.THREE) {
    const scene = new THREE.Scene();
    
    const width = canvas3D.clientWidth || 320;
    const height = canvas3D.clientHeight || 240;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas3D,
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3D Core Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Inner Silicon Die (Cube)
    const dieGeo = new THREE.BoxGeometry(1.4, 1.4, 1.4);
    const dieMat = new THREE.MeshPhongMaterial({
      color: 0x0a1020,
      emissive: 0x041828,
      specular: 0x00f0ff,
      shininess: 100,
      wireframe: false
    });
    const dieMesh = new THREE.Mesh(dieGeo, dieMat);
    coreGroup.add(dieMesh);

    // Wireframe Outer Cage (Octahedron)
    const cageGeo = new THREE.OctahedronGeometry(2.1, 0);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    coreGroup.add(cageMesh);

    // Orbiting Ring 1 (FPGA Bus - Cyan)
    const ring1Geo = new THREE.TorusGeometry(2.5, 0.03, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.5
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    // Orbiting Ring 2 (Power Bus - Emerald)
    const ring2Geo = new THREE.TorusGeometry(2.7, 0.03, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.55
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    coreGroup.add(ring2);

    // Glowing Node Vertices
    const vertexGeo = new THREE.BufferGeometry();
    const vCount = 24;
    const vPositions = new Float32Array(vCount * 3);
    for (let i = 0; i < vCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 2.4;
      vPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      vPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      vPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    vertexGeo.setAttribute('position', new THREE.BufferAttribute(vPositions, 3));
    const vertexMat = new THREE.PointsMaterial({
      color: 0x10b981,
      size: 0.09,
      transparent: true,
      opacity: 0.9
    });
    const vertices = new THREE.Points(vertexGeo, vertexMat);
    coreGroup.add(vertices);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00f0ff, 2, 20);
    pointLight1.position.set(4, 4, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x10b981, 1.5, 20);
    pointLight2.position.set(-4, -4, 3);
    scene.add(pointLight2);

    // Mouse Interaction
    let targetRotX = 0;
    let targetRotY = 0;

    function onMouseMove(e) {
      const rect = canvas3D.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = x * 0.8;
      targetRotX = -y * 0.8;
    }

    if (heroCard) {
      heroCard.addEventListener('mousemove', onMouseMove);
      heroCard.addEventListener('mouseleave', () => {
        targetRotX = 0;
        targetRotY = 0;
      });
    }

    // Animation Render Loop
    function animate() {
      requestAnimationFrame(animate);

      // Auto gentle continuous rotation
      coreGroup.rotation.y += 0.008;
      coreGroup.rotation.x += 0.003;
      ring1.rotation.z += 0.012;
      ring2.rotation.z -= 0.01;

      // Smooth lerp toward mouse target
      coreGroup.rotation.y += (targetRotY - coreGroup.rotation.y) * 0.05;
      coreGroup.rotation.x += (targetRotX - coreGroup.rotation.x) * 0.05;

      renderer.render(scene, camera);
    }
    animate();

    // Responsive Resize Handler
    window.addEventListener('resize', () => {
      const newW = canvas3D.clientWidth;
      const newH = canvas3D.clientHeight;
      if (newW > 0 && newH > 0) {
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      }
    });
  }

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
