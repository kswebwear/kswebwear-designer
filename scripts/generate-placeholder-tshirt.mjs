/**
 * Generates a realistic-looking t-shirt shaped GLB as a placeholder.
 * Uses raw GLB binary — no browser APIs required.
 * Run: node scripts/generate-placeholder-tshirt.mjs
 *
 * UV layout (on 2048x2048 canvas):
 *   Front body:  U[0.12,0.88] V[0.38,0.92]
 *   Back body:   U[0.12,0.88] V[0.04,0.36]
 *   Sleeves:     U[0.0,0.10] and U[0.90,1.0]
 */

import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, "../public/models/tshirt.glb");

// ─── Geometry helpers ────────────────────────────────────────────────────────

const positions = [];
const normals   = [];
const uvs       = [];
const indices   = [];

function norm3(v) {
  const l = Math.hypot(...v);
  return l > 0 ? v.map(c => c / l) : [0, 1, 0];
}

function addTri(v0, v1, v2, n, uv0, uv1, uv2) {
  const base = positions.length / 3;
  positions.push(...v0, ...v1, ...v2);
  normals.push(...n, ...n, ...n);
  uvs.push(...uv0, ...uv1, ...uv2);
  indices.push(base, base + 1, base + 2);
}

function addQuad(v0, v1, v2, v3, n, uv0, uv1, uv2, uv3) {
  addTri(v0, v1, v2, n, uv0, uv1, uv2);
  addTri(v0, v2, v3, n, uv0, uv2, uv3);
}

// ─── T-Shirt geometry ────────────────────────────────────────────────────────
// Coordinate system: X right, Y up, Z toward viewer
// Shirt sits at Y: -1.0 (hem) to +0.85 (collar)
// Shirt width: X -0.42 to +0.42 at hem, tapering to ±0.30 at shoulder

const D  = 0.075;  // shirt thickness (front-to-back)
const D2 = D / 2;

// ── FRONT BODY ────────────────────────────────────────────────────────────────
// 4-point trapezoid: wider at bottom, narrower at shoulders
// Left & right shoulder indented for sleeve attachment
const FN  = [0, 0, 1];

// Main body front (5 points: hem-L, hem-R, shoulder-R, neck-R, neck-L, shoulder-L)
// Split into 4 quads to give it shape
const bodyPoints = {
  hemL:   [-0.43, -1.00, D2],
  hemR:   [ 0.43, -1.00, D2],
  midL:   [-0.40, -0.10, D2],
  midR:   [ 0.40, -0.10, D2],
  shlL:   [-0.30,  0.55, D2],  // left shoulder
  shlR:   [ 0.30,  0.55, D2],  // right shoulder
  neckL:  [-0.14,  0.72, D2],
  neckR:  [ 0.14,  0.72, D2],
};

// Front quads
addQuad(bodyPoints.hemL, bodyPoints.hemR, bodyPoints.midR, bodyPoints.midL, FN,
  [0.12,0.38],[0.88,0.38],[0.88,0.62],[0.12,0.62]);

addQuad(bodyPoints.midL, bodyPoints.midR, bodyPoints.shlR, bodyPoints.shlL, FN,
  [0.12,0.62],[0.88,0.62],[0.85,0.85],[0.15,0.85]);

// Left neck & shoulder strip
addQuad(bodyPoints.shlL, bodyPoints.shlR, bodyPoints.neckR, bodyPoints.neckL, FN,
  [0.15,0.85],[0.85,0.85],[0.57,0.92],[0.43,0.92]);

// ── BACK BODY ────────────────────────────────────────────────────────────────
const BN = [0, 0, -1];

const backPoints = {
  hemL:   [ 0.43, -1.00, -D2],
  hemR:   [-0.43, -1.00, -D2],
  midL:   [ 0.40, -0.10, -D2],
  midR:   [-0.40, -0.10, -D2],
  shlL:   [ 0.30,  0.55, -D2],
  shlR:   [-0.30,  0.55, -D2],
  neckL:  [ 0.14,  0.72, -D2],
  neckR:  [-0.14,  0.72, -D2],
};

addQuad(backPoints.hemL, backPoints.hemR, backPoints.midR, backPoints.midL, BN,
  [0.88,0.04],[0.12,0.04],[0.12,0.22],[0.88,0.22]);

addQuad(backPoints.midL, backPoints.midR, backPoints.shlR, backPoints.shlL, BN,
  [0.88,0.22],[0.12,0.22],[0.15,0.34],[0.85,0.34]);

addQuad(backPoints.shlL, backPoints.shlR, backPoints.neckR, backPoints.neckL, BN,
  [0.85,0.34],[0.15,0.34],[0.43,0.36],[0.57,0.36]);

// ── LEFT SLEEVE ────────────────────────────────────────────────────────────
// Attaches at the left shoulder, angled downward-outward
// 4 faces: front, back, top, bottom of the sleeve tube
const slvLen = 0.40;  // sleeve length
const slvW   = 0.14;  // sleeve half-width at shoulder
const slvCuff = 0.09; // sleeve half-width at cuff

// Sleeve attachment points at shoulder
const lShlFront = [-0.30,  0.55,  D2];
const lShlBack  = [-0.30,  0.55, -D2];
const lShlTop   = [-0.30,  0.60,  0.0];
const lShlBot   = [-0.30,  0.50,  0.0];

// Cuff points — angled down and out
const lCuffX = -0.30 - slvLen * 0.85;
const lCuffY =  0.55 - slvLen * 0.55;

const lCuffFront = [lCuffX - 0.01,  lCuffY,  slvCuff];
const lCuffBack  = [lCuffX - 0.01,  lCuffY, -slvCuff];
const lCuffTop   = [lCuffX,          lCuffY + slvCuff * 0.9, 0.0];
const lCuffBot   = [lCuffX,          lCuffY - slvCuff * 0.9, 0.0];

// Sleeve front face
addQuad(lShlFront, lCuffFront, lCuffBot, lShlBot,
  norm3([-0.1, 0.1, 1]),
  [0.10,0.60],[0.00,0.60],[0.00,0.50],[0.10,0.50]);

// Sleeve back face
addQuad(lCuffBack, lShlBack, lShlBot, lCuffBot,
  norm3([-0.1, 0.1, -1]),
  [0.00,0.60],[0.10,0.60],[0.10,0.50],[0.00,0.50]);

// Sleeve top face
addQuad(lShlTop, lShlFront, lCuffFront, lCuffTop,
  norm3([-0.1, 1, 0.1]),
  [0.10,0.68],[0.10,0.62],[0.00,0.62],[0.00,0.68]);

// Sleeve bottom face
addQuad(lShlFront, lShlBot, lCuffBot, lCuffFront,
  norm3([-0.1, -1, 0.1]),
  [0.10,0.58],[0.10,0.52],[0.00,0.52],[0.10,0.58]);

// ── RIGHT SLEEVE ──────────────────────────────────────────────────────────
const rCuffX =  0.30 + slvLen * 0.85;
const rCuffY =  0.55 - slvLen * 0.55;

const rShlFront = [ 0.30,  0.55,  D2];
const rShlBack  = [ 0.30,  0.55, -D2];
const rShlBot   = [ 0.30,  0.50,  0.0];
const rShlTop   = [ 0.30,  0.60,  0.0];

const rCuffFront = [rCuffX + 0.01, rCuffY,  slvCuff];
const rCuffBack  = [rCuffX + 0.01, rCuffY, -slvCuff];
const rCuffBot   = [rCuffX,        rCuffY - slvCuff * 0.9, 0.0];
const rCuffTop   = [rCuffX,        rCuffY + slvCuff * 0.9, 0.0];

// Sleeve front face
addQuad(rCuffFront, rShlFront, rShlBot, rCuffBot,
  norm3([0.1, 0.1, 1]),
  [0.90,0.60],[1.00,0.60],[1.00,0.50],[0.90,0.50]);

// Sleeve back face
addQuad(rShlBack, rCuffBack, rCuffBot, rShlBot,
  norm3([0.1, 0.1, -1]),
  [1.00,0.60],[0.90,0.60],[0.90,0.50],[1.00,0.50]);

// Sleeve top face
addQuad(rShlFront, rShlTop, rCuffTop, rCuffFront,
  norm3([0.1, 1, 0.1]),
  [0.90,0.68],[0.90,0.62],[1.00,0.62],[1.00,0.68]);

// ── COLLAR (front v-neck) ─────────────────────────────────────────────────
// Slightly raised collar strip
addQuad(
  [-0.14, 0.72, D2], [0.14, 0.72, D2], [0.14, 0.74, D2], [-0.14, 0.74, D2],
  FN,
  [0.43,0.92],[0.57,0.92],[0.57,0.93],[0.43,0.93]
);

// ── SIDE STRIPS (connecting front & back at sides) ────────────────────────
const LSN = norm3([-1, 0, 0]);
addQuad(
  [-0.43,-1.00,-D2], [-0.43,-1.00, D2],
  [-0.30, 0.55, D2], [-0.30, 0.55,-D2],
  LSN,
  [0.04,0.38],[0.04,0.38],[0.04,0.85],[0.04,0.85]
);

const RSN = norm3([1, 0, 0]);
addQuad(
  [0.43,-1.00, D2], [0.43,-1.00,-D2],
  [0.30, 0.55,-D2], [0.30, 0.55, D2],
  RSN,
  [0.96,0.38],[0.96,0.38],[0.96,0.85],[0.96,0.85]
);

// ── BOTTOM HEM ────────────────────────────────────────────────────────────
addQuad(
  [-0.43,-1.00, D2], [0.43,-1.00, D2],
  [0.43,-1.00,-D2], [-0.43,-1.00,-D2],
  [0,-1,0],
  [0.12,0.37],[0.88,0.37],[0.88,0.37],[0.12,0.37]
);

// ─── Pack Binary Buffer ───────────────────────────────────────────────────────

const posArr = new Float32Array(positions);
const normArr = new Float32Array(normals);
const uvArr = new Float32Array(uvs);
// Use Uint32Array if index count > 65535
const idxArr = indices.length > 65535
  ? new Uint32Array(indices)
  : new Uint16Array(indices);
const idxComponentType = indices.length > 65535 ? 5125 : 5123; // UNSIGNED_INT or UNSIGNED_SHORT

function pad4(n) { return Math.ceil(n / 4) * 4; }

const posBytes  = posArr.buffer.byteLength;
const normBytes = normArr.buffer.byteLength;
const uvBytes   = uvArr.buffer.byteLength;
const idxRaw    = idxArr.buffer.byteLength;
const idxBytes  = pad4(idxRaw);

const binLength = posBytes + normBytes + uvBytes + idxBytes;
const binBuffer = Buffer.alloc(binLength, 0);

let off = 0;
const posOffset  = off; Buffer.from(posArr.buffer).copy(binBuffer, off); off += posBytes;
const normOffset = off; Buffer.from(normArr.buffer).copy(binBuffer, off); off += normBytes;
const uvOffset   = off; Buffer.from(uvArr.buffer).copy(binBuffer, off); off += uvBytes;
const idxOffset  = off; Buffer.from(idxArr.buffer).copy(binBuffer, off);

const vertCount = positions.length / 3;
const idxCount  = indices.length;

let minX=Infinity,minY=Infinity,minZ=Infinity,maxX=-Infinity,maxY=-Infinity,maxZ=-Infinity;
for (let i = 0; i < positions.length; i += 3) {
  minX = Math.min(minX, positions[i]);   maxX = Math.max(maxX, positions[i]);
  minY = Math.min(minY, positions[i+1]); maxY = Math.max(maxY, positions[i+1]);
  minZ = Math.min(minZ, positions[i+2]); maxZ = Math.max(maxZ, positions[i+2]);
}

// ─── Build GLTF JSON ─────────────────────────────────────────────────────────

const gltf = {
  asset: { version: "2.0", generator: "kswebwear-tshirt-gen-v2" },
  scene: 0,
  scenes: [{ name: "Scene", nodes: [0] }],
  nodes: [{ name: "TShirt", mesh: 0 }],
  meshes: [{
    name: "TShirt",
    primitives: [{
      attributes: { POSITION: 0, NORMAL: 1, TEXCOORD_0: 2 },
      indices: 3,
      material: 0,
    }]
  }],
  materials: [{
    name: "TShirtMaterial",
    pbrMetallicRoughness: {
      baseColorFactor: [1, 1, 1, 1],
      metallicFactor: 0.0,
      roughnessFactor: 0.82,
    },
    doubleSided: false,
  }],
  accessors: [
    { bufferView:0, byteOffset:0, componentType:5126, count:vertCount, type:"VEC3",   min:[minX,minY,minZ], max:[maxX,maxY,maxZ] },
    { bufferView:1, byteOffset:0, componentType:5126, count:vertCount, type:"VEC3"   },
    { bufferView:2, byteOffset:0, componentType:5126, count:vertCount, type:"VEC2"   },
    { bufferView:3, byteOffset:0, componentType:idxComponentType, count:idxCount, type:"SCALAR" },
  ],
  bufferViews: [
    { buffer:0, byteOffset:posOffset,  byteLength:posBytes,  target:34962 },
    { buffer:0, byteOffset:normOffset, byteLength:normBytes, target:34962 },
    { buffer:0, byteOffset:uvOffset,   byteLength:uvBytes,   target:34962 },
    { buffer:0, byteOffset:idxOffset,  byteLength:idxRaw,    target:34963 },
  ],
  buffers: [{ byteLength: binLength }],
};

// ─── Pack GLB ────────────────────────────────────────────────────────────────

const jsonBuf = Buffer.from(JSON.stringify(gltf), "utf-8");
const jsonPaddedLen = pad4(jsonBuf.length);
const jsonPadded = Buffer.alloc(jsonPaddedLen, 0x20);
jsonBuf.copy(jsonPadded);

const binPaddedLen = pad4(binLength);
const binPadded = Buffer.alloc(binPaddedLen, 0);
binBuffer.copy(binPadded);

const totalLen = 12 + 8 + jsonPaddedLen + 8 + binPaddedLen;
const out = Buffer.alloc(totalLen);
let p = 0;

out.writeUInt32LE(0x46546C67, p); p+=4;
out.writeUInt32LE(2,          p); p+=4;
out.writeUInt32LE(totalLen,   p); p+=4;

out.writeUInt32LE(jsonPaddedLen, p); p+=4;
out.writeUInt32LE(0x4E4F534A,    p); p+=4;
jsonPadded.copy(out, p); p+=jsonPaddedLen;

out.writeUInt32LE(binPaddedLen, p); p+=4;
out.writeUInt32LE(0x004E4942,   p); p+=4;
binPadded.copy(out, p);

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, out);
console.log(`✅ T-shirt GLB v2: ${OUTPUT_PATH}`);
console.log(`   Vertices: ${vertCount}, Triangles: ${idxCount/3}, Size: ${(out.length/1024).toFixed(1)} KB`);
