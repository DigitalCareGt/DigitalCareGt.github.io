import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

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
  const center = box.getCenter(new THREE.Vector3());
  const size   = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  return { center, maxDim };
}

function LaptopScene({ mouseRef, hoveredRef, isDraggingRef, userRotRef }) {
  const { scene } = useGLTF('/laptop.glb');
  const groupRef  = useRef();

  const { clone, center, modelScale } = useMemo(() => {
    const c = scene.clone(true);
    const { center, maxDim } = visibleBounds(c);
    return { clone: c, center, modelScale: maxDim > 0 ? 1.5 / maxDim : 1 };
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current) return;
    if (isDraggingRef.current) {
      groupRef.current.rotation.y = userRotRef.current.y;
      groupRef.current.rotation.x = userRotRef.current.x;
    } else {
      userRotRef.current.y = groupRef.current.rotation.y;
      userRotRef.current.x = groupRef.current.rotation.x;
      if (hoveredRef.current) {
        const targetY = mouseRef.current.x * 0.45;
        const targetX = -mouseRef.current.y * 0.20;
        groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.07;
        groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.07;
      } else {
        const idleY = Math.sin(state.clock.elapsedTime * 0.35) * 0.20 - 0.15;
        const idleX = Math.sin(state.clock.elapsedTime * 0.22) * 0.04 - 0.08;
        groupRef.current.rotation.y += (idleY - groupRef.current.rotation.y) * 0.04;
        groupRef.current.rotation.x += (idleX - groupRef.current.rotation.x) * 0.04;
      }
    }
  });

  return (
    <group ref={groupRef} scale={modelScale}>
      <primitive object={clone} position={[-center.x, -center.y, -center.z]} />
    </group>
  );
}

function LaptopScrollFeature({ className = '' }) {
  const mouseRef      = useRef({ x: 0, y: 0 });
  const hoveredRef    = useRef(false);
  const isDraggingRef = useRef(false);
  const lastPtrRef    = useRef({ x: 0, y: 0 });
  const userRotRef    = useRef({ y: -0.15, x: -0.08 });

  function handlePointerDown(e) {
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    lastPtrRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
    mouseRef.current.y = ((e.clientY - rect.top)  / rect.height) * 2 - 1;
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastPtrRef.current.x;
    const dy = e.clientY - lastPtrRef.current.y;
    userRotRef.current.y += dx * 0.012;
    userRotRef.current.x  = Math.max(-0.7, Math.min(0.7, userRotRef.current.x + dy * 0.01));
    lastPtrRef.current = { x: e.clientX, y: e.clientY };
  }

  function handlePointerUp() { isDraggingRef.current = false; }

  return (
    <div
      className={`relative h-64 w-full cursor-grab active:cursor-grabbing md:h-80 ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerEnter={() => { hoveredRef.current = true; }}
      onPointerLeave={() => { hoveredRef.current = false; isDraggingRef.current = false; }}
    >
      <Canvas
        camera={{ position: [0, 0.3, 3.2], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 4]}  intensity={1.3} castShadow />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#a8c8ff" />
        <Suspense fallback={null}>
          <LaptopScene
            mouseRef={mouseRef}
            hoveredRef={hoveredRef}
            isDraggingRef={isDraggingRef}
            userRotRef={userRotRef}
          />
          <ContactShadows position={[0, -0.9, 0]} opacity={0.15} scale={4} blur={2} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/laptop.glb');
export default LaptopScrollFeature;
