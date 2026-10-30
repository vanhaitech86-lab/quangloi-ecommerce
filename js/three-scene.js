/**
 * QUANG LỢI E-COMMERCE - THREE.JS 3D ENGINE
 * Interactive Hero Network Particle Scene & Product 3D Viewer
 */

// ===================================================================
// 1. HERO SECTION 3D PARTICLE NETWORK & FLOATING GEOMETRIC OBJECTS
// ===================================================================
function initHeroThreeScene() {
  const canvasContainer = document.getElementById('hero-three-canvas');
  if (!canvasContainer || typeof THREE === 'undefined') return;

  const width = canvasContainer.clientWidth || window.innerWidth;
  const height = canvasContainer.clientHeight || window.innerHeight;

  // Scene & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 1, 2000);
  camera.position.z = 700;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasContainer.appendChild(renderer.domElement);

  // Group for mouse parallax
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const pointLightCyan = new THREE.PointLight(0x00d4ff, 2, 1000);
  pointLightCyan.position.set(300, 200, 300);
  scene.add(pointLightCyan);

  const pointLightPurple = new THREE.PointLight(0x7b2fbe, 2, 1000);
  pointLightPurple.position.set(-300, -200, 300);
  scene.add(pointLightPurple);

  // ----------------------------------------------------
  // A. 200 PARTICLES & CONNECTING LINES
  // ----------------------------------------------------
  const particleCount = 180;
  const maxDistance = 140;
  const bounds = { x: 900, y: 600, z: 500 };

  const particlesData = [];
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const cyanColor = new THREE.Color(0x00d4ff);
  const purpleColor = new THREE.Color(0x7b2fbe);
  const pinkColor = new THREE.Color(0xec4899);

  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * bounds.x;
    const y = (Math.random() - 0.5) * bounds.y;
    const z = (Math.random() - 0.5) * bounds.z;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Velocity
    particlesData.push({
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.7,
        (Math.random() - 0.5) * 0.7,
        (Math.random() - 0.5) * 0.5
      ),
      numConnections: 0
    });

    // Color gradient
    const mixColor = i % 2 === 0 ? cyanColor : (i % 3 === 0 ? pinkColor : purpleColor);
    colors[i * 3] = mixColor.r;
    colors[i * 3 + 1] = mixColor.g;
    colors[i * 3 + 2] = mixColor.b;
  }

  // Particle Point Cloud
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Circular particle texture
  const particleCanvas = document.createElement('canvas');
  particleCanvas.width = 32;
  particleCanvas.height = 32;
  const pCtx = particleCanvas.getContext('2d');
  const gradient = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.3, 'rgba(0, 212, 255, 0.8)');
  gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
  pCtx.fillStyle = gradient;
  pCtx.fillRect(0, 0, 32, 32);
  const pTexture = new THREE.CanvasTexture(particleCanvas);

  const particleMaterial = new THREE.PointsMaterial({
    size: 9,
    vertexColors: true,
    map: pTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  mainGroup.add(particleSystem);

  // Dynamic Connecting Lines
  const linePositions = new Float32Array(particleCount * particleCount * 6);
  const lineColors = new Float32Array(particleCount * particleCount * 6);

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
  lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

  const lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
  mainGroup.add(lineMesh);

  // ----------------------------------------------------
  // B. 4 LARGE ROTATING 3D WIREFRAME OBJECTS
  // ----------------------------------------------------
  const wireframeObjects = [];

  // 1. Torus (Cyan Wireframe)
  const torusGeo = new THREE.TorusGeometry(75, 24, 16, 50);
  const torusMat = new THREE.MeshStandardMaterial({
    color: 0x00d4ff,
    wireframe: true,
    emissive: 0x00d4ff,
    emissiveIntensity: 0.35,
    roughness: 0.2
  });
  const torusMesh = new THREE.Mesh(torusGeo, torusMat);
  torusMesh.position.set(-360, 140, -120);
  mainGroup.add(torusMesh);
  wireframeObjects.push({ mesh: torusMesh, rx: 0.008, ry: 0.012, rz: 0.005 });

  // 2. Icosahedron (Purple Wireframe)
  const icoGeo = new THREE.IcosahedronGeometry(70, 1);
  const icoMat = new THREE.MeshStandardMaterial({
    color: 0xa855f7,
    wireframe: true,
    emissive: 0x7b2fbe,
    emissiveIntensity: 0.4,
    roughness: 0.2
  });
  const icoMesh = new THREE.Mesh(icoGeo, icoMat);
  icoMesh.position.set(380, 150, -150);
  mainGroup.add(icoMesh);
  wireframeObjects.push({ mesh: icoMesh, rx: 0.01, ry: 0.007, rz: 0.009 });

  // 3. Rounded Box / Cube (Cyan/Magenta Office Device Shape)
  const boxGeo = new THREE.BoxGeometry(90, 65, 80);
  const boxMat = new THREE.MeshStandardMaterial({
    color: 0x00f0a8,
    wireframe: true,
    emissive: 0x00f0a8,
    emissiveIntensity: 0.3,
    roughness: 0.3
  });
  const boxMesh = new THREE.Mesh(boxGeo, boxMat);
  boxMesh.position.set(340, -180, -90);
  mainGroup.add(boxMesh);
  wireframeObjects.push({ mesh: boxMesh, rx: 0.006, ry: 0.009, rz: 0.004 });

  // 4. Octahedron (Gold Accent Diamond)
  const octGeo = new THREE.OctahedronGeometry(65, 0);
  const octMat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    wireframe: true,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.35,
    roughness: 0.1
  });
  const octMesh = new THREE.Mesh(octGeo, octMat);
  octMesh.position.set(-330, -190, -130);
  mainGroup.add(octMesh);
  wireframeObjects.push({ mesh: octMesh, rx: 0.009, ry: 0.014, rz: 0.006 });

  // ----------------------------------------------------
  // C. MOUSE PARALLAX & REPULSION
  // ----------------------------------------------------
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;
  const mouse3D = new THREE.Vector3();

  function onMouseMove(event) {
    const rect = canvasContainer.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    mouseX = (x / width) * 2 - 1;
    mouseY = -(y / height) * 2 + 1;

    targetRotationY = mouseX * 0.25;
    targetRotationX = -mouseY * 0.25;

    // Projected mouse coordinates in 3D
    mouse3D.set(mouseX * 400, mouseY * 300, 0);
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // ----------------------------------------------------
  // D. ANIMATION LOOP
  // ----------------------------------------------------
  let animationFrameId;

  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    // Smooth camera / group parallax
    mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.05;
    mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.05;

    // Rotate 4 geometric objects
    wireframeObjects.forEach(obj => {
      obj.mesh.rotation.x += obj.rx;
      obj.mesh.rotation.y += obj.ry;
      obj.mesh.rotation.z += obj.rz;
    });

    // Update Particles positions
    let vertexPosIndex = 0;
    let colorPosIndex = 0;
    let lineCount = 0;

    for (let i = 0; i < particleCount; i++) {
      particlesData[i].numConnections = 0;
    }

    const posArray = particleGeometry.attributes.position.array;

    for (let i = 0; i < particleCount; i++) {
      const pData = particlesData[i];

      // Move particle
      posArray[i * 3] += pData.velocity.x;
      posArray[i * 3 + 1] += pData.velocity.y;
      posArray[i * 3 + 2] += pData.velocity.z;

      // Bounce at boundary
      if (posArray[i * 3] < -bounds.x / 2 || posArray[i * 3] > bounds.x / 2) pData.velocity.x = -pData.velocity.x;
      if (posArray[i * 3 + 1] < -bounds.y / 2 || posArray[i * 3 + 1] > bounds.y / 2) pData.velocity.y = -pData.velocity.y;
      if (posArray[i * 3 + 2] < -bounds.z / 2 || posArray[i * 3 + 2] > bounds.z / 2) pData.velocity.z = -pData.velocity.z;

      // Mouse repulsion
      const dxMouse = posArray[i * 3] - mouse3D.x;
      const dyMouse = posArray[i * 3 + 1] - mouse3D.y;
      const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
      if (distMouse < 160) {
        const force = (160 - distMouse) / 160;
        posArray[i * 3] += (dxMouse / distMouse) * force * 3;
        posArray[i * 3 + 1] += (dyMouse / distMouse) * force * 3;
      }

      // Check neighbor distances for connecting lines
      for (let j = i + 1; j < particleCount; j++) {
        const dx = posArray[i * 3] - posArray[j * 3];
        const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
        const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDistance) {
          pData.numConnections++;
          particlesData[j].numConnections++;

          const alpha = 1.0 - dist / maxDistance;

          linePositions[vertexPosIndex++] = posArray[i * 3];
          linePositions[vertexPosIndex++] = posArray[i * 3 + 1];
          linePositions[vertexPosIndex++] = posArray[i * 3 + 2];

          linePositions[vertexPosIndex++] = posArray[j * 3];
          linePositions[vertexPosIndex++] = posArray[j * 3 + 1];
          linePositions[vertexPosIndex++] = posArray[j * 3 + 2];

          lineColors[colorPosIndex++] = alpha * 0.0;
          lineColors[colorPosIndex++] = alpha * 0.83;
          lineColors[colorPosIndex++] = alpha * 1.0;

          lineColors[colorPosIndex++] = alpha * 0.48;
          lineColors[colorPosIndex++] = alpha * 0.18;
          lineColors[colorPosIndex++] = alpha * 0.75;

          lineCount++;
        }
      }
    }

    particleGeometry.attributes.position.needsUpdate = true;
    lineGeometry.setDrawRange(0, lineCount * 2);
    lineGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.color.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();

  // Resize Listener
  function onWindowResize() {
    const newWidth = canvasContainer.clientWidth || window.innerWidth;
    const newHeight = canvasContainer.clientHeight || window.innerHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  }

  window.addEventListener('resize', onWindowResize);
}

// ===================================================================
// 2. PRODUCT DETAIL PAGE - INTERACTIVE 3D PRINTER MODEL VIEWER
// ===================================================================
let productViewerInstance = null;

function initProductDetail3DViewer(containerId = 'three-viewer-container') {
  const container = document.getElementById(containerId);
  if (!container || typeof THREE === 'undefined') return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0e27);

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(4.5, 3.2, 5.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.innerHTML = ''; // clear any placeholder
  container.appendChild(renderer.domElement);

  // Group for entire Printer Model
  const printerGroup = new THREE.Group();
  scene.add(printerGroup);

  // Lighting
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x111638, 1.2);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
  keyLight.position.set(6, 8, 7);
  keyLight.castShadow = true;
  scene.add(keyLight);

  const cyanRimLight = new THREE.PointLight(0x00d4ff, 3, 15);
  cyanRimLight.position.set(-5, 3, -3);
  scene.add(cyanRimLight);

  const purpleRimLight = new THREE.PointLight(0x7b2fbe, 3, 15);
  purpleRimLight.position.set(5, -2, -3);
  scene.add(purpleRimLight);

  // Pedestal / Circular Grid Base
  const gridHelper = new THREE.GridHelper(10, 20, 0x00d4ff, 0x1e293b);
  gridHelper.position.y = -1.2;
  scene.add(gridHelper);

  const baseGeo = new THREE.CylinderGeometry(3.5, 3.6, 0.2, 48);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x0f1642,
    roughness: 0.4,
    metalness: 0.6
  });
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.y = -1.3;
  baseMesh.receiveShadow = true;
  scene.add(baseMesh);

  // ----------------------------------------------------
  // PROCEDURAL DETAILED 3D PRINTER GEOMETRY
  // ----------------------------------------------------
  let printerBodyMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b, // Default Matte Dark Slate
    roughness: 0.35,
    metalness: 0.25
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: 0x00d4ff,
    roughness: 0.2,
    metalness: 0.8,
    emissive: 0x00d4ff,
    emissiveIntensity: 0.2
  });

  const blackGlossMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a,
    roughness: 0.15,
    metalness: 0.5
  });

  const glassBedMat = new THREE.MeshPhysicalMaterial({
    color: 0xdff9fb,
    transmission: 0.7,
    opacity: 0.85,
    transparent: true,
    roughness: 0.1,
    ior: 1.5
  });

  // 1. Main Base Body
  const mainChassisGeo = new THREE.BoxGeometry(3.6, 1.4, 2.6);
  const mainChassis = new THREE.Mesh(mainChassisGeo, printerBodyMat);
  mainChassis.position.y = -0.2;
  mainChassis.castShadow = true;
  mainChassis.receiveShadow = true;
  printerGroup.add(mainChassis);

  // 2. Paper Output Tray (front extension)
  const trayGeo = new THREE.BoxGeometry(2.4, 0.15, 1.4);
  const trayMesh = new THREE.Mesh(trayGeo, blackGlossMat);
  trayMesh.position.set(0, -0.65, 1.4);
  trayMesh.castShadow = true;
  printerGroup.add(trayMesh);

  // Printed Sheets on Tray
  const paperGeo = new THREE.BoxGeometry(2.0, 0.04, 1.1);
  const paperMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
  const paperMesh = new THREE.Mesh(paperGeo, paperMat);
  paperMesh.position.set(0, -0.56, 1.35);
  printerGroup.add(paperMesh);

  // 3. Scanner Lid / Top Unit
  const scannerGeo = new THREE.BoxGeometry(3.6, 0.4, 2.6);
  const scannerMesh = new THREE.Mesh(scannerGeo, blackGlossMat);
  scannerMesh.position.y = 0.65;
  scannerMesh.castShadow = true;
  printerGroup.add(scannerMesh);

  // Automatic Document Feeder (ADF) on top
  const adfGeo = new THREE.BoxGeometry(2.6, 0.4, 1.6);
  const adfMesh = new THREE.Mesh(adfGeo, printerBodyMat);
  adfMesh.position.set(0, 1.0, -0.2);
  adfMesh.castShadow = true;
  printerGroup.add(adfMesh);

  // 4. Touchscreen LCD Control Panel
  const panelGeo = new THREE.BoxGeometry(0.8, 0.6, 0.1);
  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x00d4ff,
    emissive: 0x007799,
    emissiveIntensity: 0.9,
    roughness: 0.2
  });
  const panelMesh = new THREE.Mesh(panelGeo, screenMat);
  panelMesh.position.set(-1.1, 0.7, 1.32);
  panelMesh.rotation.x = -0.25;
  printerGroup.add(panelMesh);

  // 5. CISS Continuous Ink Tank System (Clear Windows with Cyan, Magenta, Yellow, Black)
  const cissHousingGeo = new THREE.BoxGeometry(0.8, 0.9, 0.4);
  const cissHousing = new THREE.Mesh(cissHousingGeo, blackGlossMat);
  cissHousing.position.set(1.4, -0.25, 1.25);
  printerGroup.add(cissHousing);

  const inkColors = [0x00d4ff, 0xec4899, 0xffd700, 0x111827];
  inkColors.forEach((col, idx) => {
    const tankGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.6, 16);
    const tankMat = new THREE.MeshStandardMaterial({
      color: col,
      emissive: col,
      emissiveIntensity: 0.4,
      roughness: 0.3
    });
    const tank = new THREE.Mesh(tankGeo, tankMat);
    tank.position.set(1.15 + idx * 0.16, -0.25, 1.4);
    printerGroup.add(tank);
  });

  // 6. Glowing Status Ring / Power Button
  const ledGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 20);
  const ledMat = new THREE.MeshBasicMaterial({ color: 0x00f0a8 });
  const ledMesh = new THREE.Mesh(ledGeo, ledMat);
  ledMesh.rotation.x = Math.PI / 2;
  ledMesh.position.set(-1.5, 0.35, 1.31);
  printerGroup.add(ledMesh);

  // Branding Label Texture
  const brandCanvas = document.createElement('canvas');
  brandCanvas.width = 512;
  brandCanvas.height = 128;
  const bCtx = brandCanvas.getContext('2d');
  bCtx.fillStyle = '#1e293b';
  bCtx.fillRect(0, 0, 512, 128);
  bCtx.fillStyle = '#00d4ff';
  bCtx.font = 'bold 36px sans-serif';
  bCtx.fillText('QUANG LỢI • PIXMA G3010', 30, 75);
  const brandTexture = new THREE.CanvasTexture(brandCanvas);
  const brandLabelGeo = new THREE.PlaneGeometry(1.6, 0.4);
  const brandLabelMat = new THREE.MeshBasicMaterial({ map: brandTexture });
  const brandLabelMesh = new THREE.Mesh(brandLabelGeo, brandLabelMat);
  brandLabelMesh.position.set(0, 0.1, 1.31);
  printerGroup.add(brandLabelMesh);

  // ----------------------------------------------------
  // INTERACTIVE CONTROLS (DRAG TO ROTATE, ZOOM, AUTO-ROTATE)
  // ----------------------------------------------------
  let isDragging = false;
  let previousMouseX = 0;
  let previousMouseY = 0;
  let autoRotate = true;
  let isWireframe = false;

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMouseX = e.clientX;
    previousMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousMouseX;
    const deltaY = e.clientY - previousMouseY;

    printerGroup.rotation.y += deltaX * 0.008;
    printerGroup.rotation.x += deltaY * 0.008;

    // Clamp X rotation to avoid flipping
    printerGroup.rotation.x = Math.max(-0.6, Math.min(0.6, printerGroup.rotation.x));

    previousMouseX = e.clientX;
    previousMouseY = e.clientY;
  });

  // Touch Support
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      previousMouseX = e.touches[0].clientX;
      previousMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMouseX;
    const deltaY = e.touches[0].clientY - previousMouseY;

    printerGroup.rotation.y += deltaX * 0.01;
    printerGroup.rotation.x += deltaY * 0.01;

    previousMouseX = e.touches[0].clientX;
    previousMouseY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Zoom with scroll wheel
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    camera.position.z += e.deltaY * 0.005;
    camera.position.z = Math.max(3.5, Math.min(9.5, camera.position.z));
  }, { passive: false });

  // Render loop
  function renderDetail() {
    requestAnimationFrame(renderDetail);

    if (autoRotate && !isDragging) {
      printerGroup.rotation.y += 0.005;
    }

    renderer.render(scene, camera);
  }
  renderDetail();

  // Public Viewer API
  productViewerInstance = {
    setPrinterColor: (hexColor) => {
      printerBodyMat.color.setHex(hexColor);
      adfMesh.material.color.setHex(hexColor);
    },
    toggleWireframe: () => {
      isWireframe = !isWireframe;
      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.wireframe = isWireframe);
          } else {
            child.material.wireframe = isWireframe;
          }
        }
      });
      return isWireframe;
    },
    toggleAutoRotate: () => {
      autoRotate = !autoRotate;
      return autoRotate;
    },
    resetView: () => {
      printerGroup.rotation.set(0, 0, 0);
      camera.position.set(4.5, 3.2, 5.5);
      camera.lookAt(0, 0, 0);
    }
  };

  // Resize handler
  window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  return productViewerInstance;
}
