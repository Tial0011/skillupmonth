import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { skills as programmeItems } from "../data/skills.js";

const skills = programmeItems.filter(skill => skill.type !== "event");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function makeMetal(color, roughness = 0.22, metalness = 0.78) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function addMesh(parent, geometry, material, position, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  parent.add(mesh);
  return mesh;
}

function createSkillBadge(parent, kind, position, materials, mobileQuality) {
  const badge = new THREE.Group();
  badge.position.set(...position);
  badge.userData.floatOffset = position[0] * 1.8 + position[1];
  parent.add(badge);

  const shell = addMesh(
    badge,
    new THREE.SphereGeometry(0.28, mobileQuality ? 12 : 20, mobileQuality ? 8 : 14),
    materials.silver,
    [0, 0, 0]
  );
  shell.scale.set(1, 0.84, 0.42);
  addMesh(
    badge,
    new THREE.TorusGeometry(0.27, 0.012, 6, mobileQuality ? 32 : 56),
    materials.blue,
    [0, 0, 0.035]
  );

  const mark = materials.white;
  const addBar = (x, y, width, height, rotation = 0) => {
    const bar = addMesh(
      badge,
      new RoundedBoxGeometry(width, height, 0.035, 2, 0.012),
      mark,
      [x, y, 0.12],
      [0, 0, rotation]
    );
    return bar;
  };

  if (kind === "creative") {
    const dotGeometry = new THREE.SphereGeometry(0.035, mobileQuality ? 6 : 10, mobileQuality ? 5 : 8);
    [[-0.09, 0.06], [0, 0.1], [0.09, 0.06], [-0.07, -0.04], [0.07, -0.04]].forEach(([x, y], index) => {
      addMesh(badge, dotGeometry, index % 2 ? materials.white : materials.blue, [x, y, 0.13]);
    });
  } else if (kind === "digital") {
    addBar(-0.09, 0, 0.15, 0.025, Math.PI / 4);
    addBar(-0.09, 0, 0.15, 0.025, -Math.PI / 4);
    addBar(0.09, 0, 0.15, 0.025, Math.PI / 4);
    addBar(0.09, 0, 0.15, 0.025, -Math.PI / 4);
    addBar(0, 0, 0.21, 0.022, -0.45);
  } else if (kind === "communication") {
    addBar(0, 0.075, 0.22, 0.024);
    addBar(0, -0.045, 0.22, 0.024);
    addBar(-0.1, 0.015, 0.12, 0.024, Math.PI / 2);
    addBar(0.1, 0.015, 0.12, 0.024, Math.PI / 2);
    addBar(-0.055, -0.095, 0.09, 0.024, -Math.PI / 4);
    [-0.06, 0, 0.06].forEach(x => {
      addMesh(badge, new THREE.SphereGeometry(0.018, 6, 6), materials.blue, [x, 0.015, 0.145]);
    });
  } else {
    addBar(0, 0, 0.19, 0.045);
    addBar(0, 0, 0.19, 0.045, Math.PI / 2);
  }

  badge.name = `skill-${kind}-emblem`;
  return badge;
}

function createSkillLabels(parent) {
  const columns = 4;
  const cellWidth = 256;
  const cellHeight = 64;
  const rows = Math.ceil(skills.length / columns);
  const canvas = document.createElement("canvas");
  canvas.width = columns * cellWidth;
  canvas.height = rows * cellHeight;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create the hero skill label texture.");

  const atlas = new THREE.CanvasTexture(canvas);
  atlas.colorSpace = THREE.SRGBColorSpace;
  const labelMaterial = new THREE.MeshBasicMaterial({
    map: atlas,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const labels = [];
  skills.forEach((skill, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const centerX = column * cellWidth + cellWidth / 2;
    const centerY = row * cellHeight + cellHeight / 2;
    context.font = "600 21px Arial, sans-serif";
    let fontSize = 21;
    while (context.measureText(skill.name).width > cellWidth - 28 && fontSize > 12) {
      fontSize -= 1;
      context.font = `600 ${fontSize}px Arial, sans-serif`;
    }

    const pillWidth = Math.min(cellWidth - 16, context.measureText(skill.name).width + 32);
    const pillX = centerX - pillWidth / 2;
    context.fillStyle = "rgba(248, 250, 255, 0.9)";
    context.strokeStyle = "rgba(125, 153, 205, 0.58)";
    context.lineWidth = 1.5;
    context.beginPath();
    context.roundRect(pillX, row * cellHeight + 8, pillWidth, cellHeight - 16, 20);
    context.fill();
    context.stroke();
    context.fillStyle = "#304363";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = `600 ${fontSize}px Arial, sans-serif`;
    context.fillText(skill.name, centerX, centerY, cellWidth - 24);

    const geometry = new THREE.PlaneGeometry(pillWidth / cellWidth * 0.82, 0.2);
    const u0 = pillX / canvas.width;
    const u1 = (pillX + pillWidth) / canvas.width;
    const v1 = 1 - row / rows;
    const v0 = 1 - (row + 1) / rows;
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute([
      u0, v1, u1, v1, u0, v0, u1, v0
    ], 2));
    const angle = index * Math.PI * (3 - Math.sqrt(5));
    const vertical = 1 - ((index + 0.5) / skills.length) * 2;
    const horizontal = Math.sqrt(1 - vertical * vertical);
    const normal = new THREE.Vector3(
      Math.cos(angle) * horizontal,
      vertical,
      Math.sin(angle) * horizontal
    );
    const label = new THREE.Mesh(geometry, labelMaterial);
    label.position.copy(normal).multiplyScalar(1.82);
    label.userData.normal = normal;
    label.name = `skill-label-${skill.id}`;
    parent.add(label);
    labels.push(label);
  });

  return { labels, atlas, labelMaterial };
}

function createSculpture(scene, mobileQuality) {
  const root = new THREE.Group();
  scene.add(root);

  const silver = makeMetal("#dce4ef", 0.2, 0.86);
  const paleBlue = makeMetal("#8daff4", 0.2, 0.72);
  const darkSilver = makeMetal("#8392aa", 0.28, 0.78);
  const accent = mobileQuality
    ? new THREE.MeshStandardMaterial({ color: "#b9d0ff", metalness: 0.12, roughness: 0.24, transparent: true, opacity: 0.78 })
    : new THREE.MeshPhysicalMaterial({
      color: "#b9d0ff",
      metalness: 0.08,
      roughness: 0.08,
      transmission: 0.88,
      thickness: 1.25,
      ior: 1.28,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      attenuationColor: new THREE.Color("#7398ed"),
      attenuationDistance: 2.4
    });

  const core = addMesh(root, new THREE.IcosahedronGeometry(0.68, mobileQuality ? 1 : 2), accent, [-0.12, 0.28, 0.18], [0.2, 0.1, -0.14]);
  core.name = "transformation-crystal";
  core.userData.baseX = core.rotation.x;
  core.userData.baseY = core.rotation.y;

  const innerCore = addMesh(
    root,
    new THREE.OctahedronGeometry(0.32, 0),
    new THREE.MeshStandardMaterial({ color: "#f8fbff", emissive: "#4778e8", emissiveIntensity: 0.46, metalness: 0.16, roughness: 0.16 }),
    [-0.12, 0.28, 0.2],
    [0.28, 0.2, 0.1]
  );
  innerCore.name = "inner-light";

  const emblemMaterials = { silver, blue: paleBlue, white: innerCore.material };
  const badgePositions = [
    { kind: "creative", position: [-1.27, 1.03, 0.12] },
    { kind: "digital", position: [1.2, 0.92, 0.18] },
    { kind: "communication", position: [-1.4, -0.52, 0.38] },
    { kind: "care", position: [1.38, -0.48, 0.3] }
  ];
  const skillBadges = badgePositions.map(({ kind, position }) =>
    createSkillBadge(root, kind, position, emblemMaterials, mobileQuality)
  );
  const { labels: skillLabels, atlas: skillLabelAtlas, labelMaterial: skillLabelMaterial } = createSkillLabels(root);
  const connectionMaterial = new THREE.MeshBasicMaterial({ color: "#87aaf4", transparent: true, opacity: 0.52 });
  const corePosition = new THREE.Vector3(-0.12, 0.28, 0.18);
  badgePositions.forEach(({ position }, index) => {
    const end = new THREE.Vector3(...position).lerp(corePosition, 0.25);
    const start = corePosition.clone().lerp(end, 0.48);
    const control = start.clone().lerp(end, 0.5);
    control.z += index % 2 ? -0.2 : 0.2;
    const path = new THREE.CatmullRomCurve3([start, control, end]);
    addMesh(
      root,
      new THREE.TubeGeometry(path, mobileQuality ? 12 : 20, 0.008, 4, false),
      connectionMaterial,
      [0, 0, 0]
    );
  });

  const rings = [];
  [
    { radius: 1.13, tube: 0.022, rotation: [0.9, 0.22, -0.3], material: silver },
    { radius: 1.45, tube: 0.014, rotation: [0.08, 1.02, 0.52], material: paleBlue },
    { radius: 0.91, tube: 0.012, rotation: [1.32, -0.12, 0.75], material: darkSilver }
  ].forEach(({ radius, tube, rotation, material }, index) => {
    const ring = addMesh(root, new THREE.TorusGeometry(radius, tube, 8, mobileQuality ? 64 : 128), material, [-0.12, 0.28, 0], rotation);
    ring.userData.spin = index % 2 ? -1 : 1;
    ring.userData.baseX = rotation[0];
    ring.userData.baseZ = rotation[2];
    rings.push(ring);
  });

  const ribbonPoints = [
    new THREE.Vector3(-1.64, -1.15, -0.18),
    new THREE.Vector3(-1.12, -0.72, 0.05),
    new THREE.Vector3(-0.88, -0.12, 0.33),
    new THREE.Vector3(-0.35, 0.26, 0.48),
    new THREE.Vector3(0.36, 0.25, 0.36),
    new THREE.Vector3(0.82, 0.67, 0.12),
    new THREE.Vector3(1.02, 1.42, -0.16),
    new THREE.Vector3(1.64, 1.68, -0.4)
  ];
  const ribbonCurve = new THREE.CatmullRomCurve3(ribbonPoints);
  const ribbon = addMesh(
    root,
    new THREE.TubeGeometry(ribbonCurve, mobileQuality ? 84 : 180, 0.046, mobileQuality ? 6 : 10, false),
    mobileQuality
      ? new THREE.MeshStandardMaterial({ color: "#a9c5ff", metalness: 0.5, roughness: 0.28 })
      : new THREE.MeshPhysicalMaterial({ color: "#a9c5ff", metalness: 0.62, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.16 }),
    [0, 0, 0]
  );
  ribbon.name = "ascending-ribbon";

  const steps = new THREE.Group();
  steps.position.set(0.04, -0.13, -0.34);
  root.add(steps);
  const stepHeights = [0.26, 0.38, 0.51, 0.65, 0.82];
  stepHeights.forEach((height, index) => {
    const width = 0.43;
    const block = addMesh(
      steps,
      new RoundedBoxGeometry(width, height, 0.28, 3, 0.045),
      index === stepHeights.length - 1 ? paleBlue : silver,
      [-1.17 + index * 0.53, -1.2 + index * 0.22 + height / 2, 0]
    );
    block.name = `growth-step-${index + 1}`;
  });

  const particleCount = mobileQuality ? 38 : 220;
  const particlePositions = new Float32Array(particleCount * 3);
  let seed = 1931;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  for (let index = 0; index < particleCount; index += 1) {
    particlePositions[index * 3] = (random() - 0.5) * 5.2;
    particlePositions[index * 3 + 1] = (random() - 0.5) * 4.6;
    particlePositions[index * 3 + 2] = (random() - 0.5) * 2.8;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({ color: "#6f91d5", size: 0.022, sizeAttenuation: true, transparent: true, opacity: 0.48, depthWrite: false })
  );
  root.add(particles);

  const plinth = addMesh(
    root,
    new THREE.TorusGeometry(1.62, 0.012, 6, mobileQuality ? 72 : 160),
    silver,
    [-0.05, -1.13, -0.3],
    [Math.PI / 2.18, 0, 0]
  );
  plinth.name = "foundation-orbit";

  const materials = [silver, paleBlue, darkSilver, accent, innerCore.material, ribbon.material, particles.material, connectionMaterial, skillLabelMaterial];
  return { root, core, innerCore, rings, ribbon, steps, skillBadges, skillLabels, skillLabelAtlas, particles, plinth, materials };
}

function createSkillGlobe(scene, mobileQuality) {
  const root = new THREE.Group();
  scene.add(root);
  const globeRadius = 1.05;
  const mapRadius = globeRadius + 0.05;
  const colors = ["#315c9f", "#5476b1", "#7894bf", "#264f91", "#91a7ca", "#486da7", "#a0b4d2"];
  const categoryGroups = [...new Set(skills.map(skill => skill.category))].map(category => ({
    category,
    entries: skills.filter(skill => skill.category === category)
  }));
  const columns = 4;
  const cellWidth = 384;
  const cellHeight = 96;
  const rows = Math.ceil(skills.length / columns);
  const canvas = document.createElement("canvas");
  canvas.width = columns * cellWidth;
  canvas.height = rows * cellHeight;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create the skill globe labels.");
  const atlas = new THREE.CanvasTexture(canvas);
  atlas.colorSpace = THREE.SRGBColorSpace;
  const labelMaterial = new THREE.MeshBasicMaterial({
    map: atlas,
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    side: THREE.DoubleSide
  });
  const regionMaterials = colors.map(color => new THREE.MeshBasicMaterial({
    color,
    side: THREE.DoubleSide
  }));
  const outlineMaterial = new THREE.LineBasicMaterial({ color: "#eef4ff", transparent: true, opacity: 0.78 });
  const labels = [];

  skills.forEach((skill, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const categoryIndex = categoryGroups.findIndex(group => group.category === skill.category);
    const vertical = 1 - ((index + 0.5) / skills.length) * 2;
    const angle = index * Math.PI * (3 - Math.sqrt(5));
    const horizontal = Math.sqrt(1 - vertical * vertical);
    const center = new THREE.Vector3(
      Math.cos(angle) * horizontal,
      vertical,
      Math.sin(angle) * horizontal
    );
    const tangentX = new THREE.Vector3().crossVectors(center, new THREE.Vector3(0, 1, 0)).normalize();
    if (tangentX.lengthSq() < 0.01) tangentX.set(1, 0, 0);
    const tangentY = new THREE.Vector3().crossVectors(center, tangentX).normalize();

    const maxTextWidth = cellWidth - 36;
    let fontSize = 34;
    context.font = `600 ${fontSize}px Arial, sans-serif`;
    while (context.measureText(skill.name).width > maxTextWidth && fontSize > 18) {
      fontSize -= 1;
      context.font = `600 ${fontSize}px Arial, sans-serif`;
    }
    const pillWidth = Math.min(maxTextWidth, context.measureText(skill.name).width + 22);
    const originX = column * cellWidth;
    const originY = row * cellHeight;
    const pillX = originX + (cellWidth - pillWidth) / 2;
    context.fillStyle = "rgba(248, 250, 255, 0.96)";
    context.strokeStyle = colors[categoryIndex % colors.length];
    context.lineWidth = 3;
    context.beginPath();
    context.roundRect(pillX, originY + 8, pillWidth, 80, 24);
    context.fill();
    context.stroke();
    context.fillStyle = "#263a5c";
    context.font = `600 ${fontSize}px Arial, sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(skill.name, originX + cellWidth / 2, originY + cellHeight / 2, maxTextWidth);

    const vertices = [center.clone().multiplyScalar(mapRadius)];
    for (let edge = 0; edge < 6; edge += 1) {
      const angle = edge * Math.PI / 3;
      vertices.push(center.clone()
        .addScaledVector(tangentX, Math.cos(angle) * 0.25)
        .addScaledVector(tangentY, Math.sin(angle) * 0.25)
        .normalize()
        .multiplyScalar(mapRadius));
    }
    const patchGeometry = new THREE.BufferGeometry();
    patchGeometry.setAttribute("position", new THREE.Float32BufferAttribute(
      vertices.flatMap(vertex => vertex.toArray()), 3
    ));
    patchGeometry.setIndex([0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5, 0, 5, 6, 0, 6, 1]);
    patchGeometry.computeVertexNormals();
    const patch = new THREE.Mesh(patchGeometry, regionMaterials[categoryIndex % regionMaterials.length]);
    patch.name = `skill-map-${skill.id}`;
    root.add(patch);

    const boundary = vertices.slice(1).map(vertex => vertex.clone().multiplyScalar((mapRadius + 0.002) / mapRadius));
    boundary.push(boundary[0]);
    root.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(boundary),
      outlineMaterial
    ));

    const labelWidth = Math.max(0.56, pillWidth / cellWidth * 1.32);
    const labelGeometry = new THREE.PlaneGeometry(labelWidth, 0.38);
    const u0 = pillX / canvas.width;
    const u1 = (pillX + pillWidth) / canvas.width;
    const v1 = 1 - row / rows;
    const v0 = 1 - (row + 1) / rows;
    labelGeometry.setAttribute("uv", new THREE.Float32BufferAttribute([
      u0, v1, u1, v1, u0, v0, u1, v0
    ], 2));
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.copy(center).multiplyScalar(globeRadius + 0.08);
    label.userData.normal = center;
    const up = new THREE.Vector3(0, 1, 0).addScaledVector(center, -center.y).normalize();
    if (up.lengthSq() < 0.01) up.set(0, 0, 1);
    const right = new THREE.Vector3().crossVectors(up, center).normalize();
    up.crossVectors(center, right).normalize();
    label.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(right, up, center));
    label.name = `skill-label-${skill.id}`;
    root.add(label);
    labels.push(label);
  });

  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(globeRadius, mobileQuality ? 24 : 36, mobileQuality ? 18 : 28),
    new THREE.MeshPhysicalMaterial({ color: "#d2def0", roughness: 0.5, metalness: 0.08, clearcoat: 0.3 })
  );
  globe.name = "skills-globe";
  globe.renderOrder = -1;
  root.add(globe);
  const grid = new THREE.Mesh(
    new THREE.SphereGeometry(globeRadius + 0.004, mobileQuality ? 14 : 22, mobileQuality ? 10 : 16),
    new THREE.MeshBasicMaterial({ color: "#8197b8", wireframe: true, transparent: true, opacity: 0.08 })
  );
  root.add(grid);
  const orbitMaterial = makeMetal("#c4d1e6", 0.35, 0.48);
  const orbit = addMesh(root, new THREE.TorusGeometry(1.19, 0.008, 5, mobileQuality ? 48 : 80), orbitMaterial, [0, 0, 0], [1.15, 0.18, -0.24]);
  const particles = new THREE.Points(
    new THREE.BufferGeometry(),
    new THREE.PointsMaterial({ color: "#6f91d5", size: 0.016, sizeAttenuation: true, transparent: true, opacity: 0.34 })
  );
  const positions = new Float32Array((mobileQuality ? 16 : 36) * 3);
  for (let index = 0; index < positions.length; index += 3) {
    const direction = new THREE.Vector3(Math.sin(index * 12.9898), Math.cos(index * 4.1414), Math.sin(index * 7.233)).normalize();
    positions.set(direction.multiplyScalar(1.42 + (index % 5) * 0.08).toArray(), index);
  }
  particles.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  root.add(particles);

  return {
    root,
    globe,
    orbit,
    particles,
    labels,
    atlas,
    materials: [
      ...regionMaterials,
      outlineMaterial,
      labelMaterial,
      globe.material,
      grid.material,
      orbitMaterial,
      particles.material
    ]
  };
}

export function initHeroScene(container) {
  if (!container || !("WebGLRenderingContext" in window)) return null;

  let renderer;
  let environmentTarget;
  let environment;
  let frameId = 0;
  let isVisible = false;
  let isDisposed = false;
  let contextLost = false;
  let storyProgress = 0;
  let resizeObserver;
  let intersectionObserver;
  const pointer = new THREE.Vector2();
  const easedPointer = new THREE.Vector2();
  const manualRotation = new THREE.Vector2();
  const rotationVelocity = new THREE.Vector2();
  let activePointerId = null;
  let lastDragX = 0;
  let lastDragY = 0;
  let lastDragAt = 0;
  const startedAt = performance.now() / 1000;
  let previousFrameAt = null;
  let previousRenderAt = 0;
  const mediaQuery = window.matchMedia("(max-width: 760px)");
  const mobileQuality = mediaQuery.matches || (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4);
  const frameInterval = mobileQuality ? 1000 / 24 : 1000 / 30;
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2("#edf2fb", 0.055);
  let baseCameraZ = 8.1;
  const raycaster = new THREE.Raycaster();
  const rayPointer = new THREE.Vector2();
  let dragOriginX = 0;
  let dragOriginY = 0;
  let dragMoved = false;

  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !mediaQuery.matches,
      powerPreference: "high-performance",
      precision: "mediump"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mediaQuery.matches ? 0.85 : mobileQuality ? 1 : 1.55));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = "hero-canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.prepend(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
    camera.position.set(0, 0.06, 8.1);
    camera.lookAt(0, 0, 0);

    if (!mobileQuality) {
      const pmrem = new THREE.PMREMGenerator(renderer);
      environment = new RoomEnvironment();
      environmentTarget = pmrem.fromScene(environment, 0.04);
      scene.environment = environmentTarget.texture;
      environment.dispose();
      pmrem.dispose();
    }

    scene.add(new THREE.HemisphereLight("#ffffff", "#9aa9c3", mobileQuality ? 1.7 : 2.1));
    const keyLight = new THREE.DirectionalLight("#ffffff", 3.1);
    keyLight.position.set(-3.2, 4.4, 5);
    scene.add(keyLight);
    const blueLight = new THREE.PointLight("#76a1ff", mobileQuality ? 18 : 34, 9, 1.8);
    blueLight.position.set(2.4, 1.5, 2.2);
    scene.add(blueLight);
    const rimLight = new THREE.PointLight("#ffffff", mobileQuality ? 10 : 20, 7, 2);
    rimLight.position.set(-2.2, -1.3, -1.4);
    scene.add(rimLight);

    const sculpture = createSkillGlobe(scene, mobileQuality);
    const rootInverse = new THREE.Quaternion();
    const viewDirection = new THREE.Vector3();
    const resize = () => {
      if (isDisposed) return;
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mediaQuery.matches ? 0.85 : mobileQuality ? 1 : 1.55));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      baseCameraZ = width < 500 ? 5.4 : width < 760 ? 6.1 : 6.2;
      camera.position.z = baseCameraZ;
      camera.updateProjectionMatrix();
    };

    const renderFrame = () => {
      frameId = 0;
      if (isDisposed || contextLost || !isVisible) return;
      const currentTime = performance.now() / 1000;
      if (currentTime * 1000 - previousRenderAt < frameInterval) {
        frameId = window.requestAnimationFrame(renderFrame);
        return;
      }
      previousRenderAt = currentTime * 1000;
      const delta = previousFrameAt === null ? 0 : Math.min(currentTime - previousFrameAt, 0.04);
      const elapsed = currentTime - startedAt;
      previousFrameAt = currentTime;
      easedPointer.lerp(pointer, 1 - Math.exp(-delta * 3.2));
      if (activePointerId === null && rotationVelocity.lengthSq() > 0) {
        manualRotation.addScaledVector(rotationVelocity, delta);
        rotationVelocity.multiplyScalar(Math.exp(-4.5 * delta));
        if (rotationVelocity.lengthSq() < 0.0004) rotationVelocity.set(0, 0);
      }

      const mobileScrollTurn = mobileQuality ? storyProgress * 0.9 : 0;
      sculpture.root.rotation.y = easedPointer.x * 0.18 + Math.sin(elapsed * 0.12) * 0.045 + mobileScrollTurn + manualRotation.x;
      sculpture.root.rotation.x = easedPointer.y * 0.1 + Math.sin(elapsed * 0.18) * 0.025 + storyProgress * (mobileQuality ? 0.2 : 0) + manualRotation.y;
      sculpture.root.position.x = easedPointer.x * 0.06;
      sculpture.root.position.y = -storyProgress * 0.1;
      sculpture.root.scale.setScalar(0.94 - storyProgress * 0.025);
      sculpture.orbit.rotation.y = Math.sin(elapsed * 0.15) * 0.08 + storyProgress * 0.18;
      sculpture.particles.rotation.y = mobileQuality ? 0 : elapsed * 0.01;
      blueLight.intensity = (mobileQuality ? 12 : 22) + Math.sin(elapsed * 0.6) * (mobileQuality ? 1 : 3);
      camera.position.x += (easedPointer.x * (mobileQuality ? 0.1 : 0.2) - camera.position.x) * Math.min(delta * 1.8, 1);
      camera.position.y += (easedPointer.y * (mobileQuality ? -0.07 : -0.14) - storyProgress * (mobileQuality ? 0.28 : 0.08) - camera.position.y) * Math.min(delta * 1.8, 1);
      if (mobileQuality) {
        camera.position.z += (baseCameraZ - storyProgress * 0.5 - camera.position.z) * Math.min(delta * 2.4, 1);
      }
      camera.lookAt(0, 0, 0);
      rootInverse.copy(sculpture.root.quaternion).invert();
      viewDirection.copy(camera.position).sub(sculpture.root.position).normalize().applyQuaternion(rootInverse);
      sculpture.labels.forEach(label => {
        label.visible = label.userData.normal.dot(viewDirection) > 0.82;
      });
      renderer.render(scene, camera);
      if (!container.classList.contains("webgl-ready")) container.classList.add("webgl-ready");
      const inertiaActive = rotationVelocity.lengthSq() >= 0.0004;
      if ((!reducedMotion.matches && !mobileQuality) || activePointerId !== null || inertiaActive) {
        frameId = window.requestAnimationFrame(renderFrame);
      }
    };

    const requestRender = () => {
      if (isVisible && !frameId && !isDisposed && !contextLost) frameId = window.requestAnimationFrame(renderFrame);
    };

    const onPointerMove = event => {
      const bounds = container.getBoundingClientRect();
      if (activePointerId === event.pointerId) {
        if (Math.hypot(event.clientX - dragOriginX, event.clientY - dragOriginY) > 8) dragMoved = true;
        const now = event.timeStamp;
        const elapsed = Math.max((now - lastDragAt) / 1000, 1 / 120);
        const deltaX = (event.clientX - lastDragX) / bounds.width * Math.PI * 2;
        const deltaY = (event.clientY - lastDragY) / bounds.height * Math.PI * 2;
        manualRotation.x += deltaX;
        manualRotation.y = THREE.MathUtils.clamp(manualRotation.y + deltaY, -Math.PI * 0.48, Math.PI * 0.48);
        rotationVelocity.set(
          THREE.MathUtils.clamp(deltaX / elapsed, -5, 5),
          THREE.MathUtils.clamp(deltaY / elapsed, -5, 5)
        );
        lastDragX = event.clientX;
        lastDragY = event.clientY;
        lastDragAt = now;
        requestRender();
        return;
      }
      if (reducedMotion.matches) return;
      pointer.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      pointer.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      requestRender();
    };
    const onPointerDown = event => {
      if (event.button !== 0 || !event.isPrimary) return;
      activePointerId = event.pointerId;
      dragOriginX = event.clientX;
      dragOriginY = event.clientY;
      dragMoved = false;
      lastDragX = event.clientX;
      lastDragY = event.clientY;
      lastDragAt = event.timeStamp;
      rotationVelocity.set(0, 0);
      renderer.domElement.classList.add("is-dragging");
      renderer.domElement.setPointerCapture(event.pointerId);
      requestRender();
    };
    const onPointerUp = event => {
      if (activePointerId !== event.pointerId) return;
      if (event.type === "pointerup" && !dragMoved) {
        const bounds = renderer.domElement.getBoundingClientRect();
        rayPointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
        rayPointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
        raycaster.setFromCamera(rayPointer, camera);
        const selectedLabel = raycaster.intersectObjects(sculpture.labels, false)[0]?.object;
        const selectedSkill = selectedLabel && skills.find(skill => selectedLabel.name === `skill-label-${skill.id}`);
        if (selectedSkill) {
          container.dispatchEvent(new CustomEvent("skillselect", { detail: selectedSkill }));
        }
      }
      activePointerId = null;
      renderer.domElement.classList.remove("is-dragging");
      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
      requestRender();
    };
    const onPointerLeave = () => {
      if (activePointerId !== null) return;
      pointer.set(0, 0);
      requestRender();
    };
    const onVisibilityChange = () => {
      if (document.hidden) {
        if (frameId) window.cancelAnimationFrame(frameId);
        frameId = 0;
      } else {
        previousFrameAt = null;
        previousRenderAt = 0;
        requestRender();
      }
    };
    const onContextLost = event => {
      event.preventDefault();
      contextLost = true;
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = 0;
      container.classList.remove("webgl-ready");
      console.warn("Hero WebGL context was lost; retaining the CSS visual fallback.");
    };
    const onContextRestored = () => {
      contextLost = false;
      resize();
      requestRender();
    };
    const onViewportChange = event => {
      resize();
      requestRender();
    };

    resize();
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    intersectionObserver = new IntersectionObserver(entries => {
      isVisible = entries.some(entry => entry.isIntersecting);
      if (isVisible) requestRender();
      else if (frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }
    }, { threshold: 0.05 });
    intersectionObserver.observe(container);
    container.addEventListener("pointermove", onPointerMove, { passive: true });
    container.addEventListener("pointerleave", onPointerLeave, { passive: true });
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);
    document.addEventListener("visibilitychange", onVisibilityChange);
    mediaQuery.addEventListener?.("change", onViewportChange);
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);
    renderer.domElement.addEventListener("webglcontextrestored", onContextRestored);
    reducedMotion.addEventListener?.("change", requestRender);

    return {
      setStoryProgress(value) {
        storyProgress = THREE.MathUtils.clamp(value, 0, 1);
        requestRender();
      },
      dispose() {
        if (isDisposed) return;
        isDisposed = true;
        if (frameId) window.cancelAnimationFrame(frameId);
        resizeObserver?.disconnect();
        intersectionObserver?.disconnect();
        container.removeEventListener("pointermove", onPointerMove);
        container.removeEventListener("pointerleave", onPointerLeave);
        renderer.domElement.removeEventListener("pointerdown", onPointerDown);
        renderer.domElement.removeEventListener("pointerup", onPointerUp);
        renderer.domElement.removeEventListener("pointercancel", onPointerUp);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        mediaQuery.removeEventListener?.("change", onViewportChange);
        renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
        renderer.domElement.removeEventListener("webglcontextrestored", onContextRestored);
        reducedMotion.removeEventListener?.("change", requestRender);
        const disposedGeometries = new Set();
        sculpture.root.traverse(object => {
          if (object.geometry && !disposedGeometries.has(object.geometry)) {
            object.geometry.dispose();
            disposedGeometries.add(object.geometry);
          }
        });
        sculpture.materials.forEach(material => material.dispose());
        sculpture.atlas.dispose();
        environmentTarget?.texture.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        container.classList.remove("webgl-ready");
      }
    };
  } catch (error) {
    console.warn("Hero WebGL could not initialize; retaining the CSS visual fallback.", error);
    environment?.dispose();
    environmentTarget?.dispose();
    renderer?.dispose();
    renderer?.domElement.remove();
    container.classList.remove("webgl-ready");
    return null;
  }
}
