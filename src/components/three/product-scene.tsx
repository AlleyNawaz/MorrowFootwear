"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { Suspense, useEffect, useRef, type RefObject } from "react";
import { Group, MathUtils } from "three";
import { ProductModel } from "./product-model";
import {
  storyStates,
  type Configuration,
  type PartId,
} from "@/data/experience";

export interface SceneProps {
  progress: RefObject<number>;
  wake: RefObject<() => void>;
  configuration: Configuration;
  selected: PartId;
  exploded: boolean;
  inspect: boolean;
  reset: number;
  view: { yaw: number; pitch: number; zoom: number };
  reduced: boolean;
  active: boolean;
  mobile: boolean;
  onSelect: (part: PartId) => void;
  onReady: () => void;
  onFailure: () => void;
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <hemisphereLight args={["#d9e1e8", "#28211a", 0.65]} />
      <directionalLight position={[-3, 5, 4]} intensity={2} color="#fff0da" />
      <directionalLight position={[2, 3, -4]} intensity={1.5} color="#a8bbcb" />
      <pointLight
        position={[3, 0.8, 1]}
        intensity={3}
        color="#ef382a"
        distance={8}
      />
    </>
  );
}

function Stage(props: SceneProps) {
  const model = useRef<Group>(null);
  const explosion = useRef(0);
  const remaining = useRef(100);
  const smooth = useRef(0);
  const { invalidate, camera } = useThree();
  useEffect(()=>{camera.position.set(0,1.8,props.mobile?6.6:5.6);camera.lookAt(0,.25,0);invalidate()},[camera,props.reset,props.mobile,invalidate]);
  const { wake: wakeRef } = props;
  useEffect(() => {
    wakeRef.current = () => {
      remaining.current = 100;
      invalidate();
    };
    return () => {
      wakeRef.current = () => {};
    };
  }, [wakeRef, invalidate]);
  useEffect(() => {
    remaining.current = 100;
    invalidate();
  }, [
    props.configuration,
    props.selected,
    props.exploded,
    props.active,
    props.reset,
    props.view,
    invalidate,
  ]);
  useFrame((state, dt) => {
    if (!props.active || !model.current) return;
    const blend = props.reduced ? 1 : 1 - Math.exp(-Math.min(dt, 0.05) * 6);
    smooth.current = MathUtils.lerp(
      smooth.current,
      props.reduced ? 0 : props.progress.current,
      blend,
    );
    const s = Math.min(4.999, smooth.current * 5),
      index = Math.floor(s),
      amount = s - index;
    const a = storyStates[index],
      b = storyStates[index + 1];
    const mix = (x: number, y: number) => MathUtils.lerp(x, y, amount);
    const pointer = props.reduced || props.inspect ? 0 : 0.08;
    model.current.rotation.set(
      MathUtils.lerp(
        model.current.rotation.x,
        mix(a.rotation[0], b.rotation[0]) +
          state.pointer.y * pointer +
          props.view.pitch,
        blend,
      ),
      MathUtils.lerp(
        model.current.rotation.y,
        mix(a.rotation[1], b.rotation[1]) +
          state.pointer.x * pointer +
          props.view.yaw,
        blend,
      ),
      MathUtils.lerp(
        model.current.rotation.z,
        mix(a.rotation[2], b.rotation[2]),
        blend,
      ),
    );
    model.current.position.set(
      props.mobile ? 0 : mix(a.position[0], b.position[0]),
      mix(a.position[1], b.position[1]),
      0,
    );
    const zoom =
      props.selected === "whole" ? 1 : props.selected === "upper" ? 1.32 : 1.18;
    const scale =
      mix(a.scale, b.scale) *
      (props.mobile ? 0.83 : 1) *
      zoom *
      props.view.zoom;
    model.current.scale.lerp({ x: scale, y: scale, z: scale }, blend);
    explosion.current = MathUtils.lerp(
      explosion.current,
      props.exploded ? 1 : props.inspect ? 0 : mix(a.explode, b.explode),
      blend,
    );
    if (!props.inspect) {
      camera.position.lerp(
        { x: 0, y: 1.8, z: props.mobile ? 6.6 : 5.6 },
        blend,
      );
      camera.lookAt(0, 0.25, 0);
    }
    remaining.current--;
    if (remaining.current > 0) invalidate();
  });
  return (
    <>
      <Lighting />
      <group ref={model}>
        <ProductModel
          configuration={props.configuration}
          explosion={explosion}
          selected={props.selected}
          hotspots={props.inspect}
          reduced={props.reduced}
          onSelect={props.onSelect}
        />
      </group>
      {!props.mobile && (
        <ContactShadows
          position={[0, -1.35, 0]}
          opacity={0.35}
          scale={12}
          blur={3}
          far={5}
          resolution={256}
          frames={1}
        />
      )}
      <OrbitControls
        key={props.reset}
        enabled={props.inspect}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={0.3}
        maxPolarAngle={2.3}
        target={[0, 0.25, 0]}
        onChange={() => {
          remaining.current = 70;
        }}
      />
    </>
  );
}
export default function ProductScene(props: SceneProps) {
  return (
    <Canvas
      frameloop={props.active ? "demand" : "never"}
      dpr={props.mobile ? 1 : [1, 1.5]}
      camera={{ position: [0, 1.8, 5.6], fov: 42 }}
      gl={{
        antialias: !props.mobile,
        alpha: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", props.onFailure, {
          once: true,
        });
        props.onReady();
      }}
      fallback={<span>3D unavailable. Product details remain below.</span>}
      onPointerMove={() => props.wake.current()}
    >
      <Suspense fallback={null}>
        <Stage {...props} />
      </Suspense>
    </Canvas>
  );
}
