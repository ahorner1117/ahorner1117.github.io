"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const WORD = "FASTTRACK";
const LETTER_SIZE = 16;
const LETTER_DEPTH = 3.2;
const ITALIC_SHEAR = 0.24;
const FOG_DENSITY = 0.0032;
const NIGHT = "#030504";

// Letters rise out of the water one by one, then idle with a faint bob
function Wordmark({ active, reducedMotion }) {
	const font = useLoader(FontLoader, "/fasttrack/fasttrack-type.json");
	const groupRefs = useRef([]);
	const startedAt = useRef(null);

	const letters = useMemo(() => {
		const shear = new THREE.Matrix4().set(1, ITALIC_SHEAR, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
		const scale = LETTER_SIZE / font.data.resolution;
		let x = 0;
		const list = WORD.split("").map((char) => {
			const geometry = new TextGeometry(char, {
				font,
				size: LETTER_SIZE,
				depth: LETTER_DEPTH,
				curveSegments: 6,
				bevelEnabled: true,
				bevelThickness: 0.35,
				bevelSize: 0.22,
				bevelSegments: 3
			});
			geometry.applyMatrix4(shear);
			const letter = { geometry, x };
			x += font.data.glyphs[char].ha * scale - 0.6;
			return letter;
		});
		const offset = x / 2;
		list.forEach((letter) => (letter.x -= offset));
		return list;
	}, [font]);

	useEffect(() => () => letters.forEach((l) => l.geometry.dispose()), [letters]);

	const material = useMemo(
		() =>
			new THREE.MeshStandardMaterial({
				color: "#ffffff",
				roughness: 0.22,
				metalness: 0.55,
				envMapIntensity: 1.6,
				emissive: "#9aa8a0",
				emissiveIntensity: 0.18
			}),
		[]
	);

	useFrame(({ clock }) => {
		if (!active) return;
		if (startedAt.current === null) startedAt.current = clock.elapsedTime;
		const t = clock.elapsedTime - startedAt.current;

		groupRefs.current.forEach((group, i) => {
			if (!group) return;
			const rise = reducedMotion ? 1 : THREE.MathUtils.clamp((t - i * 0.09) / 1.1, 0, 1);
			const eased = 1 - Math.pow(1 - rise, 4);
			const bob = reducedMotion ? 0 : Math.sin(t * 1.2 + i * 0.6) * 0.18 * rise;
			group.position.y = THREE.MathUtils.lerp(-LETTER_SIZE * 1.5, 0.8, eased) + bob;
		});
	});

	return letters.map((letter, i) => (
		<group
			key={i}
			ref={(el) => (groupRefs.current[i] = el)}
			position={[letter.x, -LETTER_SIZE * 1.5, 0]}
		>
			<mesh geometry={letter.geometry} material={material} />
		</group>
	));
}

// Head- and tail-light streaks racing past in two lanes, mirrored by the water
function LightStreaks({ reducedMotion }) {
	const coreRef = useRef(null);
	const haloRef = useRef(null);
	const COUNT = 26;

	const streaks = useMemo(() => {
		const rand = (min, max) => min + Math.random() * (max - min);
		return Array.from({ length: COUNT }, (_, i) => {
			const front = i % 2 === 0;
			return {
				x: rand(-260, 260),
				y: rand(0.6, 2.6),
				z: front ? rand(16, 46) : rand(-30, -70),
				length: rand(14, 46),
				speed: rand(70, 150) * (front ? 1 : -1),
				color: new THREE.Color(front ? "#ff2a3c" : i % 4 === 1 ? "#39f58f" : "#e6fff0")
			};
		});
	}, []);

	useEffect(() => {
		[coreRef.current, haloRef.current].forEach((mesh, layer) => {
			streaks.forEach((s, i) => {
				const c = s.color.clone().multiplyScalar(layer === 0 ? 2.2 : 0.35);
				mesh.setColorAt(i, c);
			});
			mesh.instanceColor.needsUpdate = true;
		});
	}, [streaks]);

	const dummy = useMemo(() => new THREE.Object3D(), []);

	useFrame((_, delta) => {
		const dt = Math.min(delta, 0.05) * (reducedMotion ? 0.25 : 1);
		streaks.forEach((s, i) => {
			s.x += s.speed * dt;
			if (s.x > 280) s.x = -280;
			if (s.x < -280) s.x = 280;

			dummy.position.set(s.x, s.y, s.z);
			dummy.scale.set(s.length, 0.22, 0.22);
			dummy.updateMatrix();
			coreRef.current.setMatrixAt(i, dummy.matrix);

			dummy.scale.set(s.length * 1.25, 1.4, 1.4);
			dummy.updateMatrix();
			haloRef.current.setMatrixAt(i, dummy.matrix);
		});
		coreRef.current.instanceMatrix.needsUpdate = true;
		haloRef.current.instanceMatrix.needsUpdate = true;
	});

	const [coreMaterial, haloMaterial] = useMemo(
		() =>
			[1, 0.5].map(
				(opacity) =>
					new THREE.MeshBasicMaterial({
						transparent: true,
						opacity,
						blending: THREE.AdditiveBlending,
						depthWrite: false,
						toneMapped: false
					})
			),
		[]
	);

	return (
		<>
			<instancedMesh ref={coreRef} args={[undefined, undefined, COUNT]} material={coreMaterial}>
				<boxGeometry args={[1, 1, 1]} />
			</instancedMesh>
			<instancedMesh ref={haloRef} args={[undefined, undefined, COUNT]} material={haloMaterial}>
				<boxGeometry args={[1, 1, 1]} />
			</instancedMesh>
		</>
	);
}

// Distant skyline glow on the horizon so the water has something to reflect
function HorizonGlow() {
	const material = useMemo(
		() =>
			new THREE.ShaderMaterial({
				transparent: true,
				depthWrite: false,
				fog: false,
				uniforms: {},
				vertexShader: `
					varying vec2 vUv;
					void main() {
						vUv = uv;
						gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
					}
				`,
				fragmentShader: `
					varying vec2 vUv;
					void main() {
						float fadeY = smoothstep(0.0, 0.05, vUv.y) * pow(1.0 - vUv.y, 2.2);
						float fadeX = smoothstep(0.0, 0.35, vUv.x) * smoothstep(1.0, 0.65, vUv.x);
						vec3 green = vec3(0.16, 0.86, 0.48);
						vec3 red = vec3(0.85, 0.12, 0.2);
						vec3 color = mix(red, green, smoothstep(0.2, 0.8, vUv.x));
						gl_FragColor = vec4(color, fadeY * fadeX * 0.42);
					}
				`
			}),
		[]
	);

	return (
		<mesh position={[0, 70, -520]} material={material}>
			<planeGeometry args={[1800, 160]} />
		</mesh>
	);
}

function Ocean({ reducedMotion }) {
	const normals = useLoader(THREE.TextureLoader, "/fasttrack/waternormals.jpg");
	const { size } = useThree();

	const water = useMemo(() => {
		normals.wrapS = normals.wrapT = THREE.RepeatWrapping;
		const resolution = size.width < 768 ? 256 : 512;
		const mesh = new Water(new THREE.PlaneGeometry(5000, 5000), {
			textureWidth: resolution,
			textureHeight: resolution,
			waterNormals: normals,
			sunDirection: new THREE.Vector3(0.2, 0.6, -1).normalize(),
			sunColor: "#8dffbf",
			waterColor: "#040806",
			distortionScale: 2.6,
			fog: true
		});
		mesh.rotation.x = -Math.PI / 2;
		return mesh;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [normals]);

	useEffect(() => () => water.geometry.dispose(), [water]);

	useFrame((_, delta) => {
		water.material.uniforms.time.value += Math.min(delta, 0.05) * (reducedMotion ? 0.15 : 0.55);
	});

	return <primitive object={water} />;
}

// Procedural studio reflections so the chrome letters have something to mirror
function StudioEnvironment() {
	const { gl, scene } = useThree();
	useEffect(() => {
		const pmrem = new THREE.PMREMGenerator(gl);
		const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
		scene.environment = env;
		scene.environmentIntensity = 0.7;
		return () => {
			scene.environment = null;
			env.dispose();
			pmrem.dispose();
		};
	}, [gl, scene]);
	return null;
}

// Mouse parallax plus a scroll-driven dolly; pulls back on narrow screens so the word fits
function CameraRig({ progressRef, reducedMotion }) {
	const { camera, size, scene } = useThree();
	const pointer = useRef({ x: 0, y: 0 });
	const target = useMemo(() => new THREE.Vector3(0, 7, 0), []);

	useEffect(() => {
		const onMove = (e) => {
			pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
			pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
		};
		window.addEventListener("pointermove", onMove, { passive: true });
		return () => window.removeEventListener("pointermove", onMove);
	}, []);

	useFrame(() => {
		const aspect = size.width / size.height;
		// Narrow screens pull the camera back so the word fits; thin the fog to match so it doesn't dim
		const fit = Math.max(1, 1.6 / aspect);
		if (scene.fog) scene.fog.density = FOG_DENSITY / fit;
		const progress = progressRef.current;
		const baseZ = (reducedMotion ? 150 : THREE.MathUtils.lerp(188, 132, progress)) * fit;
		const px = reducedMotion ? 0 : pointer.current.x * 9;
		const py = reducedMotion ? 0 : -pointer.current.y * 3;

		camera.position.x += (px - camera.position.x) * 0.04;
		camera.position.y += (12 + py - camera.position.y) * 0.04;
		camera.position.z += (baseZ - camera.position.z) * 0.06;
		camera.lookAt(target);
	});

	return null;
}

export default function LaunchScene({ active, progressRef, reducedMotion }) {
	return (
		<Canvas
			frameloop={active ? "always" : "never"}
			dpr={[1, 1.6]}
			camera={{ fov: 35, near: 1, far: 3000, position: [0, 12, 188] }}
			gl={{ antialias: true, powerPreference: "high-performance" }}
			onCreated={({ gl }) => {
				gl.toneMapping = THREE.ACESFilmicToneMapping;
				gl.toneMappingExposure = 1.05;
			}}
		>
			<color attach="background" args={[NIGHT]} />
			<fogExp2 attach="fog" args={[NIGHT, FOG_DENSITY]} />

			<ambientLight intensity={0.35} />
			<directionalLight position={[-20, 40, 90]} intensity={2.6} />
			<pointLight position={[-70, 10, -30]} color="#ff2a3c" intensity={2.4} distance={260} decay={1} />
			<pointLight position={[70, 10, -30]} color="#39f58f" intensity={2.4} distance={260} decay={1} />

			<StudioEnvironment />
			<HorizonGlow />
			<LightStreaks reducedMotion={reducedMotion} />
			<Suspense fallback={null}>
				<Ocean reducedMotion={reducedMotion} />
				<Wordmark active={active} reducedMotion={reducedMotion} />
			</Suspense>
			<CameraRig progressRef={progressRef} reducedMotion={reducedMotion} />
		</Canvas>
	);
}
