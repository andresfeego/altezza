import { useEffect, useRef, useState } from 'react';

// Coordinates belong to closing-coast-night-v1, not the viewport. Keeping the
// original aspect ratio registers the water with the still painting at every size.
const WIDTH = 948, HEIGHT = 1659;
const VERTEX = `
attribute vec2 position;
varying vec2 uv;
void main() {
  uv = vec2((position.x + 1.0) * 0.5, (1.0 - position.y) * 0.5);
  gl_Position = vec4(position, 0.0, 1.0);
}`;
const FRAGMENT = `
precision highp float;
varying vec2 uv;
uniform sampler2D painting;
uniform float time;
void main() {
  vec2 size = vec2(948.0, 1659.0);
  vec2 p = uv * size;
  // Stay clear of the coastline and the three small boats. The far water barely
  // moves; a broad feather blends it into the slightly stronger foreground swell.
  float shore = mix(1250.0, 1220.0, smoothstep(0.0, 200.0, p.x));
  shore = mix(shore, 1168.0, smoothstep(210.0, 475.0, p.x));
  shore = mix(shore, 1116.0, smoothstep(480.0, 700.0, p.x));
  float water = smoothstep(shore, shore + 40.0, p.y);
  float depth = clamp((p.y - 1080.0) / 579.0, 0.0, 1.0);
  float dx = water * (1.9 + 5.4 * depth) *
    (sin(p.y * 0.12 - time * 1.2) + 0.35 * sin(p.y * 0.047 + time * 0.8 + p.x * 0.009));
  float dy = water * (0.7 + 1.6 * depth) * sin(p.x * 0.019 + p.y * 0.08 - time * 1.1);
  vec4 color = texture2D(painting, (p + vec2(dx, dy)) / size);
  // Breathe through the painted reflections, without adding new light or color.
  color.rgb *= 1.0 + water * 0.04 * sin(time * 0.9 + p.y * 0.06 + p.x * 0.002);
  gl_FragColor = color;
}`;

export default function ClosingWater({ source, className }) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
    // The original img stays underneath as a fallback for unsupported GPUs.
    if (!gl) return undefined;
    let frame = 0, disposed = false, loaded = false, contextWasLost = false, lastPaint = -Infinity;
    let elapsed = 0, previousTime = null, timeLocation;
    const shaders = [];
    const program = gl.createProgram(), buffer = gl.createBuffer(), texture = gl.createTexture();
    const compile = (type, code) => {
      const shader = gl.createShader(type);
      shaders.push(shader);
      gl.shaderSource(shader, code); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return false;
      gl.attachShader(program, shader); return true;
    };
    const image = new Image();
    const paint = timestamp => {
      if (disposed || !loaded || document.hidden || gl.isContextLost()) return;
      if (previousTime !== null) elapsed += Math.min(timestamp - previousTime, 100);
      previousTime = timestamp;
      if (timestamp - lastPaint >= 1000 / 30) {
        gl.uniform1f(timeLocation, elapsed / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        lastPaint = timestamp;
      }
      frame = requestAnimationFrame(paint);
    };
    const visibility = () => {
      cancelAnimationFrame(frame); previousTime = null;
      if (!document.hidden && loaded) frame = requestAnimationFrame(paint);
    };
    const lost = event => { event.preventDefault(); contextWasLost = true; cancelAnimationFrame(frame); setReady(false); };
    const restored = () => setGeneration(value => value + 1);
    canvas.addEventListener('webglcontextlost', lost);
    canvas.addEventListener('webglcontextrestored', restored);
    document.addEventListener('visibilitychange', visibility);
    setReady(false);
    if (compile(gl.VERTEX_SHADER, VERTEX) && compile(gl.FRAGMENT_SHADER, FRAGMENT)) {
      gl.linkProgram(program);
      if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
        const position = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.uniform1i(gl.getUniformLocation(program, 'painting'), 0);
        timeLocation = gl.getUniformLocation(program, 'time');
        gl.viewport(0, 0, WIDTH, HEIGHT);
        image.onload = () => {
          if (disposed || gl.isContextLost()) return;
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
          loaded = true;
          gl.uniform1f(timeLocation, 0);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
          setReady(true);
          visibility();
        };
        image.src = source;
      }
    }
    return () => {
      disposed = true; image.onload = null;
      cancelAnimationFrame(frame);
      canvas.removeEventListener('webglcontextlost', lost);
      canvas.removeEventListener('webglcontextrestored', restored);
      document.removeEventListener('visibilitychange', visibility);
      // A restored context has already discarded resources from its old generation.
      if (!contextWasLost) {
        gl.deleteTexture(texture); gl.deleteBuffer(buffer); gl.deleteProgram(program);
        shaders.forEach(shader => gl.deleteShader(shader));
      }
    };
  }, [source, generation]);

  return <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} className={className}
    style={{ visibility: ready ? 'visible' : 'hidden' }} aria-hidden="true" data-closing-water data-water-ready={ready} />;
}
