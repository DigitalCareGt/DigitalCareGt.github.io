import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';


// node_id30 = claro (white), node_id36 = oscuro (black)
const HIDE_FOR_DARK  = 'node_id36_Material_59_0';
const HIDE_FOR_LIGHT = 'node_id30_Material_51_0';

// Compute bounding box and center using ONLY visible meshes (skips hidden ones)
function visibleBounds(root) {
  const box = new THREE.Box3();
  root.updateMatrixWorld(true);
  root.traverse((child) => {
    if (!child.isMesh || !child.visible) return;
    const geomBox = new THREE.Box3().setFromBufferAttribute(
      child.geometry.attributes.position
    );
    geomBox.applyMatrix4(child.matrixWorld);
    box.union(geomBox);
  });
  const center  = box.getCenter(new THREE.Vector3());
  const size    = box.getSize(new THREE.Vector3());
  const maxDim  = Math.max(size.x, size.y, size.z);
  return { center, maxDim };
}

function GamepadScene({ isDark, mouseRef, hoveredRef, isDraggingRef, userRotRef }) {
  const { scene } = useGLTF('/Nologo.glb');
  const groupRef = useRef();

  const blackData = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((obj) => { if (obj.name === HIDE_FOR_LIGHT) obj.visible = false; });
    const { center, maxDim } = visibleBounds(c);
    return { clone: c, center, maxDim };
  }, [scene]);

  const whiteData = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((obj) => { if (obj.name === HIDE_FOR_DARK) obj.visible = false; });
    const { center, maxDim } = visibleBounds(c);
    return { clone: c, center, maxDim };
  }, [scene]);

  // Unified scale: use black controller's maxDim so white matches black's size
  const modelScale = blackData.maxDim > 0 ? 1.65 / blackData.maxDim : 1;

  const { clone, center } = isDark ? whiteData : blackData;

  useFrame((state) => {
    if (!groupRef.current) return;

    if (isDraggingRef.current) {
      groupRef.current.rotation.y = userRotRef.current.y;
      groupRef.current.rotation.x = userRotRef.current.x;
    } else {
      userRotRef.current.y = groupRef.current.rotation.y;
      userRotRef.current.x = groupRef.current.rotation.x;

      if (hoveredRef.current) {
        const targetY = mouseRef.current.x * 0.55;
        const targetX = -mouseRef.current.y * 0.28;
        groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.07;
        groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.07;
      } else {
        const idleY = Math.sin(state.clock.elapsedTime * 0.4) * 0.25 - 0.3;
        const idleX = Math.sin(state.clock.elapsedTime * 0.25) * 0.05 - 0.10;
        groupRef.current.rotation.y += (idleY - groupRef.current.rotation.y) * 0.05;
        groupRef.current.rotation.x += (idleX - groupRef.current.rotation.x) * 0.05;
      }
    }
  });

  return (
    <group ref={groupRef} scale={modelScale} position={[0.15, 0, 0.08]}>
      {/* Manually center using each model's own visible bounding box */}
      <primitive object={clone} position={[-center.x, -center.y, -center.z]} />
    </group>
  );
}

function GamepadScrollFeature({ className = '', isDark = false }) {
  const mouseRef      = useRef({ x: 0, y: 0 });
  const hoveredRef    = useRef(false);
  const isDraggingRef = useRef(false);
  const lastPtrRef    = useRef({ x: 0, y: 0 });
  const userRotRef    = useRef({ y: -0.3, x: -0.10 });

  const { scrollYProgress } = useScroll();
  const y     = useTransform(scrollYProgress, [0, 0.22, 0.44], [-20, 14, 40]);
  const scale = useTransform(scrollYProgress, [0, 0.22, 0.44], [1, 1.012, 1]);

  function handlePointerDown(e) {
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    lastPtrRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastPtrRef.current.x;
    const dy = e.clientY - lastPtrRef.current.y;
    userRotRef.current.y += dx * 0.012;
    userRotRef.current.x = Math.max(-0.8, Math.min(0.8, userRotRef.current.x + dy * 0.01));
    lastPtrRef.current = { x: e.clientX, y: e.clientY };
  }

  function handlePointerUp() {
    isDraggingRef.current = false;
  }

  return (
    <div
      id="gamepad"
      className={`relative min-h-[240px] overflow-visible sm:min-h-[360px] md:min-h-[440px] lg:min-h-[560px] cursor-grab active:cursor-grabbing ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerEnter={() => { hoveredRef.current = true; }}
      onPointerLeave={() => { hoveredRef.current = false; isDraggingRef.current = false; }}
    >
      <div className="absolute left-[8%] top-[11%] h-[72%] w-[78%] rounded-full bg-care-50/70 blur-3xl dark:hidden" />

      <motion.div style={{ y, scale }} className="absolute -inset-x-[5rem] -inset-y-6 sm:-inset-x-[10rem] sm:-inset-y-12 md:-inset-x-[14rem] md:-inset-y-16 lg:-inset-x-[14rem] lg:-inset-y-16 xl:-inset-x-[8rem] xl:-inset-y-12">
        <Canvas
          camera={{ position: [0, 0.4, 3.5], fov: 45 }}
          style={{ width: '100%', height: '100%' }}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[4, 6, 4]} intensity={1.4} castShadow />
          <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#a8c8ff" />

          <Suspense fallback={null}>
            <GamepadScene
              isDark={isDark}
              mouseRef={mouseRef}
              hoveredRef={hoveredRef}
              isDraggingRef={isDraggingRef}
              userRotRef={userRotRef}
            />
            <ContactShadows
              position={[0, -1.4, 0]}
              opacity={0.18}
              scale={6}
              blur={2.5}
            />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </motion.div>
    </div>
  );
}

useGLTF.preload('/Nologo.glb');

export default GamepadScrollFeature;
