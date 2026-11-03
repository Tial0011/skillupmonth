import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

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

  const satellites = [];
  const satelliteGeometry = new THREE.OctahedronGeometry(0.11, 0);
  [
    [-1.55, 0.92, 0.22],
    [1.45, -0.64, 0.48],
    [1.58, 0.44, -0.2],
    [-1.35, -0.48, 0.5]
  ].forEach((position, index) => {
    const object = addMesh(root, satelliteGeometry, index % 2 ? paleBlue : silver, position, [0.2 * index, 0.3, 0.1]);
    object.userData.floatOffset = index * 1.7;
    satellites.push(object);
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

  const materials = [silver, paleBlue, darkSilver, accent, innerCore.material, ribbon.material, particles.material];
  return { root, core, innerCore, rings, ribbon, steps, satellites, particles, plinth, materials, geometries: [satelliteGeometry] };
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

    const sculpture = createSculpture(scene, mobileQuality);
    const resize = () => {
      if (isDisposed) return;
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mediaQuery.matches ? 0.85 : mobileQuality ? 1 : 1.55));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      baseCameraZ = width < 500 ? 7.4 : width < 760 ? 8.3 : 8.1;
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
      sculpture.root.position.x = easedPointer.x * 0.13 + (mobileQuality ? Math.sin(storyProgress * Math.PI) * 0.12 : 0);
      sculpture.root.position.y = Math.sin(elapsed * 0.32) * 0.045 - storyProgress * (mobileQuality ? 0.3 : 0.18);
      sculpture.root.scale.setScalar(1 - storyProgress * (mobileQuality ? 0.07 : 0.055));
      if (mobileQuality) {
        sculpture.core.rotation.y = sculpture.core.userData.baseY + storyProgress * 0.72;
        sculpture.core.rotation.x = sculpture.core.userData.baseX + storyProgress * 0.2;
      } else {
        sculpture.core.rotation.y += delta * (0.18 + storyProgress * 0.12);
        sculpture.core.rotation.x += delta * 0.11;
      }
      sculpture.innerCore.rotation.y -= delta * (mobileQuality ? 0 : 0.22);
      if (mobileQuality) sculpture.innerCore.rotation.z = storyProgress * 0.18;
      sculpture.rings.forEach((ring, index) => {
        const rotationSpeed = mobileQuality ? 0 : (0.018 + index * 0.009) * ring.userData.spin;
        ring.rotation.z += delta * rotationSpeed;
        ring.rotation.x += delta * (mobileQuality ? 0 : 0.007 * (index + 1));
        if (mobileQuality) {
          ring.rotation.z = ring.userData.baseZ + storyProgress * (0.44 + index * 0.08) * ring.userData.spin;
          ring.rotation.x = ring.userData.baseX + storyProgress * 0.18 * ring.userData.spin;
        }
      });
      sculpture.ribbon.rotation.y = (mobileQuality ? 0 : Math.sin(elapsed * 0.25) * 0.06) + storyProgress * (mobileQuality ? 0.3 : 0.1);
      sculpture.satellites.forEach((object, index) => {
        object.position.y += (Math.sin(elapsed * 0.8 + object.userData.floatOffset) * 0.035 - (object.userData.lastFloat || 0));
        object.userData.lastFloat = Math.sin(elapsed * 0.8 + object.userData.floatOffset) * 0.035;
        object.rotation.x += delta * (mobileQuality ? 0 : 0.18 + index * 0.025);
        object.rotation.y += delta * (mobileQuality ? 0 : 0.21);
        if (mobileQuality) object.rotation.y = storyProgress * 0.55 + index * 0.3;
      });
      sculpture.particles.rotation.y = (mobileQuality ? 0 : elapsed * 0.012) + storyProgress * (mobileQuality ? 0.22 : 0);
      blueLight.intensity = (mobileQuality ? 16 : 30) + Math.sin(elapsed * 0.6) * (mobileQuality ? 2 : 4) + storyProgress * (mobileQuality ? 5 : 12);
      camera.position.x += (easedPointer.x * (mobileQuality ? 0.1 : 0.2) - camera.position.x) * Math.min(delta * 1.8, 1);
      camera.position.y += (easedPointer.y * (mobileQuality ? -0.07 : -0.14) - storyProgress * (mobileQuality ? 0.28 : 0.08) - camera.position.y) * Math.min(delta * 1.8, 1);
      if (mobileQuality) {
        camera.position.z += (baseCameraZ - storyProgress * 0.5 - camera.position.z) * Math.min(delta * 2.4, 1);
      }
      camera.lookAt(0, 0, 0);
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
        sculpture.root.traverse(object => {
          if (object.geometry && !sculpture.geometries.includes(object.geometry)) object.geometry.dispose();
        });
        sculpture.geometries.forEach(geometry => geometry.dispose());
        sculpture.materials.forEach(material => material.dispose());
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
