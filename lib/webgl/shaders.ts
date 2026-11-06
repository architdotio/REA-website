import * as THREE from 'three';

export const RAY_UNIFORMS = `
uniform float uTime;
uniform vec3 uRayO;
uniform vec3 uRayD;
uniform vec2 uCursor;
uniform float uCursorVel;
uniform float uFocus;
uniform float uBokeh;
uniform float uPixelRatio;
uniform float uViewH;
uniform float uProjScale;
uniform float uKeyShade;
`;

export const FOG_UNIFORMS = `
uniform vec3 uFogColor;
uniform float uFogDensity;
uniform float uFogBase;
uniform float uFogFalloff;
uniform float uFogNoise;
uniform vec3 uGlowPos;
uniform vec3 uGlowColor;
uniform vec3 uGlowPos2;
uniform vec3 uGlowColor2;
uniform float uFogTime;

float fogHash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float fogNoise(vec3 x){
  vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(fogHash(i), fogHash(i + vec3(1,0,0)), f.x), mix(fogHash(i + vec3(0,1,0)), fogHash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(fogHash(i + vec3(0,0,1)), fogHash(i + vec3(1,0,1)), f.x), mix(fogHash(i + vec3(0,1,1)), fogHash(i + vec3(1,1,1)), f.x), f.y), f.z);
}

float fogTransmittance(vec3 ro, vec3 p){
  vec3 rd = p - ro;
  float dist = length(rd);
  rd /= max(dist, 1e-4);
  float b = max(uFogFalloff, 1e-4);
  float e0 = exp(clamp(-(ro.y - uFogBase) * b, -30.0, 5.0));
  float k = rd.y * b;
  float kd = clamp(dist * k, -12.0, 60.0);
  float integral = abs(k) > 1e-5 ? e0 * (1.0 - exp(-kd)) / k : e0 * dist;
  float n = 1.0;
  if (uFogNoise > 0.0) {
    vec3 q = p * 0.05 + vec3(uFogTime * 0.013, -uFogTime * 0.021, uFogTime * 0.017);
    float nn = fogNoise(q) * 0.65 + fogNoise(q * 2.63 + 3.1) * 0.35;
    n = mix(1.0, 0.25 + nn * 1.5, uFogNoise * smoothstep(420.0, 40.0, dist));
  }
  return exp(-uFogDensity * max(integral, 0.0) * n);
}

vec3 fogScatter(vec3 ro, vec3 p, vec3 L, vec3 col){
  vec3 rd = p - ro;
  float dist = length(rd);
  rd /= max(dist, 1e-4);
  vec3 q = ro - L;
  float bq = dot(rd, q);
  float h2 = max(dot(q, q) - bq * bq, 0.04);
  float s = inversesqrt(h2);
  return col * (s * (atan((dist + bq) * s) - atan(bq * s))) * exp(-sqrt(h2) * 0.045);
}

vec3 applyFog(vec3 col, vec3 p){
  float T = fogTransmittance(cameraPosition, p);
  vec3 c = mix(uFogColor, col, T);
  c += fogScatter(cameraPosition, p, uGlowPos, uGlowColor);
  c += fogScatter(cameraPosition, p, uGlowPos2, uGlowColor2);
  return c;
}
`;

export const CURSOR_AWAY_CHUNK = `
vec3 cursorAway(vec3 wp, out float dist, out float along){
  vec3 toP = wp - uRayO;
  along = max(dot(toP, uRayD), 0.0);
  vec3 cp = uRayO + uRayD * along;
  vec3 away = wp - cp;
  dist = length(away);
  return away / max(dist, 1e-4);
}
`;

export const RIBBON_VERTEX_SHADER = `
uniform float uRadius, uMinPx, uLength, uPluck;
varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vN;
${RAY_UNIFORMS}
${CURSOR_AWAY_CHUNK}

void main(){
  vec3 center = position - normal;
  float dist = distance(center, cameraPosition);
  float r = max(uRadius, dist * uMinPx);
  float d, along;
  vec3 away = cursorAway(center, d, along);
  float infl = exp(-d * d / (0.5 + along * 0.01)) * smoothstep(140.0, 0.0, along);
  float L = uv.x * uLength;
  float wob = sin(uTime * 34.0 - L * 1.7) * uCursorVel;
  center += away * infl * (0.12 + 0.5 * uCursorVel + wob * 0.25) * uPluck;
  vec3 wp = center + normal * r;
  vUv = uv;
  vWorld = wp;
  vN = normal;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}
`;

export const RIBBON_FRAGMENT_SHADER = `
uniform vec3 uColor;
uniform float uLength, uHead, uHeadAmt, uGain;
varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vN;
${RAY_UNIFORMS}
${FOG_UNIFORMS}

void main(){
  vec3 V = normalize(cameraPosition - vWorld);
  float facing = abs(dot(normalize(vN), V));
  float L = vUv.x * uLength;
  float train = pow(0.5 + 0.5 * sin(L * 0.21 - uTime * 4.2), 36.0);
  float fine = pow(0.5 + 0.5 * sin(L * 1.9 - uTime * 11.0), 12.0) * 0.35;
  float hd = (L - uHead) / 7.0;
  float head = exp(-hd * hd) * uHeadAmt;
  float core = pow(facing, 1.6);
  float near = mix(0.35, 1.0, smoothstep(0.6, 5.0, distance(cameraPosition, vWorld)));
  vec3 col = uColor * uGain * near * (0.45 + 1.3 * core) * (1.0 + train * 2.4 + fine + head * 5.0);
  col += vec3(1.0, 0.82, 0.76) * (train * 0.9 + head * 2.5) * core * uGain * near;
  col = applyFog(col, vWorld);
  gl_FragColor = vec4(col, 1.0);
}
`;
