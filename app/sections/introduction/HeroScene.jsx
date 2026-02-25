"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";

// Compact 3D simplex noise for GLSL (Ashima Arts, public domain)
const simplexNoise3D = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

const vertexShader = `
${simplexNoise3D}

uniform float uTime;
uniform float uNoiseStrength;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);

  float noise = snoise(position * 1.5 + uTime * 0.3);
  vec3 displaced = position + normal * noise * uNoiseStrength;

  vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
  vWorldPosition = worldPos.xyz;

  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const fragmentShader = `
uniform vec3 uColor;
uniform vec3 uRimColor;
uniform float uRimPower;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  float rim = 1.0 - max(dot(viewDir, normalize(vNormal)), 0.0);
  rim = pow(rim, uRimPower);

  vec3 color = mix(uColor, uRimColor, rim);
  float ambient = 0.3 + 0.7 * rim;

  gl_FragColor = vec4(color * ambient + uRimColor * rim * 0.6, 0.85);
}
`;

const DARK_BASE = new THREE.Color("#FF0080");
const DARK_RIM = new THREE.Color("#3182ce");
const LIGHT_BASE = new THREE.Color("#232332");
const LIGHT_RIM = new THREE.Color("#FF0080");

function MorphingTorusKnot({ darkMode, reducedMotion, isMobile }) {
	const meshRef = useRef();
	const materialRef = useRef();
	const { pointer } = useThree();

	const geometry = useMemo(() => {
		const segments = isMobile ? [64, 16] : [128, 32];
		return new THREE.TorusKnotGeometry(1, 0.35, ...segments);
	}, [isMobile]);

	const uniforms = useMemo(
		() => ({
			uTime: { value: 0 },
			uNoiseStrength: { value: reducedMotion ? 0 : 0.15 },
			uColor: { value: DARK_BASE.clone() },
			uRimColor: { value: DARK_RIM.clone() },
			uRimPower: { value: 2.5 }
		}),
		[]
	);

	useFrame((state, delta) => {
		if (!meshRef.current || !materialRef.current) return;

		const mat = materialRef.current;
		mat.uniforms.uTime.value += delta;

		// Smooth theme color transitions
		const targetBase = darkMode ? DARK_BASE : LIGHT_BASE;
		const targetRim = darkMode ? DARK_RIM : LIGHT_RIM;
		mat.uniforms.uColor.value.lerp(targetBase, delta * 3);
		mat.uniforms.uRimColor.value.lerp(targetRim, delta * 3);
		mat.uniforms.uRimPower.value +=
			((darkMode ? 2.5 : 3.0) - mat.uniforms.uRimPower.value) * delta * 3;

		// Base rotation
		const rotSpeed = reducedMotion ? 0.0005 : 0.003;
		meshRef.current.rotation.y += rotSpeed;
		meshRef.current.rotation.x += rotSpeed * 0.3;

		// Mouse influence
		if (!reducedMotion) {
			meshRef.current.rotation.y += (pointer.x * 0.5 - meshRef.current.rotation.y) * 0.02;
			meshRef.current.rotation.x += (pointer.y * 0.3 - meshRef.current.rotation.x) * 0.02;
		}
	});

	return (
		<mesh ref={meshRef} geometry={geometry}>
			<shaderMaterial
				ref={materialRef}
				vertexShader={vertexShader}
				fragmentShader={fragmentShader}
				uniforms={uniforms}
				transparent
			/>
		</mesh>
	);
}

export function HeroScene({ isMobile, className }) {
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [reducedMotion, setReducedMotion] = useState(false);

	useEffect(() => {
		setMounted(true);
		setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
	}, []);

	if (!mounted) return <div className={className} />;

	const isDark = theme === "dark";

	return (
		<div className={className} aria-hidden="true" role="presentation">
			<Canvas
				camera={{ position: [0, 0, 4], fov: 50 }}
				dpr={isMobile ? 1 : Math.min(window.devicePixelRatio, 2)}
				gl={{
					antialias: !isMobile,
					alpha: true,
					powerPreference: "high-performance"
				}}
				style={{ background: "transparent" }}
			>
				<ambientLight intensity={0.15} />
				<directionalLight position={[5, 5, 5]} intensity={0.4} />
				<Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
					<MorphingTorusKnot darkMode={isDark} reducedMotion={reducedMotion} isMobile={isMobile} />
				</Float>
			</Canvas>
		</div>
	);
}
