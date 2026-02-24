// Bridge React Three Fiber's JSX types into React's JSX namespace.
// R3F declares to the global JSX namespace; React 18 uses React.JSX.
// This bridges the two so TypeScript accepts <group>, <mesh>, <primitive>, etc.
import type { ThreeElements } from "@react-three/fiber";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}
