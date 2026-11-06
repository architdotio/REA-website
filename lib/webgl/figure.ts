import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface FigureController {
  group: THREE.Group;
  ready: Promise<void>;
  update: (time: number, dt: number, targetNDC: THREE.Vector2) => void;
}

export function createFigure(): FigureController {
  const group = new THREE.Group();
  group.name = 'hero-figure';

  const innerGroup = new THREE.Group();
  group.add(innerGroup);

  let model: THREE.Object3D | null = null;
  const bones: Record<string, THREE.Bone> = {};
  const restRotations: Record<string, THREE.Euler> = {};

  const loader = new GLTFLoader();

  const ready = new Promise<void>((resolve) => {
    loader.load(
      '/models/figure.v2.glb',
      (gltf) => {
        model = gltf.scene;
        model.scale.setScalar(2);
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            const mesh = child as THREE.Mesh;
            if (mesh.material) {
              const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
              mat.roughness = 0.45;
              mat.metalness = 0.1;
              mesh.material = mat;
            }
          }
          if ((child as THREE.Bone).isBone) {
            const bone = child as THREE.Bone;
            bones[bone.name] = bone;
            restRotations[bone.name] = bone.rotation.clone();
          }
        });
        innerGroup.add(model);
        resolve();
      },
      undefined,
      (err) => {
        console.warn('Could not load figure model:', err);
        resolve();
      }
    );
  });

  return {
    group,
    ready,
    update: (time, dt, targetNDC) => {
      // Floating & breathing motion
      innerGroup.position.y = Math.sin(time * 1.5) * 0.12;
      innerGroup.rotation.y = Math.sin(time * 0.5) * 0.08 + targetNDC.x * 0.15;
      innerGroup.rotation.x = -targetNDC.y * 0.1;

      // Bone procedural lerps
      if (bones.head) {
        bones.head.rotation.y = targetNDC.x * 0.3 + Math.sin(time * 1.2) * 0.05;
        bones.head.rotation.x = -targetNDC.y * 0.25 + Math.sin(time * 1.8) * 0.03;
      }
      if (bones.spine) {
        bones.spine.rotation.x = Math.sin(time * 1.5) * 0.04;
      }
      if (bones.upper_armL) {
        bones.upper_armL.rotation.z = -0.3 + Math.sin(time * 1.2) * 0.06;
      }
      if (bones.upper_armR) {
        bones.upper_armR.rotation.z = 0.3 - Math.sin(time * 1.2) * 0.06;
      }
    },
  };
}
