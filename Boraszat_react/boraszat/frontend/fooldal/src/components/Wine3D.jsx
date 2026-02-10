import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Float, useTexture, Sparkles, Center } from '@react-three/drei';
import * as THREE from 'three';

// --- A TÖKÉLETES ÜVEG FORMA ---
function RealisticBottle(props) {
  const mesh = useRef();
  
  // Üveg profil generálása (ez változatlan, mert tökéletes volt)
  const points = useMemo(() => {
    const p = [];
    p.push(new THREE.Vector2(0, 0));
    p.push(new THREE.Vector2(0.35, 0)); 
    p.push(new THREE.Vector2(0.35, 0.2));
    p.push(new THREE.Vector2(0.35, 1.8)); 
    const shoulderStart = new THREE.Vector2(0.35, 1.8);
    const neckStart = new THREE.Vector2(0.12, 2.4);
    for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        const x = THREE.MathUtils.lerp(0.35, 0.12, t * t);
        const y = THREE.MathUtils.lerp(1.8, 2.4, t);
        p.push(new THREE.Vector2(x, y));
    }
    p.push(new THREE.Vector2(0.12, 3.2));
    p.push(new THREE.Vector2(0.14, 3.25));
    p.push(new THREE.Vector2(0.14, 3.35));
    p.push(new THREE.Vector2(0.10, 3.35));
    return p;
  }, []);

  const labelTexture = useTexture('/images/cimke.jpg', (texture) => {
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
  });

  useFrame((state) => {
    mesh.current.rotation.y += 0.003; 
    mesh.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    transmission: 1,
    opacity: 1,
    metalness: 0,
    roughness: 0.1,
    ior: 1.5,
    thickness: 1.5,
    attenuationColor: "#4a0404",
    attenuationDistance: 0.8,
    envMapIntensity: 2,
    side: THREE.DoubleSide
  });

  return (
    <group ref={mesh} {...props}>
        <mesh>
            <latheGeometry args={[points, 64]} />
            <primitive object={glassMaterial} />
        </mesh>
        <mesh scale={[0.92, 0.95, 0.92]} position={[0, 0.1, 0]}>
            <latheGeometry args={[points, 32]} />
            <meshStandardMaterial color="#220000" roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.0, 0]} rotation={[0, -Math.PI/2, 0]}>
            <cylinderGeometry args={[0.36, 0.36, 1.2, 64, 1, true, 0, Math.PI]} />
            <meshStandardMaterial map={labelTexture} transparent side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 2.8, 0]}>
            <cylinderGeometry args={[0.125, 0.125, 0.9, 32]} />
            <meshStandardMaterial color="#722f37" metalness={0.8} roughness={0.2} />
        </mesh>
    </group>
  );
}

// Külön komponens a méretezéshez, hogy használhassuk a useThree hook-ot
function ScaledScene() {
    const { viewport } = useThree();
    
    // DINAMIKUS SKÁLAZÁS:
    // Ha a képernyő keskeny (mobil), kisebbre vesszük.
    // Ha széles, nagyobbra.
    // viewport.width / 3  -> ez egy jó arányszám
    const scale = Math.min(1.5, Math.max(0.8, viewport.width / 4));

    return (
        <Center>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
                <RealisticBottle scale={scale} /> 
            </Float>
        </Center>
    );
}

// --- FŐ KOMPONENS ---
export default function Wine3D() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px' }}> {/* Biztosítjuk a magasságot */}
      <Canvas 
        shadows 
        dpr={[1, 2]} 
        // KAMERA TÁVOLÍTÁSA: 
        // position Z-t 5-ről 8-ra növeltem. Így messzebb vagyunk, több látszik.
        // fov: 35 (kicsit szűkebb, mozis hatás)
        camera={{ position: [0, 0, 8], fov: 35 }} 
      >
        <color attach="background" args={['#1a1a1a']} />
        
        <ambientLight intensity={0.5} />
        <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={10} castShadow color="#fff0dd" />
        <spotLight position={[-5, 2, -5]} angle={0.5} intensity={15} color="#4455ff" />
        <pointLight position={[-5, 0, 5]} intensity={2} color="#ffaaaa" />

        <Sparkles count={80} scale={6} size={3} speed={0.4} opacity={0.4} color="#ffd700" />
        <Environment preset="city" />

        {/* Itt hívjuk meg a méretezett jelenetet */}
        <ScaledScene />

        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.5} />
      </Canvas>
    </div>
  );
}