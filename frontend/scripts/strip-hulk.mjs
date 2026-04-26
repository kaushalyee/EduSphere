import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const glbPath = path.join(__dirname, '..', 'public', 'assets', 'avatars', 'optimized', 'hulk.glb');

const buffer = fs.readFileSync(glbPath);
if (buffer.readUInt32LE(0) !== 0x46546C67) {
  console.log("Not a valid glb");
  process.exit(1);
}

const jsonChunkLength = buffer.readUInt32LE(12);
const jsonChunkType = buffer.readUInt32LE(16);
if (jsonChunkType !== 0x4E4F534A) {
  console.log("First chunk is not JSON");
  process.exit(1);
}

const jsonStr = buffer.toString('utf-8', 20, 20 + jsonChunkLength);
const gltf = JSON.parse(jsonStr);

// Keep only the first animation
if (gltf.animations && gltf.animations.length > 0) {
  gltf.animations = [gltf.animations[0]];
}

// Convert JSON back
const newJsonStr = JSON.stringify(gltf);
let newJsonBuffer = Buffer.from(newJsonStr, 'utf-8');

// Padding
const padding = (4 - (newJsonBuffer.length % 4)) % 4;
if (padding > 0) {
  newJsonBuffer = Buffer.concat([newJsonBuffer, Buffer.alloc(padding, 0x20)]);
}

// Create new file buffer
const newJsonChunkLength = newJsonBuffer.length;
const totalLength = 12 + 8 + newJsonChunkLength + (buffer.length - (20 + jsonChunkLength));

const newFileBuffer = Buffer.alloc(totalLength);
buffer.copy(newFileBuffer, 0, 0, 12); // Copy header
newFileBuffer.writeUInt32LE(totalLength, 8); // Update total length
newFileBuffer.writeUInt32LE(newJsonChunkLength, 12); // New JSON chunk length
newFileBuffer.writeUInt32LE(0x4E4F534A, 16); // JSON type
newJsonBuffer.copy(newFileBuffer, 20); // Copy new JSON

// Copy the rest
buffer.copy(newFileBuffer, 20 + newJsonChunkLength, 20 + jsonChunkLength);

fs.writeFileSync(glbPath, newFileBuffer);
console.log("Stripped animations successfully!");
