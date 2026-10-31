/**
 * QUANG LỢI E-COMMERCE - THREE.JS 3D ENGINE
 * Interactive Hero Network Particle Scene & Product 3D Viewer
 * Theme: Professional B2B Corporate Blue & Crisp White
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

  // Renderer (Alpha true for seamless blending with hero background)
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasContainer.innerHTML = '';
  canvasContainer.appendChild(renderer.domElement);

  // Group for mouse parallax
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);

  const pointLightPrimary = new THREE.PointLight(0x1565c0, 2.2, 1200);
  pointLightPrimary.position.set(300, 250, 300);
  scene.add(pointLightPrimary);

  const pointLightSecondary = new THREE.PointLight(0x1976d2, 1.8, 1200);
  pointLightSecondary.position.set(-300, -200, 300);
  scene.add(pointLightSecondary);

  // ----------------------------------------------------
  // A. 180 PARTICLES & CONNECTING LINES IN BLUE TONES
  // ----------------------------------------------------
  const particleCount = 180;
  const maxDistance = 145;
  const bounds = { x: 950, y: 620, z: 500 };

  const particlesData = [];
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const bluePrimary = new THREE.Color(0x1565c0);
  const blueLight = new THREE.Color(0x42a5f5);
  const blueNavy = new THREE.Color(0x0d47a1);
  const accentRed = new THREE.Color(0xd32f2f);

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
        (Math.random() - 0.5) * 0.65,
        (Math.random() - 0.5) * 0.65,
        (Math.random() - 0.5) * 0.45
      ),
      numConnections: 0
    });

    // Color gradient
    const mixColor = i % 5 === 0 ? accentRed : (i % 2 === 0 ? bluePrimary : (i % 3 === 0 ? blueLight : blueNavy));
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
  gradient.addColorStop(0, 'rgba(21, 101, 192, 1)');
  gradient.addColorStop(0.35, 'rgba(66, 165, 245, 0.7)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  pCtx.fillStyle = gradient;
  pCtx.fillRect(0, 0, 32, 32);
  const pTexture = new THREE.CanvasTexture(particleCanvas);

  const particleMaterial = new THREE.PointsMaterial({
    size: 10,
    vertexColors: true,
    map: pTexture,
    transparent: true,
    opacity: 0.85,
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
    opacity: 0.55,
    depthWrite: false
  });

  const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
  mainGroup.add(lineMesh);

  // ----------------------------------------------------
  // B. 4 LARGE ROTATING 3D WIREFRAME OBJECTS
  // ----------------------------------------------------
  const wireframeObjects = [];

  // 1. Torus (Primary Blue Wireframe)
  const torusGeo = new THREE.TorusGeometry(75, 22, 16, 48);
  const torusMat = new THREE.MeshStandardMaterial({
    color: 0x1565c0,
    wireframe: true,
    roughness: 0.3
  });
  const torusMesh = new THREE.Mesh(torusGeo, torusMat);
  torusMesh.position.set(-360, 140, -120);
  mainGroup.add(torusMesh);
  wireframeObjects.push({ mesh: torusMesh, rx: 0.007, ry: 0.01, rz: 0.004 });

  // 2. Icosahedron (Navy Wireframe)
  const icoGeo = new THREE.IcosahedronGeometry(68, 1);
  const icoMat = new THREE.MeshStandardMaterial({
    color: 0x0d47a1,
    wireframe: true,
    roughness: 0.3
  });
  const icoMesh = new THREE.Mesh(icoGeo, icoMat);
  icoMesh.position.set(380, 150, -150);
  mainGroup.add(icoMesh);
  wireframeObjects.push({ mesh: icoMesh, rx: 0.008, ry: 0.006, rz: 0.008 });

  // 3. Rounded Box / Office Copier Shape (Light Blue Wireframe)
  const boxGeo = new THREE.BoxGeometry(90, 65, 80);
  const boxMat = new THREE.MeshStandardMaterial({
    color: 0x1976d2,
    wireframe: true,
    roughness: 0.3
  });
  const boxMesh = new THREE.Mesh(boxGeo, boxMat);
  boxMesh.position.set(340, -180, -90);
  mainGroup.add(boxMesh);
  wireframeObjects.push({ mesh: boxMesh, rx: 0.005, ry: 0.008, rz: 0.003 });

  // 4. Octahedron (Accent Red Diamond)
  const octGeo = new THREE.OctahedronGeometry(65, 0);
  const octMat = new THREE.MeshStandardMaterial({
    color: 0xd32f2f,
    wireframe: true,
    roughness: 0.2
  });
  const octMesh = new THREE.Mesh(octGeo, octMat);
  octMesh.position.set(-330, -190, -130);
  mainGroup.add(octMesh);
  wireframeObjects.push({ mesh: octMesh, rx: 0.008, ry: 0.012, rz: 0.005 });

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

    targetRotationY = mouseX * 0.2;
    targetRotationX = -mouseY * 0.2;

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

    // Rotate geometric objects
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
      if (distMouse < 150) {
        const force = (150 - distMouse) / 150;
        posArray[i * 3] += (dxMouse / distMouse) * force * 2.5;
        posArray[i * 3 + 1] += (dyMouse / distMouse) * force * 2.5;
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

          const alpha = (1.0 - dist / maxDistance) * 0.7;

          linePositions[vertexPosIndex++] = posArray[i * 3];
          linePositions[vertexPosIndex++] = posArray[i * 3 + 1];
          linePositions[vertexPosIndex++] = posArray[i * 3 + 2];

          linePositions[vertexPosIndex++] = posArray[j * 3];
          linePositions[vertexPosIndex++] = posArray[j * 3 + 1];
          linePositions[vertexPosIndex++] = posArray[j * 3 + 2];

          // Corporate Blue line colors
          lineColors[colorPosIndex++] = 0.08 * alpha;
          lineColors[colorPosIndex++] = 0.40 * alpha;
          lineColors[colorPosIndex++] = 0.75 * alpha;

          lineColors[colorPosIndex++] = 0.10 * alpha;
          lineColors[colorPosIndex++] = 0.46 * alpha;
          lineColors[colorPosIndex++] = 0.82 * alpha;

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
  scene.background = new THREE.Color(0xF5F7FA);

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(4.5, 3.2, 5.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // Group for entire Printer Model
  const printerGroup = new THREE.Group();
  scene.add(printerGroup);

  // Lighting
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xdde7f2, 1.4);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
  keyLight.position.set(6, 8, 7);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  scene.add(keyLight);

  const blueLight = new THREE.PointLight(0x1565c0, 2.5, 15);
  blueLight.position.set(-5, 4, 3);
  scene.add(blueLight);

  const softFillLight = new THREE.PointLight(0x90caf9, 1.5, 15);
  softFillLight.position.set(5, -2, -3);
  scene.add(softFillLight);

  // Pedestal / Circular Grid Base
  const gridHelper = new THREE.GridHelper(10, 20, 0x1565c0, 0xcfd8dc);
  gridHelper.position.y = -1.2;
  scene.add(gridHelper);

  const baseGeo = new THREE.CylinderGeometry(3.5, 3.6, 0.2, 48);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
    metalness: 0.1
  });
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.y = -1.3;
  baseMesh.receiveShadow = true;
  scene.add(baseMesh);

  // ----------------------------------------------------
  // PROCEDURAL DETAILED 3D PRINTER / COPIER GEOMETRY
  // ----------------------------------------------------
  let printerBodyMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc, // Clean Corporate White/Off-white
    roughness: 0.3,
    metalness: 0.1
  });

  const darkAccentMat = new THREE.MeshStandardMaterial({
    color: 0x212121,
    roughness: 0.35,
    metalness: 0.2
  });

  const blueBrandMat = new THREE.MeshStandardMaterial({
    color: 0x1565c0,
    roughness: 0.25,
    metalness: 0.4
  });

  // 1. Main Base Body
  const mainChassisGeo = new THREE.BoxGeometry(3.6, 1.4, 2.6);
  const mainChassis = new THREE.Mesh(mainChassisGeo, printerBodyMat);
  mainChassis.position.y = -0.2;
  mainChassis.castShadow = true;
  mainChassis.receiveShadow = true;
  printerGroup.add(mainChassis);

  // 2. Paper Output Tray
  const trayGeo = new THREE.BoxGeometry(2.4, 0.15, 1.4);
  const trayMesh = new THREE.Mesh(trayGeo, darkAccentMat);
  trayMesh.position.set(0, -0.65, 1.4);
  trayMesh.castShadow = true;
  printerGroup.add(trayMesh);

  // Printed Sheets on Tray
  const paperGeo = new THREE.BoxGeometry(2.0, 0.04, 1.1);
  const paperMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
  const paperMesh = new THREE.Mesh(paperGeo, paperMat);
  paperMesh.position.set(0, -0.56, 1.35);
  printerGroup.add(paperMesh);

  // 3. Scanner Lid / Top Unit
  const scannerGeo = new THREE.BoxGeometry(3.6, 0.4, 2.6);
  const scannerMesh = new THREE.Mesh(scannerGeo, darkAccentMat);
  scannerMesh.position.y = 0.65;
  scannerMesh.castShadow = true;
  printerGroup.add(scannerMesh);

  // Automatic Document Feeder (ADF) on top
  const adfGeo = new THREE.BoxGeometry(2.6, 0.45, 1.6);
  const adfMesh = new THREE.Mesh(adfGeo, printerBodyMat);
  adfMesh.position.set(0, 1.05, -0.2);
  adfMesh.castShadow = true;
  printerGroup.add(adfMesh);

  // 4. Touchscreen LCD Control Panel
  const panelGeo = new THREE.BoxGeometry(0.85, 0.6, 0.1);
  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x1565c0,
    emissive: 0x0d47a1,
    emissiveIntensity: 0.5,
    roughness: 0.2
  });
  const panelMesh = new THREE.Mesh(panelGeo, screenMat);
  panelMesh.position.set(-1.1, 0.72, 1.32);
  panelMesh.rotation.x = -0.25;
  printerGroup.add(panelMesh);

  // 5. Status Power LED
  const ledGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 20);
  const ledMat = new THREE.MeshBasicMaterial({ color: 0x2e7d32 }); // Green LED
  const ledMesh = new THREE.Mesh(ledGeo, ledMat);
  ledMesh.rotation.x = Math.PI / 2;
  ledMesh.position.set(-1.5, 0.35, 1.31);
  printerGroup.add(ledMesh);

  // 6. Branding Label
  const brandCanvas = document.createElement('canvas');
  brandCanvas.width = 512;
  brandCanvas.height = 128;
  const bCtx = brandCanvas.getContext('2d');
  bCtx.fillStyle = '#FFFFFF';
  bCtx.fillRect(0, 0, 512, 128);
  bCtx.fillStyle = '#1565C0';
  bCtx.font = 'bold 40px sans-serif';
  bCtx.fillText('QUẢNG LỢI • CANON / RICOH', 20, 80);
  const brandTexture = new THREE.CanvasTexture(brandCanvas);
  const brandLabelGeo = new THREE.PlaneGeometry(1.6, 0.4);
  const brandLabelMat = new THREE.MeshBasicMaterial({ map: brandTexture });
  const brandLabelMesh = new THREE.Mesh(brandLabelGeo, brandLabelMat);
  brandLabelMesh.position.set(0, 0.1, 1.31);
  printerGroup.add(brandLabelMesh);

  // ----------------------------------------------------
  // INTERACTIVE CONTROLS
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
    printerGroup.rotation.x = Math.max(-0.6, Math.min(0.6, printerGroup.rotation.x));

    previousMouseX = e.clientX;
    previousMouseY = e.clientY;
  });

  // Zoom
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

  window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  return productViewerInstance;
}
