/* global React */
// WebGL2 procedural brick-wall shader.
// Reveals bricks bottom→top as `reveal` (0..1) moves.
// Pattern + palette sampled from the reference image: warm red/orange running-bond bricks with cream mortar.
const { useEffect, useRef } = React;

const VERT_SRC = `#version 300 es
precision highp float;
layout(location=0) in vec2 a_pos;
out vec2 v_uv;
void main(){
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG_SRC = `#version 300 es
precision highp float;

out vec4 fragColor;
in vec2 v_uv;

uniform vec3  iResolution;   // (w, h, dpr)
uniform float iTime;
uniform float iReveal;       // 0..1 scroll-driven reveal
uniform float iScroll;       // continuous vertical offset (parallax)

// ──── brick geometry ────
const float BRICK_W   = 0.180;   // brick width (in screen-height units)
const float BRICK_H   = 0.078;   // brick height
const float MORTAR    = 0.0085;  // mortar thickness
const float BEVEL     = 0.015;   // soft edge inside the brick

// ──── colors (warm NYC brick + cream mortar) ────
const vec3 BRICK_HOT  = vec3(0.86, 0.40, 0.18);   // hot tile
const vec3 BRICK_MID  = vec3(0.72, 0.31, 0.13);   // copper-brick mid
const vec3 BRICK_DEEP = vec3(0.50, 0.18, 0.09);   // deep terracotta
const vec3 BRICK_DARK = vec3(0.28, 0.10, 0.05);   // shadow rim
const vec3 MORTAR_COL = vec3(0.95, 0.92, 0.84);   // limestone cream

// ──── helpers ────
float hash21(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  float a=hash21(i), b=hash21(i+vec2(1,0)), c=hash21(i+vec2(0,1)), d=hash21(i+vec2(1,1));
  vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
// Film grain (procedural)
float grain(vec2 p, float t){
  return fract(sin(dot(p, vec2(12.9898,78.233)) + t) * 43758.5453);
}

void main(){
  vec2  R  = iResolution.xy;
  vec2  uv = (gl_FragCoord.xy - 0.5*R) / max(R.y, 1.0);

  // slow parallax + scroll-driven offset
  float yShift = iScroll * 1.6 + iTime * 0.012;
  vec2  bUV = vec2(uv.x, uv.y + yShift);

  // ── running-bond offset (every other row shifts half a brick) ──
  float row    = floor(bUV.y / BRICK_H);
  float rowOdd = mod(row, 2.0);
  float xOff   = rowOdd * (BRICK_W * 0.5);

  vec2 cell = vec2(
    fract((bUV.x + xOff) / BRICK_W),
    fract(bUV.y / BRICK_H)
  );
  vec2 brickIdx = vec2(floor((bUV.x + xOff) / BRICK_W), row);

  // ── distance to nearest mortar edge (for AA mortar + bevel) ──
  vec2 d = vec2(min(cell.x, 1.0 - cell.x) * BRICK_W,
                min(cell.y, 1.0 - cell.y) * BRICK_H);
  float edge = min(d.x, d.y);                     // dist to brick edge
  float aa   = fwidth(edge);
  float isMortar = 1.0 - smoothstep(MORTAR, MORTAR + aa, edge);

  // ── per-brick color variation ──
  float h    = hash21(brickIdx);
  float h2   = hash21(brickIdx + 7.13);
  vec3  base = mix(BRICK_MID, BRICK_HOT, smoothstep(0.0, 1.0, h));
  base       = mix(base, BRICK_DEEP, step(0.78, h2) * 0.7);

  // micro-noise inside each brick (texture / wear)
  vec2 inBrick = vec2(cell.x * BRICK_W, cell.y * BRICK_H) * 60.0 + brickIdx * 13.0;
  float n  = vnoise(inBrick);
  float n2 = vnoise(inBrick * 3.7 + 17.0);
  base    *= 0.86 + 0.28 * n;                    // splotchy paint
  base    += (n2 - 0.5) * 0.06;                  // tiny speckle

  // soft bevel — darker inside the brick near edges (depth)
  float bevel = smoothstep(MORTAR, MORTAR + BEVEL, edge);
  vec3 beveled = mix(BRICK_DARK, base, bevel);

  // top-edge highlight (light comes from upper-left)
  float topHL = smoothstep(BRICK_H * 0.5, BRICK_H * 0.5 - 0.012, (1.0 - cell.y) * BRICK_H);
  beveled += topHL * 0.06 * vec3(1.0, 0.92, 0.78) * bevel;

  // mortar with subtle dirt
  vec3 mortar = MORTAR_COL * (0.92 + 0.16 * vnoise(brickIdx * 9.0 + cell * 30.0));

  vec3 col = mix(beveled, mortar, isMortar);

  // ── scroll-reveal: bricks fade in row-by-row from bottom ──
  // The visible band is a horizontal strip of brightness iReveal (in 0..1 over the section).
  // We compute a per-row reveal threshold so lower rows reveal first.
  float v01     = (uv.y + 0.5);                  // 0 bottom → 1 top of view
  float rowThr  = clamp(iReveal * 1.25 - v01 * 0.85, 0.0, 1.0);
  // crisp leading edge for that "wipe" feel
  float wipe    = smoothstep(0.0, 0.08, rowThr);

  // before reveal: deep asphalt; after: brick
  vec3 dark     = vec3(0.08, 0.07, 0.06);
  col           = mix(dark, col, wipe);

  // ── soft vignette so edges feel like real wall lighting ──
  float r = length(uv * vec2(0.85, 1.0));
  col *= 1.0 - 0.32 * smoothstep(0.4, 1.2, r);

  // ── film grain (tied to time so it shimmers, low amplitude) ──
  float g = grain(gl_FragCoord.xy, fract(iTime));
  col += (g - 0.5) * 0.025;

  // light overall warm tint
  col *= vec3(1.02, 0.98, 0.93);

  fragColor = vec4(col, 1.0);
}
`;

function compile(gl, type, src){
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src); gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn('shader compile error', gl.getShaderInfoLog(sh));
    gl.deleteShader(sh); return null;
  }
  return sh;
}
function link(gl, vs, fs){
  const p = gl.createProgram(); gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.warn('link error', gl.getProgramInfoLog(p));
    gl.deleteProgram(p); return null;
  }
  return p;
}

function BrickShader({ revealRef, scrollRef, style }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const startRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2', { premultipliedAlpha: false, antialias: false });
    if (!gl) { canvas.style.background = 'linear-gradient(180deg, #9C3A1A, #6B210C)'; return; }

    let disposed = false;
    const vao = gl.createVertexArray();
    const vbo = gl.createBuffer();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const vs = compile(gl, gl.VERTEX_SHADER, VERT_SRC);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vs || !fs) return;
    const prog = link(gl, vs, fs);
    if (!prog) return;
    gl.deleteShader(vs); gl.deleteShader(fs);

    const uRes     = gl.getUniformLocation(prog, 'iResolution');
    const uTime    = gl.getUniformLocation(prog, 'iTime');
    const uReveal  = gl.getUniformLocation(prog, 'iReveal');
    const uScroll  = gl.getUniformLocation(prog, 'iScroll');

    const getDpr = () => Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    function resize() {
      const dpr = getDpr();
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    }
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    startRef.current = performance.now();

    function tick(now){
      if (disposed) return;
      resize();
      const t = (now - startRef.current) / 1000;
      gl.useProgram(prog);
      gl.uniform3f(uRes, canvas.width, canvas.height, getDpr());
      gl.uniform1f(uTime, t);
      gl.uniform1f(uReveal, revealRef?.current ?? 1);
      gl.uniform1f(uScroll, scrollRef?.current ?? 0);
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafRef.current);
      try { ro.disconnect(); } catch(e){}
      try { gl.deleteBuffer(vbo); } catch(e){}
      try { gl.deleteVertexArray(vao); } catch(e){}
      try { gl.deleteProgram(prog); } catch(e){}
    };
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, ...style }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}

window.BrickShader = BrickShader;
