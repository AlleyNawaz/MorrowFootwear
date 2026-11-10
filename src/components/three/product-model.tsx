import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Color,
  DoubleSide,
  Group,
  MathUtils,
  MeshStandardMaterial,
} from "three";
import { Html } from "@react-three/drei";
import { cord, shoeGeometry } from "./geometry";
import { textileTexture } from "./materials";
import {
  initialConfiguration,
  materialStories,
  type Configuration,
  type PartId,
} from "@/data/experience";

interface Props {
  configuration: Configuration;
  explosion: React.RefObject<number>;
  selected: PartId;
  hotspots: boolean;
  reduced: boolean;
  onSelect: (part: PartId) => void;
}
export function ProductModel({
  configuration,
  explosion,
  selected,
  hotspots,
  reduced,
  onSelect,
}: Props) {
  const upper = useRef<Group>(null),
    sole = useRef<Group>(null),
    rubber = useRef<Group>(null),
    heel = useRef<Group>(null),
    laces = useRef<Group>(null);
  const upperMat = useRef<MeshStandardMaterial>(null),
    accentMat = useRef<MeshStandardMaterial>(null),
    soleMat = useRef<MeshStandardMaterial>(null);
  const geometry = useMemo(
    () => ({
      upper: shoeGeometry("upper"),
      sole: shoeGeometry("sole"),
      rubber: shoeGeometry("rubber"),
      rim: shoeGeometry("rim"),
    }),
    [],
  );
  const textile = useMemo(() => textileTexture(), []);
  const colors = useMemo(
    () => ({
      upper: new Color(configuration.upper),
      accent: new Color(configuration.accent),
      sole: new Color(configuration.sole),
    }),
    [configuration],
  );
  const laceGeometry = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const x = -0.82 + i * 0.18;
        const y = 0.71 + i * 0.09;
        return cord(
          [
            [x, y, 0.31],
            [x + 0.1, y + 0.14, 0],
            [x + (configuration.laces === "cross" ? 0.14 : 0), y, -0.31],
          ],
          0.023,
        );
      }),
    [configuration.laces],
  );
  const heelCord = useMemo(
    () =>
      cord(
        [
          [0.66, 0.4, -0.47],
          [1.18, 0.44, -0.44],
          [1.49, 0.5, 0],
          [1.18, 0.44, 0.44],
          [0.66, 0.4, 0.47],
        ],
        0.075,
      ),
    [],
  );
  const collar = useMemo(
    () =>
      cord(
        Array.from({ length: 49 }, (_, i): [number, number, number] => {
          const a = (i / 48) * Math.PI * 2;
          return [
            0.87 + 0.48 * Math.cos(a),
            1.12 - 0.14 * Math.cos(a) - 0.16 * Math.sin(a) ** 2,
            0.32 * Math.sin(a),
          ];
        }),
        0.065,
      ),
    [],
  );
  const seams = useMemo(
    () =>
      [1, -1].flatMap((side) => [
        cord(
          [
            [-1.65, 0.28, 0.35 * side],
            [-1.1, 0.36, 0.62 * side],
            [-0.4, 0.43, 0.55 * side],
            [0.25, 0.5, 0.44 * side],
            [0.8, 0.51, 0.43 * side],
          ],
          0.016,
        ),
        cord(
          [
            [0.18, 1.01, 0.25 * side],
            [-0.05, 0.65, 0.48 * side],
            [-0.35, 0.19, 0.59 * side],
          ],
          0.034,
        ),
        cord(
          [
            [0.44, 0.92, 0.3 * side],
            [0.28, 0.61, 0.46 * side],
            [0.05, 0.18, 0.52 * side],
          ],
          0.022,
        ),
      ]),
    [],
  );
  useEffect(
    () => () => {
      collar.dispose();
      seams.forEach((g) => g.dispose());
    },
    [collar, seams],
  );
  useEffect(
    () => () => {
      Object.values(geometry).forEach((g) => g.dispose());
      textile?.dispose();
      heelCord.dispose();
    },
    [geometry, textile, heelCord],
  );
  useEffect(
    () => () => laceGeometry.forEach((g) => g.dispose()),
    [laceGeometry],
  );
  useFrame((_, delta) => {
    const ease = reduced ? 1 : 1 - Math.exp(-delta * 8),
      e = explosion.current;
    if (upper.current)
      upper.current.position.y = MathUtils.lerp(
        upper.current.position.y,
        e * 0.75,
        ease,
      );
    if (laces.current)
      laces.current.position.y = MathUtils.lerp(
        laces.current.position.y,
        e * 1.17,
        ease,
      );
    if (heel.current) heel.current.position.set(e * 0.3, e * 0.52, 0);
    if (sole.current)
      sole.current.position.y = MathUtils.lerp(
        sole.current.position.y,
        -e * 0.2,
        ease,
      );
    if (rubber.current)
      rubber.current.position.y = MathUtils.lerp(
        rubber.current.position.y,
        -e * 0.65,
        ease,
      );
    upperMat.current?.color.lerp(colors.upper, ease);
    accentMat.current?.color.lerp(colors.accent, ease);
    soleMat.current?.color.lerp(colors.sole, ease);
  });
  const highlight = (part: PartId) => (selected === part ? "#5b160d" : "#000");
  return (
    <group>
      <group ref={upper}>
        <mesh geometry={geometry.upper} castShadow receiveShadow>
          <meshStandardMaterial
            ref={upperMat}
            color={initialConfiguration.upper}
            roughness={0.92}
            map={textile}
            bumpMap={textile}
            bumpScale={0.035}
            side={DoubleSide}
            emissive={highlight("upper")}
          />
        </mesh>
        <mesh position={[0.87, 0.35, 0]} scale={[0.54, 0.18, 0.32]}>
          <sphereGeometry args={[1, 24, 16]} />
          <meshStandardMaterial color="#191817" roughness={1} />
        </mesh>
        <mesh
          position={[-0.12, 1.01, 0]}
          rotation={[0, 0, 0.4]}
          scale={[0.57, 0.07, 0.24]}
        >
          <sphereGeometry args={[1, 24, 12]} />
          <meshStandardMaterial
            color={configuration.upper}
            map={textile}
            bumpMap={textile}
            bumpScale={0.03}
          />
        </mesh>
        <mesh geometry={collar}>
          <meshStandardMaterial color="#56554e" roughness={1} map={textile} />
        </mesh>
        {seams.map((g, i) => (
          <mesh key={i} geometry={g}>
            <meshStandardMaterial color="#78786f" roughness={0.8} />
          </mesh>
        ))}
        {hotspots &&
          materialStories
            .filter((p) => p.id === "upper")
            .map((p) => (
              <Html key={p.id} position={p.point} occlude distanceFactor={6}>
                <button
                  className="spatial-hotspot"
                  onClick={() => onSelect(p.id)}
                  aria-label={`Inspect ${p.id}`}
                >
                  01
                </button>
              </Html>
            ))}
      </group>
      <group ref={laces}>
        {laceGeometry.map((g, i) => (
          <mesh geometry={g} key={i}>
            <meshStandardMaterial color="#e8e2d6" roughness={0.95} />
          </mesh>
        ))}
      </group>
      <group ref={heel}>
        {hotspots&&<Html position={[1.1,.8,.38]} occlude distanceFactor={6}><button className="spatial-hotspot" onClick={()=>onSelect('heel')} aria-label="Inspect heel">02</button></Html>}
        <mesh geometry={heelCord}>
          <meshStandardMaterial
            ref={accentMat}
            color={initialConfiguration.accent}
            roughness={0.38}
            metalness={0.16}
            emissive={highlight("heel")}
          />
        </mesh>
        <mesh position={[1.37, 0.93, 0]} rotation={[0, 0, 0.22]}>
          <boxGeometry args={[0.08, 0.35, 0.12]} />
          <meshStandardMaterial color={configuration.accent} />
        </mesh>
      </group>
      <group ref={sole}>
        <mesh geometry={geometry.sole} castShadow>
          <meshStandardMaterial
            ref={soleMat}
            color={initialConfiguration.sole}
            roughness={0.8}
            bumpMap={textile}
            bumpScale={0.008}
            emissive={highlight("midsole")}
          />
        </mesh>
        <mesh geometry={geometry.rim}>
          <meshStandardMaterial color="#8e897e" roughness={0.55} />
        </mesh>
        {hotspots && (
          <Html position={[0, -0.1, 0.69]} occlude distanceFactor={6}>
            <button
              className="spatial-hotspot"
              onClick={() => onSelect("midsole")}
              aria-label="Inspect midsole"
            >
              03
            </button>
          </Html>
        )}
      </group>
      <group ref={rubber}>
        {hotspots&&<Html position={[-.5,-.4,.5]} occlude distanceFactor={6}><button className="spatial-hotspot" onClick={()=>onSelect('outsole')} aria-label="Inspect outsole">04</button></Html>}
        <mesh geometry={geometry.rubber}>
          <meshStandardMaterial
            color="#252522"
            roughness={0.96}
            emissive={highlight("outsole")}
          />
        </mesh>
        {Array.from({ length: 14 }, (_, i) => (
          <mesh
            key={i}
            position={[-1.5 + i * 0.205, -0.435, 0]}
            rotation={[0, (i % 2 ? 1 : -1) * 0.15, 0]}
          >
            <boxGeometry
              args={[0.1, 0.07, i > 10 ? 0.52 : i < 2 ? 0.64 : 1.01]}
            />
            <meshStandardMaterial color="#282823" roughness={0.95} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
