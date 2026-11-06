import * as THREE from 'three';
import { clamp, damp } from '../math';

const CENTER = new THREE.Vector3(0, 0, -160);
const RADIUS = 160;

function circularPos(deg: number, y: number): [number, number, number] {
  const rad = (deg * Math.PI) / 180;
  return [CENTER.x + RADIUS * Math.cos(rad), y, CENTER.z + RADIUS * Math.sin(rad)];
}

function calcYaw(p1: [number, number, number], p2: [number, number, number]): number {
  return Math.atan2(-(p2[0] - p1[0]), -(p2[2] - p1[2]));
}

export interface ChapterLayout {
  origin: [number, number, number];
  memory: [number, number, number];
  refraction: [number, number, number];
  work: [number, number, number];
  threshold: [number, number, number];
  network: [number, number, number];
  originYaw: number;
  memoryYaw: number;
  refractionYaw: number;
  workYaw: number;
  thresholdYaw: number;
}

export function createChapterLayouts(): ChapterLayout {
  const origin = circularPos(90, 0);
  const memory = circularPos(142, -65);
  const refraction = circularPos(194, -130);
  const work = circularPos(246, -195);
  const threshold = circularPos(304, -260);
  const network = circularPos(350, -320);

  return {
    origin,
    memory,
    refraction,
    work,
    threshold,
    network,
    originYaw: calcYaw(origin, memory),
    memoryYaw: calcYaw(origin, memory),
    refractionYaw: calcYaw(memory, refraction),
    workYaw: calcYaw(refraction, work),
    thresholdYaw: calcYaw(work, threshold),
  };
}

export interface CameraSample {
  pos: THREE.Vector3;
  look: THREE.Vector3;
  fov: number;
  roll: number;
  sceneF: number;
}

export class CameraSplineController {
  public curve: THREE.CatmullRomCurve3;
  public lookCurve: THREE.CatmullRomCurve3;
  public totalLength: number;
  public keyframes: {
    t: number;
    pos: THREE.Vector3;
    look: THREE.Vector3;
    fov: number;
    roll: number;
    sceneF: number;
  }[] = [];

  constructor() {
    const layout = createChapterLayouts();
    const o = new THREE.Vector3(...layout.origin);
    const m = new THREE.Vector3(...layout.memory);
    const r = new THREE.Vector3(...layout.refraction);
    const w = new THREE.Vector3(...layout.work);
    const th = new THREE.Vector3(...layout.threshold);
    const net = new THREE.Vector3(...layout.network);

    const camPoints: THREE.Vector3[] = [
      o.clone().add(new THREE.Vector3(0, 0.4, 38)),
      o.clone().add(new THREE.Vector3(5, 1.2, 26)),
      o.clone().add(new THREE.Vector3(-5.5, 2.4, 18)),
      o.clone().add(new THREE.Vector3(1.5, 2, 5.5)),
      m.clone().add(new THREE.Vector3(9, 7, 17)),
      m.clone().add(new THREE.Vector3(4.5, 2.4, 10)),
      m.clone().add(new THREE.Vector3(-6.8, 2.5, 6.4)),
      r.clone().add(new THREE.Vector3(15, 4.5, 30)),
      r.clone().add(new THREE.Vector3(7, 2.1, 15)),
      r.clone().add(new THREE.Vector3(-4.8, 2.5, 8.8)),
      w.clone().add(new THREE.Vector3(15, 10, 27)),
      w.clone().add(new THREE.Vector3(7.8, 5.4, 12.6)),
      w.clone().add(new THREE.Vector3(0, 3.5, 7.4)),
      th.clone().add(new THREE.Vector3(6, 4.5, 18)),
      th.clone().add(new THREE.Vector3(0, 2.8, 11)),
      net.clone().add(new THREE.Vector3(0, 5, 22)),
      new THREE.Vector3(0, -200, -160).add(new THREE.Vector3(0, 25, 40)),
    ];

    const lookPoints: THREE.Vector3[] = [
      o.clone(),
      o.clone().add(new THREE.Vector3(0, 0.2, 0)),
      o.clone(),
      o.clone().add(new THREE.Vector3(0, -2, -2)),
      m.clone().add(new THREE.Vector3(0, 1.4, 0)),
      m.clone().add(new THREE.Vector3(-0.6, 1.7, -0.4)),
      m.clone().add(new THREE.Vector3(-4.2, 2.4, 0.9)),
      r.clone().add(new THREE.Vector3(0, 3.5, 0)),
      r.clone().add(new THREE.Vector3(0, 3.4, 0)),
      r.clone().add(new THREE.Vector3(0, 3.9, 0)),
      w.clone().add(new THREE.Vector3(0, 3.6, 0)),
      w.clone().add(new THREE.Vector3(0, 3.5, 0)),
      w.clone().add(new THREE.Vector3(0, 3.5, 0)),
      th.clone().add(new THREE.Vector3(0, 2.5, 0)),
      th.clone().add(new THREE.Vector3(0, 2, 0)),
      net.clone().add(new THREE.Vector3(0, 3, 0)),
      new THREE.Vector3(0, -200, -160),
    ];

    this.curve = new THREE.CatmullRomCurve3(camPoints, false, 'centripetal', 0.5);
    this.lookCurve = new THREE.CatmullRomCurve3(lookPoints, false, 'centripetal', 0.5);
    this.totalLength = this.curve.getLength();
  }

  public sample(progress: number, out: CameraSample) {
    const t = clamp(progress, 0, 1);
    this.curve.getPointAt(t, out.pos);
    this.lookCurve.getPointAt(t, out.look);

    const sceneProgress = t * 6;
    out.sceneF = sceneProgress;

    // FOV transitions gracefully between 28 and 54 degrees
    if (sceneProgress < 1) {
      out.fov = 28 + sceneProgress * 10;
    } else if (sceneProgress < 3) {
      out.fov = 38 - (sceneProgress - 1) * 3;
    } else if (sceneProgress < 4) {
      out.fov = 34 + (sceneProgress - 3) * 6;
    } else {
      out.fov = 40 + (sceneProgress - 4) * 5;
    }

    out.roll = Math.sin(sceneProgress * Math.PI) * 0.04;
  }

  public local(chapterIndex: number, progress: number): number {
    const chapterStart = chapterIndex / 6;
    const chapterEnd = (chapterIndex + 1) / 6;
    return clamp((progress - chapterStart) / (chapterEnd - chapterStart), 0, 1);
  }
}
