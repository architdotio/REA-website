import * as THREE from 'three';
import { CameraSplineController, CameraSample } from './spline';
import { createRibbon, RibbonController } from './ribbon';
import { createFigure, FigureController } from './figure';
import { createEnvironment, EnvironmentController } from './environment';
import { InputController } from '../scroll';
import { damp, clamp } from '../math';

export interface SceneCallbacks {
  onProgressUpdate: (progress: number, sceneF: number, chapterIndex: number, localProgress: number) => void;
  onHoverWorkCard: (cardIndex: number) => void;
  onSelectProject: (projectIndex: number) => void;
  onLoaded: () => void;
}

export class WebGLStage {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private spline: CameraSplineController;
  private ribbon: RibbonController;
  private figure: FigureController;
  private environment: EnvironmentController;
  private input: InputController;
  private raycaster: THREE.Raycaster;
  private mouseNDC: THREE.Vector2 = new THREE.Vector2();
  private callbacks: SceneCallbacks;

  private isRunning = false;
  private rafId = 0;
  private prevTime = performance.now();
  private cursorVel = 0;
  private prevCursor = new THREE.Vector2();
  private currentSample: CameraSample = {
    pos: new THREE.Vector3(),
    look: new THREE.Vector3(),
    fov: 34,
    roll: 0,
    sceneF: 0,
  };

  private dpr = 1;
  private maxDpr = 2;

  constructor(canvas: HTMLCanvasElement, input: InputController, callbacks: SceneCallbacks) {
    this.canvas = canvas;
    this.input = input;
    this.callbacks = callbacks;

    const isCoarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    this.maxDpr = isCoarse ? 1.5 : 2;
    this.dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, this.maxDpr) : 1;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000000, 0.008);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      34,
      window.innerWidth / window.innerHeight,
      0.1,
      800
    );

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(20, 40, 20);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.normalBias = 0.03;
    this.scene.add(keyLight);

    const glowLight1 = new THREE.PointLight(0xff2a1a, 2.5, 60);
    glowLight1.position.set(0, 4, 0);
    this.scene.add(glowLight1);

    // Controllers
    this.spline = new CameraSplineController();
    this.ribbon = createRibbon();
    this.scene.add(this.ribbon.mesh);

    this.figure = createFigure();
    this.scene.add(this.figure.group);

    this.environment = createEnvironment((idx) => {
      this.callbacks.onSelectProject(idx);
    });
    this.scene.add(this.environment.group);

    this.raycaster = new THREE.Raycaster();

    const handleResize = () => this.resize();
    window.addEventListener('resize', handleResize);

    // Click handler for 3D cards
    const handleClick = () => {
      this.raycaster.setFromCamera(this.mouseNDC, this.camera);
      const intersects = this.raycaster.intersectObjects(this.environment.workCards);
      if (intersects.length > 0) {
        const idx = intersects[0].object.userData.projectIndex;
        if (typeof idx === 'number') {
          this.callbacks.onSelectProject(idx);
        }
      }
    };
    window.addEventListener('click', handleClick);

    // Wait for figure ready
    this.figure.ready.then(() => {
      this.callbacks.onLoaded();
    });

    this.start();
  }

  public resize() {
    if (typeof window === 'undefined') return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio, this.maxDpr);
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    if (this.ribbon.uniforms.uPixelRatio) {
      this.ribbon.uniforms.uPixelRatio.value = this.dpr;
      this.ribbon.uniforms.uViewH.value = height;
    }
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.prevTime = performance.now();
    this.tick(performance.now());
  }

  public stop() {
    this.isRunning = false;
    cancelAnimationFrame(this.rafId);
  }

  public jumpToChapter(chapterIndex: number) {
    const targetProgress = chapterIndex / 6;
    this.input.scrollTarget = targetProgress;
    const scrollMax = this.input.storyMax();
    window.scrollTo({
      top: targetProgress * scrollMax,
      behavior: 'smooth',
    });
  }

  private tick = (time: number) => {
    if (!this.isRunning) return;
    this.rafId = requestAnimationFrame(this.tick);

    const dt = Math.min(0.1, (time - this.prevTime) / 1000);
    this.prevTime = time;

    // Update input
    this.input.update(dt);
    this.mouseNDC.copy(this.input.ndc);

    // Compute cursor velocity
    const cursorDist = this.input.target.distanceTo(this.prevCursor);
    this.prevCursor.copy(this.input.target);
    this.cursorVel = damp(this.cursorVel, Math.min(cursorDist / Math.max(dt, 0.001), 10), 6, dt);

    // Sample camera spline
    this.spline.sample(this.input.scroll, this.currentSample);

    this.camera.position.copy(this.currentSample.pos);
    this.camera.lookAt(this.currentSample.look);
    this.camera.fov = damp(this.camera.fov, this.currentSample.fov, 4, dt);
    this.camera.rotation.z += this.currentSample.roll;
    this.camera.updateProjectionMatrix();

    // Raycast ray in world space
    this.raycaster.setFromCamera(this.mouseNDC, this.camera);
    const rayO = this.raycaster.ray.origin;
    const rayD = this.raycaster.ray.direction;

    // Update Ribbon
    this.ribbon.update(time / 1000, this.cursorVel, rayO, rayD);

    // Update Figure
    this.figure.update(time / 1000, dt, this.input.target);

    // Update Environment and 3D Cards
    const { hoveredCard } = this.environment.update(time / 1000, dt, this.raycaster);
    this.callbacks.onHoverWorkCard(hoveredCard);

    // Notify UI of progress
    const sceneF = this.currentSample.sceneF;
    const activeChapter = Math.floor(clamp(sceneF, 0, 5));
    const localProgress = this.spline.local(activeChapter, this.input.scroll);
    this.callbacks.onProgressUpdate(this.input.scroll, sceneF, activeChapter, localProgress);

    // Render
    this.renderer.render(this.scene, this.camera);
  };

  public destroy() {
    this.stop();
    this.renderer.dispose();
  }
}
