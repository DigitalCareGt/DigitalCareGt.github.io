// @ts-nocheck
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three/webgpu';
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js';
import {
  abs,
  blendScreen,
  float,
  mod,
  mx_cell_noise_float,
  oneMinus,
  smoothstep,
  texture,
  uniform,
  uv,
  vec2,
  vec3,
  pass,
  mix,
  add,
} from 'three/tsl';

const TEXTUREMAP_SRC = 'https://i.postimg.cc/XYwvXN8D/img-4.png';
const DEPTHMAP_SRC = 'https://i.postimg.cc/2SHKQh2q/raw-4.webp';
const WIDTH = 300;
const HEIGHT = 300;

function loadTexture(src: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) =>
    new THREE.TextureLoader().load(src, resolve, undefined, reject),
  );
}

// Equivalent to drei's useAspect — returns world-unit scale for the mesh
function computeScale(canvasW: number, canvasH: number, camera: THREE.PerspectiveCamera): [number, number] {
  const fovRad = (camera.fov * Math.PI) / 180;
  const vpH = 2 * Math.tan(fovRad / 2) * camera.position.z;
  const vpW = vpH * (canvasW / canvasH);
  const imageAspect = WIDTH / HEIGHT;
  const adaptedRatio = (vpW / vpH * HEIGHT) / WIDTH;
  return adaptedRatio < 1
    ? [vpW, vpW / imageAspect]
    : [vpH * imageAspect, vpH];
}

type HeroFuturisticProps = {
  isDark?: boolean;
  title?: string;
  eyebrow?: string;
  description?: string;
};

export default function HeroFuturistic({
  title = 'Detectamos antes de reemplazar.',
  eyebrow = 'Escaneo Digital Care.',
}: HeroFuturisticProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ── Title word-by-word animation ─────────────────────────────────────
  const titleWords = title.split(' ');
  const [visibleWords, setVisibleWords] = useState(0);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [delays, setDelays] = useState<number[]>([]);
  const [subtitleDelay, setSubtitleDelay] = useState(0);

  useEffect(() => {
    setDelays(titleWords.map(() => Math.random() * 0.07));
    setSubtitleDelay(Math.random() * 0.1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleWords.length]);

  useEffect(() => {
    if (visibleWords < titleWords.length) {
      const t = setTimeout(() => setVisibleWords(v => v + 1), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setSubtitleVisible(true), 800);
    return () => clearTimeout(t);
  }, [visibleWords, titleWords.length]);

  // ── WebGPU scene (no R3F — R3F v8.18 doesn't await async gl factories) ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let frameId: number;
    let renderer: any;
    let mounted = true;
    let cleanupFns: Array<() => void> = [];

    const init = async () => {
      if (!navigator.gpu) {
        console.warn('[HeroFuturistic] WebGPU unavailable — enable it in chrome://flags or use Chrome/Edge 113+.');
        return;
      }

      try {
        renderer = new THREE.WebGPURenderer({ canvas, antialias: true });
        await renderer.init();
        if (!mounted) return;

        const W = window.innerWidth;
        const H = window.innerHeight;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(W, H);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 100);
        camera.position.z = 5;

        // Load textures
        const [rawMap, depthMap] = await Promise.all([
          loadTexture(TEXTUREMAP_SRC),
          loadTexture(DEPTHMAP_SRC),
        ]);
        if (!mounted) return;

        // ── TSL material ──────────────────────────────────────────────
        const uPointer = uniform(new THREE.Vector2(0));
        const uProgress = uniform(0);
        const strength = 0.01;

        const tDepthMap = texture(depthMap);
        const tMap = texture(rawMap, uv().add(tDepthMap.r.mul(uPointer).mul(strength)));

        const aspect = float(WIDTH).div(HEIGHT);
        const tUv = vec2(uv().x.mul(aspect), uv().y);
        const tiling = vec2(120.0);
        const tiledUv = mod(tUv.mul(tiling), 2.0).sub(1.0);
        const brightness = mx_cell_noise_float(tUv.mul(tiling).div(2));
        const dist = float(tiledUv.length());
        const dot = float(smoothstep(0.5, 0.49, dist)).mul(brightness);
        const depth = tDepthMap.r;
        const flow = oneMinus(smoothstep(0, 0.02, abs(depth.sub(uProgress))));
        const mask = dot.mul(flow).mul(vec3(4.12, 7.88, 7.84)); // #69C9C8 × 10
        const colorNode = blendScreen(tMap, mask);

        const material = new THREE.MeshBasicNodeMaterial({
          colorNode,
          transparent: true,
          opacity: 0,
        });

        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(), material);
        const scaleFactor = 0.4;
        const [sw, sh] = computeScale(W, H, camera);
        mesh.scale.set(sw * scaleFactor, sh * scaleFactor, 1);
        scene.add(mesh);

        // ── Post-processing (bloom + red scan line) ───────────────────
        const postProcessing = new THREE.PostProcessing(renderer);
        const scenePass = pass(scene, camera);
        const scenePassColor = scenePass.getTextureNode('output');
        const bloomPass = bloom(scenePassColor, 1, 0.5, 1);

        const uScanProgress = uniform(0);
        const uvY = uv().y;
        const scanWidth = float(0.05);
        const scanLine = smoothstep(0, scanWidth, abs(uvY.sub(uScanProgress)));
        const redOverlay = vec3(0.412, 0.788, 0.784).mul(oneMinus(scanLine)).mul(0.4); // #69C9C8
        const withScan = mix(
          scenePassColor,
          add(scenePassColor, redOverlay),
          smoothstep(0.9, 1.0, oneMinus(scanLine)),
        );
        postProcessing.outputNode = withScan.add(bloomPass);

        // ── Input handlers ────────────────────────────────────────────
        const pointer = new THREE.Vector2(0, 0);
        const onMouseMove = (e: MouseEvent) => {
          pointer.set(
            (e.clientX / window.innerWidth) * 2 - 1,
            -((e.clientY / window.innerHeight) * 2 - 1),
          );
          uPointer.value = pointer;
        };
        window.addEventListener('mousemove', onMouseMove);

        const onResize = () => {
          const w = window.innerWidth;
          const h = window.innerHeight;
          renderer.setSize(w, h);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          const [s1, s2] = computeScale(w, h, camera);
          mesh.scale.set(s1 * scaleFactor, s2 * scaleFactor, 1);
        };
        window.addEventListener('resize', onResize);

        cleanupFns.push(
          () => window.removeEventListener('mousemove', onMouseMove),
          () => window.removeEventListener('resize', onResize),
        );

        // ── Render loop ───────────────────────────────────────────────
        const clock = new THREE.Clock();
        const animate = () => {
          frameId = requestAnimationFrame(animate);
          const t = clock.getElapsedTime();
          uProgress.value = Math.sin(t * 0.5) * 0.5 + 0.5;
          uScanProgress.value = Math.sin(t * 0.5) * 0.5 + 0.5;
          material.opacity = THREE.MathUtils.lerp(material.opacity, 1, 0.07);
          postProcessing.renderAsync();
        };
        animate();
      } catch (err) {
        console.error('[HeroFuturistic] WebGPU init failed:', err);
      }
    };

    init();

    return () => {
      mounted = false;
      cancelAnimationFrame(frameId);
      cleanupFns.forEach(fn => fn());
      renderer?.dispose();
    };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        height: '100svh',
        minHeight: '100vh',
        background: '#000',
        overflow: 'hidden',
      }}
    >
      {/* Text overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 60,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 2.5rem',
          textTransform: 'uppercase',
        }}
      >
        <div className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold font-display" style={{ letterSpacing: '0.04em' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.35em',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            {titleWords.map((word, index) => (
              <div
                key={index}
                className={index < visibleWords ? 'fade-in' : ''}
                style={{
                  animationDelay: `${index * 0.13 + (delays[index] || 0)}s`,
                  opacity: index < visibleWords ? undefined : 0,
                }}
              >
                {word}
              </div>
            ))}
          </div>
        </div>

        <div
          className="text-xs sm:text-sm md:text-xl xl:text-2xl 2xl:text-3xl font-bold font-display"
          style={{ marginTop: '0.5rem', color: 'white', textAlign: 'center', letterSpacing: '0.12em' }}
        >
          <div
            className={subtitleVisible ? 'fade-in-subtitle' : ''}
            style={{
              animationDelay: `${titleWords.length * 0.13 + 0.2 + subtitleDelay}s`,
              opacity: subtitleVisible ? undefined : 0,
            }}
          >
            {eyebrow}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button className="explore-btn" style={{ animationDelay: '2.2s' }}>
        Scroll para explorar
        <span className="explore-arrow">
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="arrow-svg"
          >
            <path d="M11 5V17" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M6 12L11 17L16 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      {/* Raw WebGPU canvas — no R3F (R3F v8 can't await async gl factories) */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
