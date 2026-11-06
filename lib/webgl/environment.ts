import * as THREE from 'three';
import { createChapterLayouts } from './spline';
import { PROJECTS, Project } from '../data';

export interface EnvironmentController {
  group: THREE.Group;
  workCards: THREE.Mesh[];
  particles: THREE.Points;
  update: (time: number, dt: number, raycaster: THREE.Raycaster) => { hoveredCard: number };
}

export function createEnvironment(onSelectProject: (idx: number) => void): EnvironmentController {
  const group = new THREE.Group();
  group.name = 'environment';

  const layout = createChapterLayouts();
  const workOrigin = new THREE.Vector3(...layout.work);

  // 1. Swirling and floating particles
  const particleCount = 1500;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const scales = new Float32Array(particleCount);

  const c1 = new THREE.Color('#ff3a22');
  const c2 = new THREE.Color('#ffb08a');
  const c3 = new THREE.Color('#c9a99e');

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const r = 25 * Math.sqrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    positions[i3] = workOrigin.x + Math.cos(theta) * r;
    positions[i3 + 1] = workOrigin.y + (Math.random() - 0.5) * 20;
    positions[i3 + 2] = workOrigin.z + Math.sin(theta) * r;

    const col = Math.random() < 0.4 ? c1 : Math.random() < 0.7 ? c2 : c3;
    colors[i3] = col.r;
    colors[i3 + 1] = col.g;
    colors[i3 + 2] = col.b;

    scales[i] = Math.random() * 0.04 + 0.01;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  group.add(particles);

  // 2. 3D Project cards in Chapter 4
  const workCards: THREE.Mesh[] = [];
  const textureLoader = new THREE.TextureLoader();

  const cardAngles = [-0.6, -0.2, 0.2, 0.6];
  const cardRadius = 7.5;

  PROJECTS.forEach((proj, idx) => {
    const cardGeo = new THREE.PlaneGeometry(3.6, 2.2);
    const angle = cardAngles[idx];
    const x = workOrigin.x + Math.sin(angle) * cardRadius;
    const z = workOrigin.z + Math.cos(angle) * cardRadius;
    const y = workOrigin.y + 3.2;

    const mat = new THREE.MeshBasicMaterial({
      color: 0x111111,
      side: THREE.DoubleSide,
    });

    if (proj.cover.type === 'image') {
      textureLoader.load(proj.cover.src, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        mat.map = tex;
        mat.color.setHex(0xffffff);
        mat.needsUpdate = true;
      });
    }

    const mesh = new THREE.Mesh(cardGeo, mat);
    mesh.position.set(x, y, z);
    mesh.lookAt(workOrigin.x, y, workOrigin.z);
    mesh.userData = { projectIndex: idx };

    group.add(mesh);
    workCards.push(mesh);
  });

  return {
    group,
    workCards,
    particles,
    update: (time, dt, raycaster) => {
      // Rotate particles slightly
      const pos = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        pos[i3 + 1] += Math.sin(time + pos[i3]) * 0.005;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Raycast project cards
      let hoveredCard = -1;
      const intersects = raycaster.intersectObjects(workCards);
      if (intersects.length > 0) {
        hoveredCard = intersects[0].object.userData.projectIndex ?? -1;
      }

      workCards.forEach((card, i) => {
        const isHov = hoveredCard === i;
        const targetScale = isHov ? 1.08 : 1.0;
        card.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), dt * 8);
      });

      return { hoveredCard };
    },
  };
}
