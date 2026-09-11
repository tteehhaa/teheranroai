// Displacement transition from the mockup: activeTex slides out, nextTex slides in.
export const VERTEX_SHADER = `
  precision mediump float;
  attribute vec3 aVertexPosition;
  attribute vec2 aTextureCoord;
  uniform mat4 uMVMatrix;
  uniform mat4 uPMatrix;
  uniform mat4 displacementMatrix;
  uniform mat4 activeTexMatrix;
  uniform mat4 nextTexMatrix;
  varying vec2 vDispUv;
  varying vec2 vActiveUv;
  varying vec2 vNextUv;
  void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vDispUv = (displacementMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
    vActiveUv = (activeTexMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
    vNextUv = (nextTexMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
  }
`;

export const FRAGMENT_SHADER = `
  precision mediump float;
  varying vec2 vDispUv;
  varying vec2 vActiveUv;
  varying vec2 vNextUv;
  uniform sampler2D displacement;
  uniform sampler2D activeTex;
  uniform sampler2D nextTex;
  uniform float uProgress;
  uniform float uStrength;
  void main() {
    float d = texture2D(displacement, vDispUv).r;
    vec2 a = vec2(vActiveUv.x - uProgress * d * uStrength, vActiveUv.y);
    vec2 n = vec2(vNextUv.x + (1.0 - uProgress) * d * uStrength, vNextUv.y);
    gl_FragColor = mix(texture2D(activeTex, a), texture2D(nextTex, n), uProgress);
  }
`;
