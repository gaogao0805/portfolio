import type {} from "@react-three/fiber";

// 让 <meshLineGeometry /> / <meshLineMaterial />（由 extend() 注册）通过 TS 校验。
// 用 any：meshline 自带的严格类型和它的运行时 props（useMap 等）对不上。
declare module "@react-three/fiber" {
  interface ThreeElements {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meshLineGeometry: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meshLineMaterial: any;
  }
}
