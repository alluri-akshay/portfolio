"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const ivory = "#d3dfd7", dark = "#203b2e", mint = "#9ee4c2";
const smooth = (a: number) => { const t = THREE.MathUtils.clamp(a, 0, 1); return t * t * (3 - 2 * t); };

function roundedShape(w: number, h: number, r: number) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function buildRobot() {
  const root = new THREE.Group();
  const shell = new THREE.MeshPhysicalMaterial({ color: ivory, metalness: .12, roughness: .36, clearcoat: .22, clearcoatRoughness: .3 });
  const joint = new THREE.MeshStandardMaterial({ color: dark, roughness: .4, metalness: .55 });
  const olive = new THREE.MeshStandardMaterial({ color: "#527964", roughness: .48, metalness: .12, envMapIntensity: .5 });
  const seam = new THREE.MeshStandardMaterial({ color: "#769785", roughness: .56, metalness: .2 });
  const glass = new THREE.MeshPhysicalMaterial({ color: "#08130f", metalness: .18, roughness: .26, clearcoat: .7, clearcoatRoughness: .25, envMapIntensity: .22 });
  const light = new THREE.MeshBasicMaterial({ color: mint, toneMapped: false });
  const mesh = (parent: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, p: [number, number, number] = [0, 0, 0]) => {
    const m = new THREE.Mesh(geo, mat); m.position.set(...p); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
  };
  const sphere = (p: THREE.Object3D, r: number, mat: THREE.Material, at: [number, number, number], scale: [number, number, number] = [1, 1, 1]) => {
    const m = mesh(p, new THREE.SphereGeometry(r, 40, 28), mat, at); m.scale.set(...scale); return m;
  };
  const capsule = (p: THREE.Object3D, radius: number, length: number, mat: THREE.Material, at: [number, number, number]) => mesh(p, new THREE.CapsuleGeometry(radius, length, 10, 24), mat, at);
  const curve = (p: THREE.Object3D, points: THREE.Vector3[], radius: number, mat: THREE.Material) => mesh(p, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 48, radius, 8, false), mat);
  const plate = (p: THREE.Object3D, shape: THREE.Shape, depth: number, bevel: number, mat: THREE.Material, at: [number, number, number]) => {
    const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSegments: 8, steps: 1, bevelSize: bevel, bevelThickness: bevel, curveSegments: 32 });
    return mesh(p, geometry, mat, at);
  };

  // A continuous lathed shell, with real depth and panel seams following its surface.
  const profile: THREE.Vector2[] = [];
  for (let i = 0; i <= 48; i++) {
    const t = i / 48;
    profile.push(new THREE.Vector2(Math.pow(Math.sin(Math.PI * t), .62) * (.91 + .21 * t) + .44 * smooth((t - .65) / .35), -1.83 + t * 2.18));
  }
  const body = mesh(root, new THREE.LatheGeometry(profile, 80), shell); body.scale.z = .74;
  const frontZ = (x: number, y: number) => {
    const t = THREE.MathUtils.clamp((y + 1.83) / 2.18, .01, .99);
    const radius = Math.pow(Math.sin(Math.PI * t), .62) * (.91 + .21 * t) + .44 * smooth((t - .65) / .35);
    return Math.sqrt(Math.max(.001, radius * radius - x * x)) * .74 + .012;
  };
  const panelPoints = [[-.76, .13], [-.65, -.23], [-.56, -.53], [-.48, -1.15], [-.3, -1.56], [0, -1.63], [.31, -1.56], [.51, -1.12], [.65, -.5], [.73, -.12], [.72, .14]];
  curve(root, panelPoints.map(([x, y]) => new THREE.Vector3(x, y, frontZ(x, y))), .008, seam);
  const sidePanel = sphere(root, .3, joint, [-.77, -1.18, .23], [.32, 1.15, .72]); sidePanel.rotation.z = .4;
  sphere(root, .3, olive, [0, -1.76, .02], [1.4, .25, .9]);
  const collar = mesh(root, new THREE.CylinderGeometry(.39, .43, .085, 64), joint, [0, .38, 0]); collar.scale.z = .77;
  mesh(root, new THREE.CylinderGeometry(.24, .26, .3, 48), joint, [0, .55, 0]);
  mesh(root, new THREE.TorusGeometry(.245, .015, 10, 48), seam, [0, .56, 0]).rotation.x = Math.PI / 2;

  const chest = new THREE.Shape();
  chest.moveTo(-.38, .29); chest.bezierCurveTo(-.5, .31, -.5, .18, -.45, -.02);
  chest.lineTo(-.31, -.41); chest.quadraticCurveTo(-.28, -.5, 0, -.5);
  chest.quadraticCurveTo(.28, -.5, .31, -.41); chest.lineTo(.45, -.02);
  chest.bezierCurveTo(.5, .18, .5, .31, .38, .29); chest.quadraticCurveTo(0, .35, -.38, .29);
  plate(root, chest, .025, .028, seam, [0, -.35, .765]);
  plate(root, chest, .025, .018, joint, [0, -.35, .8]).scale.set(.94, .94, 1);
  const labelCanvas = document.createElement("canvas"); labelCanvas.width = 256; labelCanvas.height = 128;
  const label = labelCanvas.getContext("2d")!;
  label.fillStyle = "#eaf4ed"; label.font = "500 68px Arial"; label.textAlign = "center"; label.textBaseline = "middle"; label.fillText("AA", 128, 67);
  const labelTexture = new THREE.CanvasTexture(labelCanvas); labelTexture.colorSpace = THREE.SRGBColorSpace;
  mesh(root, new THREE.PlaneGeometry(.78, .39), new THREE.MeshBasicMaterial({ map: labelTexture, transparent: true, depthWrite: false }), [0, -.4, .858]);
  plate(root, roundedShape(.32, .065, .03), .01, .012, seam, [0, -1.12, frontZ(0, -1.12)]);
  plate(root, roundedShape(.28, .035, .016), .01, .007, light, [0, -1.12, frontZ(0, -1.12) + .025]);

  const head = new THREE.Group(); head.position.y = 1.52; head.rotation.z = -.055; root.add(head);
  const headGeometry = new RoundedBoxGeometry(2.5, 1.83, 1.08, 8, .36);
  const pos = headGeometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i);
    pos.setY(i, y + .1 * (1 - Math.pow(x / 1.25, 2)) * Math.max(0, y / .91));
  }
  headGeometry.computeVertexNormals(); mesh(head, headGeometry, shell);
  plate(head, roundedShape(2.09, 1.4, .42), .03, .025, seam, [0, -.035, .49]);
  plate(head, roundedShape(2.04, 1.35, .41), .025, .025, joint, [0, -.035, .55]);
  // Convex glass, rather than a flat screen with a painted highlight.
  const vertices: number[] = [], indices: number[] = [], rings = 24, segments = 96;
  for (let r = 0; r <= rings; r++) {
    for (let j = 0; j <= segments; j++) {
      const a = j / segments * Math.PI * 2, c = Math.cos(a), s = Math.sin(a), u = r / rings;
      vertices.push(1.015 * Math.sign(c) * Math.pow(Math.abs(c), .48) * u, .665 * Math.sign(s) * Math.pow(Math.abs(s), .48) * u - .035, .605 + .11 * (1 - u * u));
      if (r < rings && j < segments) { const k = r * (segments + 1) + j; indices.push(k, k + segments + 1, k + 1, k + 1, k + segments + 1, k + segments + 2); }
    }
  }
  const screen = new THREE.BufferGeometry(); screen.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3)); screen.setIndex(indices); screen.computeVertexNormals(); mesh(head, screen, glass);
  for (const side of [-1, 1]) {
    const ear = sphere(head, .28, shell, [side * 1.22, -.05, -.015], [.36, 1.24, 1]); ear.rotation.z = side * -.05;
    sphere(head, .22, olive, [side * 1.29, -.05, .025], [.26, 1.1, .9]);
  }
  const topPanel = plate(head, roundedShape(.59, .13, .04), .012, .012, shell, [.37, .91, .08]); topPanel.rotation.x = -Math.PI / 2;
  const antenna = new THREE.Group(); antenna.position.set(.58, .91, -.1); antenna.rotation.z = -.23; head.add(antenna);
  capsule(antenna, .035, .21, joint, [0, .12, 0]); capsule(antenna, .055, .09, shell, [0, .29, 0]);
  const eyes = new THREE.Group(); head.add(eyes);
  for (const x of [-.48, .48]) {
    curve(eyes, Array.from({ length: 25 }, (_, i) => { const a = Math.PI * i / 24; return new THREE.Vector3(x - .19 * Math.cos(a), .08 + .19 * Math.sin(a), .729); }), .035, light);
  }
  curve(head, Array.from({ length: 25 }, (_, i) => { const a = Math.PI * i / 24; return new THREE.Vector3(-.15 * Math.cos(a), -.31 - .065 * Math.sin(a), .727); }), .022, light);

  function arm(side: number) {
    const shoulder = new THREE.Group(); shoulder.position.set(side * 1.02, .03, -.03); shoulder.rotation.z = side * .16; root.add(shoulder);
    sphere(shoulder, .31, shell, [side * .11, -.015, 0], [1, 1.1, .96]);
    sphere(shoulder, .235, joint, [side * .13, -.025, .19], [1, 1.1, .5]);
    sphere(shoulder, .18, olive, [side * .13, -.025, .29], [1, 1.1, .25]);
    capsule(shoulder, .155, .24, shell, [side * .04, -.38, 0]);
    const elbow = new THREE.Group(); elbow.position.set(side * .04, -.63, 0); elbow.rotation.z = side * .09; shoulder.add(elbow);
    sphere(elbow, .18, joint, [0, 0, 0]); sphere(elbow, .12, olive, [0, 0, .145], [1, 1, .3]);
    const forearm = sphere(elbow, 1, shell, [0, -.34, 0], [.225, .39, .22]); forearm.rotation.z = side * -.05;
    curve(elbow, [new THREE.Vector3(-.12, -.1, .13), new THREE.Vector3(-.13, -.32, .19), new THREE.Vector3(-.08, -.62, .12)], .006, seam);
    const wrist = new THREE.Group(); wrist.position.y = -.71; elbow.add(wrist);
    capsule(wrist, .105, .055, joint, [0, -.015, 0]);
    const hand = new THREE.Group(); hand.position.y = -.17; wrist.add(hand);
    mesh(hand, new RoundedBoxGeometry(.35, .34, .18, 6, .08), shell);
    const pad = plate(hand, roundedShape(.225, .21, .065), .006, .012, joint, [0, .015, .095]); pad.rotation.z = side * .05;
    const fingers: THREE.Group[] = [];
    for (let i = 0; i < 3; i++) {
      const finger = new THREE.Group(); finger.position.set((i - 1) * .118, -.155, 0); finger.rotation.z = (i - 1) * -.09; hand.add(finger);
      const length = i === 1 ? .155 : .125;
      capsule(finger, .047, .055, joint, [0, -.08, 0]); capsule(finger, .052, length - .07, shell, [0, -length / 2, 0]);
      const tip = new THREE.Group(); tip.position.y = -length - .045; tip.rotation.x = -.28; finger.add(tip);
      sphere(tip, .045, joint, [0, 0, 0]); capsule(tip, .046, .065, shell, [0, -.075, 0]); fingers.push(tip);
    }
    const thumb = new THREE.Group(); thumb.position.set(-side * .17, -.015, .01); thumb.rotation.z = -side * .65; hand.add(thumb);
    capsule(thumb, .054, .075, shell, [0, -.065, 0]); sphere(thumb, .047, joint, [0, -.15, 0]); capsule(thumb, .048, .04, shell, [0, -.21, .015]);
    return { shoulder, elbow, wrist, fingers, side };
  }
  const waving = arm(-1), resting = arm(1); root.rotation.y = -.16;
  return { root, head, eyes, waving, resting, labelTexture };
}

function Studio() {
  const { gl, scene, camera, size } = useThree();
  const shadow = useMemo(() => {
    const canvas = document.createElement("canvas"); canvas.width = canvas.height = 128;
    const context = canvas.getContext("2d")!, gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(12,29,17,.3)"); gradient.addColorStop(.35, "rgba(12,29,17,.15)"); gradient.addColorStop(1, "rgba(12,29,17,0)");
    context.fillStyle = gradient; context.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
  }, []);
  useEffect(() => () => shadow.dispose(), [shadow]);
  useEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      camera.zoom = Math.min(size.width / 5.6, size.height / 5.6);
      camera.updateProjectionMatrix();
    }
  }, [camera, size.width, size.height]);
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl), room = new RoomEnvironment(), environment = pmrem.fromScene(room, .04);
    scene.environment = environment.texture; scene.environmentIntensity = .4;
    return () => { scene.environment = null; environment.dispose(); room.dispose(); pmrem.dispose(); };
  }, [gl, scene]);
  return <>
    <hemisphereLight args={["#f1fff7", "#405d4c", .6]} />
    <directionalLight position={[-3, 5, 5]} intensity={1.8} color="#f6fff9" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-bias={-.001} shadow-normalBias={.025} shadow-radius={4} />
    <directionalLight position={[4, 2, -3]} intensity={1.2} color="#d5e6d5" />
    <directionalLight position={[3, 0, 5]} intensity={.45} color="#edf5ee" />
    <mesh position={[0, -2.03, -.1]}><planeGeometry args={[3.2, .4]} /><meshBasicMaterial map={shadow} transparent depthWrite={false} toneMapped={false} /></mesh>
  </>;
}

function RobotModel({ greeting }: { greeting: number }) {
  const rig = useMemo(buildRobot, []);
  const start = useRef(-100), previousGreeting = useRef(-1), amount = useRef(0);
  useEffect(() => () => {
    const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>();
    rig.root.traverse(object => { if (object instanceof THREE.Mesh) { geometries.add(object.geometry); (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material)); } });
    geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose()); rig.labelTexture.dispose();
  }, [rig]);
  useFrame(({ clock, pointer }, dt) => {
    const now = clock.elapsedTime;
    if (previousGreeting.current !== greeting) { previousGreeting.current = greeting; start.current = now; }
    const time = now - start.current;
    // Raise, briefly greet, then lower. Damping also makes interrupted replays continuous.
    const target = time < 1.25 ? smooth(time / 1.25) : time < 2.7 ? 1 : 1 - smooth((time - 2.7) / 1.4);
    amount.current = THREE.MathUtils.damp(amount.current, target, 9, Math.min(dt, .05));
    const a = amount.current, wave = time > 1.25 && time < 2.7 ? Math.sin((time - 1.25) / 1.45 * Math.PI * 4) * .105 : 0;
    rig.waving.shoulder.rotation.z = -.16 - a * 1.44; rig.waving.shoulder.rotation.x = -.06 - a * .12;
    rig.waving.elbow.rotation.z = -.09 - a * 1.41;
    rig.waving.wrist.rotation.z = a * .05 + wave; rig.waving.wrist.rotation.y = a * -.08;
    rig.waving.fingers.forEach(tip => { tip.rotation.x = -.28 * (1 - a); });
    rig.resting.elbow.rotation.x = -.1;
    rig.resting.wrist.rotation.y = .5;
    rig.resting.fingers.forEach(tip => { tip.rotation.x = -.6; });
    rig.root.position.y = Math.sin(now * .9) * .035; rig.root.rotation.z = Math.sin(now * .6) * .012;
    rig.head.rotation.z = -.055 + a * .035 + Math.sin(now * .6) * .012;
    rig.head.rotation.y = THREE.MathUtils.damp(rig.head.rotation.y, pointer.x * .07, 4, dt);
    const blink = now % 6.8; rig.eyes.scale.y = blink > 6.52 ? .1 + .9 * Math.abs((blink - 6.66) / .14) : 1;
  });
  return <primitive object={rig.root} />;
}

export function RobotScene({ active, greeting }: { active: boolean; greeting: number }) {
  return <Canvas aria-hidden="true" orthographic camera={{ position: [0, .45, 9], zoom: 77, near: .1, far: 40 }} dpr={[1, 1.8]} shadows frameloop={active ? "always" : "never"} gl={{ antialias: true, alpha: true, powerPreference: "low-power" }} onCreated={({ gl, camera }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1; camera.lookAt(0, .3, 0); }}>
    <Studio /><RobotModel greeting={greeting} />
  </Canvas>;
}
