// const TILT_RAD = 1.5;
const FOV = 2.5;
const NEAR = 0.1;
const FAR = 100;

const f = 1 / Math.tan(FOV / 2.0);
// const cosTilt = Math.cos(TILT_RAD);
// const sinTilt = Math.sin(TILT_RAD);

// export function getRotationMatrix() {
//   // prettier-ignore
//   return new Float32Array([
//     1, 0, 0, 0,
//     0, cosTilt, -sinTilt, 0,
//     0, sinTilt, cosTilt, 0,
//     0, 0, 0, 1,
//   ]);
// }

export function getProjectionMatrix(aspectRatio: number) {
  // prettier-ignore
  return new Float32Array([
    f / aspectRatio, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (FAR + NEAR) / (NEAR - FAR), -1,
    0, 0, (2 * FAR * NEAR) / (NEAR - FAR), 0
  ]);
}
