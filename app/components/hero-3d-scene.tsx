"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { ExtrudeGeometry, Shape, ShapeGeometry, MeshBasicMaterial, MeshStandardMaterial, SRGBColorSpace, TextureLoader, Vector3, type Group } from "three";
import type { MotionValue } from "motion/react";
import { motionTokens } from "../lib/motion-tokens";
import { useThemePreference } from "./theme-preferences";
import type { ResolvedTheme } from "../lib/theme";

export interface HeroSurface { slug: string; title: string; kind: string; src: string; width: number; height: number }
interface Props {
  surfaces: HeroSurface[];
  pointerX: MotionValue<number>; pointerY: MotionValue<number>; progress: MotionValue<number>;
  active: boolean; onReady: () => void; onFailure: () => void;
}

function roundedSurface(width: number, height: number, radius: number) {
  const x = -width / 2, y = -height / 2;
  return new Shape().moveTo(x + radius, y).lineTo(x + width - radius, y)
    .quadraticCurveTo(x + width, y, x + width, y + radius).lineTo(x + width, y + height - radius)
    .quadraticCurveTo(x + width, y + height, x + width - radius, y + height).lineTo(x + radius, y + height)
    .quadraticCurveTo(x, y + height, x, y + height - radius).lineTo(x, y + radius)
    .quadraticCurveTo(x, y, x + radius, y);
}

function ProjectSurfaces({ surfaces, theme, active }: Pick<Props, "surfaces" | "active"> & { theme: ResolvedTheme }) {
  const { invalidate, gl } = useThree();
  const panels = useRef<(Group | null)[]>([]);
  const elapsed = useRef(0);
  const textures = useLoader(TextureLoader, surfaces.map(surface => surface.src));
  const resources = useMemo(() => ({
    panels: surfaces.map((surface, index) => {
      const width = index === 0 ? motionTokens.camera.backWidth : motionTokens.camera.frontWidth;
      const height = width * surface.height / surface.width;
      const radius = motionTokens.camera.cornerRadius;
      const image = new ShapeGeometry(roundedSurface(width, height, radius), 12);
      const positions = image.getAttribute("position"), uv = image.getAttribute("uv");
      for (let vertex = 0; vertex < positions.count; vertex++) {
        uv.setXY(vertex, (positions.getX(vertex) + width / 2) / width, (positions.getY(vertex) + height / 2) / height);
      }
      const board = new ExtrudeGeometry(roundedSurface(width + .14, height + .14, radius + .07), {
        depth: .13, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .025, bevelThickness: .02, curveSegments: 12,
      });
      return { image, board };
    }),
    border: new MeshStandardMaterial({ color: "#f6f5f0", roughness: 0.65, metalness: 0.05 }),
    images: textures.map(texture => new MeshBasicMaterial({ map: texture, toneMapped: false })),
  }), [textures, surfaces]);
  useEffect(() => {
    textures.forEach(texture => { texture.colorSpace = SRGBColorSpace; texture.needsUpdate = true; });
    return () => {
      resources.panels.forEach(panel => { panel.image.dispose(); panel.board.dispose(); });
      resources.border.dispose();
      resources.images.forEach(material => material.dispose());
      textures.forEach(texture => texture.dispose());
      useLoader.clear(TextureLoader, surfaces.map(surface => surface.src));
    };
  }, [textures, resources, surfaces]);
  useEffect(() => {
    resources.border.setValues({
      color: theme === "dark" ? "#202d40" : "#ffffff",
      roughness: theme === "dark" ? 0.8 : 0.65,
    });
    invalidate();
  }, [theme, resources, invalidate]);
  useFrame((_, delta) => {
    if (!active) return;
    const duration = motionTokens.depth.heroUnfold;
    const total = duration + (surfaces.length - 1) * motionTokens.depth.heroStagger;
    elapsed.current = Math.min(total, elapsed.current + Math.min(delta, 0.05));
    panels.current.forEach((panel, index) => {
      if (!panel) return;
      const t = Math.max(0, Math.min(1, (elapsed.current - index * motionTokens.depth.heroStagger) / duration));
      const unfold = 1 - Math.pow(1 - t, 3);
      const remaining = 1 - unfold;
      const back = index === 0;
      panel.position.set((back ? -0.45 : 0.48) * unfold, (back ? 0.42 : -0.48) - remaining * 0.45, (back ? -0.3 : 0.45) - remaining * 0.8);
      panel.rotation.set((back ? 0.04 : -0.03) + remaining * 0.24, (back ? -0.13 : 0.1) + remaining * (back ? -0.22 : 0.22), (back ? 0.07 : -0.07) * unfold);
    });
    const entering = elapsed.current < total;
    gl.domElement.setAttribute("data-intro-state", entering ? "unfolding" : "settled");
    if (entering) invalidate();
  });
  return <group dispose={null}>{surfaces.map((surface, index) => {
    return <group ref={node => { panels.current[index] = node; }} key={surface.slug} position={index === 0 ? [-0.45, 0.42, -0.3] : [0.48, -0.48, 0.45]}
      rotation={index === 0 ? [0.04, -0.13, 0.07] : [-0.03, 0.1, -0.07]}>
      <mesh geometry={resources.panels[index].board} material={resources.border} position={[0, 0, -.05]} />
      <mesh geometry={resources.panels[index].image} material={resources.images[index]} position={[0, 0, .106]} />
    </group>;
  })}</group>;
}

function ContextGuard({ onFailure }: Pick<Props, "onFailure">) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    function lost(event: Event) { event.preventDefault(); onFailure(); }
    canvas.addEventListener("webglcontextlost", lost);
    if (gl.getContext().isContextLost()) onFailure();
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onFailure]);
  return null;
}

function CameraResponse({ pointerX, pointerY, progress, active, onReady }: Omit<Props, "surfaces">) {
  const { camera, invalidate, gl, scene } = useThree();
  const target = useMemo(() => new Vector3(), []);
  const started = useRef(false);
  const frames = useRef(0);
  useEffect(() => {
    gl.domElement.setAttribute("data-render-state", active ? "moving" : "paused");
    if (!active) return;
    const update = () => invalidate();
    const unsubscribe = [pointerX, pointerY, progress].map(value => value.on("change", update));
    invalidate();
    return () => unsubscribe.forEach(stop => stop());
  }, [active, pointerX, pointerY, progress, invalidate, gl]);
  useFrame((_, delta) => {
    if (!active) return;
    const p = Math.max(0, Math.min(1, progress.get()));
    const distance = motionTokens.camera.distance + p * motionTokens.camera.scrollTravel;
    const response = Math.tan(motionTokens.camera.pointerAngle * Math.PI / 180) * motionTokens.camera.distance * (1 - p);
    target.set(0.5 * (1 - p) + Math.max(-1, Math.min(1, pointerX.get())) * response, 0.24 * (1 - p) - Math.max(-1, Math.min(1, pointerY.get())) * response, distance);
    camera.position.lerp(target, 1 - Math.exp(-motionTokens.camera.settleSpeed * Math.min(delta, 0.05)));
    const settling = camera.position.distanceToSquared(target) > 0.000001;
    const entering = gl.domElement.getAttribute("data-intro-state") === "unfolding";
    if (!settling) camera.position.copy(target);
    camera.lookAt(0, 0, 0);
    if (!settling && !entering && process.env.NODE_ENV === "development" && !gl.domElement.hasAttribute("data-poster")) {
      gl.render(scene, camera);
      gl.domElement.setAttribute("data-poster", gl.domElement.toDataURL("image/png"));
    }
    gl.domElement.setAttribute("data-render-frames", String(++frames.current));
    gl.domElement.setAttribute("data-render-state", settling || entering ? "moving" : "idle");
    if (!started.current) { started.current = true; queueMicrotask(onReady); }
    if (settling) invalidate();
  });
  return null;
}

export default function Hero3DScene(props: Props) {
  const { resolved } = useThemePreference();
  const dark = resolved === "dark";
  const lighting = motionTokens.lighting[dark ? "dark" : "light"];
  return <Canvas frameloop={props.active ? "demand" : "never"} dpr={[1, motionTokens.camera.maxDpr]}
    camera={{ position: [0.5, 0.24, motionTokens.camera.distance], fov: 38 }}
    gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}>
    <ContextGuard onFailure={props.onFailure} />
    <ambientLight intensity={lighting.ambient} />
    <directionalLight position={[3, 4, 5]} intensity={lighting.key} />
    <directionalLight position={[-4, 1, 2]} intensity={lighting.edge} color={dark ? "#9bbaff" : "#ffffff"} />
    <Suspense fallback={null}><ProjectSurfaces surfaces={props.surfaces} theme={resolved} active={props.active} />
      <CameraResponse {...props} /></Suspense>
  </Canvas>;
}
