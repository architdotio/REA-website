import * as THREE from 'three';
import {
  RIBBON_VERTEX_SHADER,
  RIBBON_FRAGMENT_SHADER,
} from './shaders';
import { createChapterLayouts } from './spline';

export interface RibbonController {
  mesh: THREE.Mesh;
  curve: THREE.CatmullRomCurve3;
  uniforms: Record<string, { value: any }>;
  length: number;
  update: (time: number, cursorVel: number, rayO: THREE.Vector3, rayD: THREE.Vector3) => void;
}

export function createRibbon(): RibbonController {
  const layout = createChapterLayouts();
  const o = new THREE.Vector3(...layout.origin);
  const m = new THREE.Vector3(...layout.memory);
  const r = new THREE.Vector3(...layout.refraction);
  const w = new THREE.Vector3(...layout.work);
  const th = new THREE.Vector3(...layout.threshold);
  const net = new THREE.Vector3(...layout.network);

  const threadPoints: THREE.Vector3[] = [
    o.clone().add(new THREE.Vector3(0, 1.2, 0)),
    o.clone().add(new THREE.Vector3(2.5, 3.5, 4)),
    o.clone().add(new THREE.Vector3(-1.8, 6.2, 2)),
    m.clone().add(new THREE.Vector3(1.2, 4.2, 2.5)),
    m.clone().add(new THREE.Vector3(-3.2, 1.8, -1.5)),
    r.clone().add(new THREE.Vector3(4.5, 5.8, 3)),
    r.clone().add(new THREE.Vector3(-2.4, 2.2, 1.8)),
    w.clone().add(new THREE.Vector3(-0.4, 3.25, 1.35)),
    w.clone().add(new THREE.Vector3(0.05, 3.1, 0.62)),
    w.clone().add(new THREE.Vector3(0.35, 2.8, -1.3)),
    w.clone().add(new THREE.Vector3(0.7, 1.3, -3.5)),
    w.clone().add(new THREE.Vector3(2.6, -1.4, -9.5)),
    th.clone().add(new THREE.Vector3(0, 3, 0)),
    net.clone().add(new THREE.Vector3(0, 3, 0)),
    new THREE.Vector3(0, -200, -160).add(new THREE.Vector3(0, 150, -20)),
    new THREE.Vector3(0, 160, -160),
  ];

  const curve = new THREE.CatmullRomCurve3(threadPoints, true, 'centripetal', 0.5);
  const length = curve.getLength();
  const segments = Math.min(3000, Math.floor(length * 2.5));
  const geometry = new THREE.TubeGeometry(curve, segments, 1, 6, true);

  const uniforms: Record<string, { value: any }> = {
    uColor: { value: new THREE.Color('#ff2a1a').multiplyScalar(3.2) },
    uRadius: { value: 0.022 },
    uMinPx: { value: 0.0009 },
    uLength: { value: length },
    uHead: { value: 0 },
    uHeadAmt: { value: 1.0 },
    uPluck: { value: 1.0 },
    uGain: { value: 1.0 },
    uTime: { value: 0 },
    uRayO: { value: new THREE.Vector3() },
    uRayD: { value: new THREE.Vector3(0, 0, -1) },
    uCursor: { value: new THREE.Vector2() },
    uCursorVel: { value: 0 },
    uFocus: { value: 10 },
    uBokeh: { value: 0 },
    uPixelRatio: { value: 1 },
    uViewH: { value: 1000 },
    uProjScale: { value: 1000 },
    uKeyShade: { value: 0 },
    uFogColor: { value: new THREE.Color(0x000000) },
    uFogDensity: { value: 0.01 },
    uFogBase: { value: 0 },
    uFogFalloff: { value: 0.02 },
    uFogNoise: { value: 0.5 },
    uGlowPos: { value: new THREE.Vector3() },
    uGlowColor: { value: new THREE.Color(0x000000) },
    uGlowPos2: { value: new THREE.Vector3() },
    uGlowColor2: { value: new THREE.Color(0x000000) },
    uFogTime: { value: 0 },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: RIBBON_VERTEX_SHADER,
    fragmentShader: RIBBON_FRAGMENT_SHADER,
    transparent: false,
    depthWrite: true,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;

  return {
    mesh,
    curve,
    uniforms,
    length,
    update: (time, cursorVel, rayO, rayD) => {
      uniforms.uTime.value = time;
      uniforms.uFogTime.value = time;
      uniforms.uCursorVel.value = cursorVel;
      uniforms.uRayO.value.copy(rayO);
      uniforms.uRayD.value.copy(rayD);
      uniforms.uHead.value = (time * 12) % length;
    },
  };
}
