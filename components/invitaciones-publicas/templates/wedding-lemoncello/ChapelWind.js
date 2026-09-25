import { useEffect, useRef, useState } from 'react';
import composition from './gardenComposition.json';

const { width, height } = composition.landscape;
const VERTEX = [
  'attribute vec2 position;',
  'varying vec2 uv;',
  'void main() {',
  '  uv = vec2((position.x + 1.0) * 0.5, (1.0 - position.y) * 0.5);',
  '  gl_Position = vec4(position, 0.0, 1.0);',
  '}',
].join('\n');
const FRAGMENT = [
  'precision highp float;',
  'varying vec2 uv;',
  'uniform sampler2D painting;',
  'uniform float time;',
  'uniform vec2 size;',
  // Soft inverse sampling bends crowns, fading to zero above roots and baskets.
  'float crown(vec2 p, float x, float top, float bottom, float radius) {',
  '  float bend = clamp((bottom - p.y) / (bottom - top), 0.0, 1.0);',
  '  float spread = mix(radius, 12.0, bend);',
  '  return bend * smoothstep(top - 18.0, top + 4.0, p.y)',
  '    * (1.0 - smoothstep(spread - 5.0, spread + 9.0, abs(p.x - x)));',
  '}',
  'void main() {',
  '  vec2 p = uv * size;',
  '  float nearWind = 3.64 * sin(time * 6.2831853 / 7.6);',
  '  float farWind = 2.08 * sin(time * 6.2831853 / 9.1 + 1.4);',
  '  float dx = nearWind * (crown(p, 1282.0, 446.0, 647.0, 30.0)',
  '    + 0.88 * crown(p, 1545.0, 442.0, 647.0, 31.0));',
  '  dx += farWind * (crown(p, 1233.0, 458.0, 646.0, 26.0)',
  '    + 0.72 * crown(p, 1190.0, 515.0, 646.0, 22.0)',
  '    + crown(p, 1586.0, 477.0, 646.0, 24.0)',
  '    + 0.65 * crown(p, 1620.0, 522.0, 643.0, 20.0));',
  '  gl_FragColor = texture2D(painting, (p - vec2(dx, 0.0)) / size);',
  '}',
].join('\n');

export default function ChapelWind({ source, className }) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
    // The preloaded original img remains visible if acceleration is unavailable.
    if (!gl) return undefined;
    let frame = 0, disposed = false, loaded = false, timeLocation;
    const shaders = [];
    const program = gl.createProgram(), buffer = gl.createBuffer(), texture = gl.createTexture();
    const compile = (type, sourceCode) => {
      const shader = gl.createShader(type);
      shaders.push(shader);
      gl.shaderSource(shader, sourceCode); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return false;
      gl.attachShader(program, shader); return true;
    };
    const image = new Image();
    const paint = timestamp => {
      if (disposed || !loaded || gl.isContextLost()) return;
      // Keep the breeze continuous while the ceremony/reception text changes.
      gl.uniform1f(timeLocation, timestamp / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frame = requestAnimationFrame(paint);
    };
    const visibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden && loaded) frame = requestAnimationFrame(paint);
    };
    const lost = event => { event.preventDefault(); cancelAnimationFrame(frame); setReady(false); };
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
        gl.uniform2f(gl.getUniformLocation(program, 'size'), width, height);
        timeLocation = gl.getUniformLocation(program, 'time');
        gl.viewport(0, 0, width, height);
        image.onload = () => {
          if (disposed || gl.isContextLost()) return;
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
          loaded = true;
          paint(performance.now());
          setReady(true);
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
      gl.deleteTexture(texture); gl.deleteBuffer(buffer); gl.deleteProgram(program);
      shaders.forEach(shader => gl.deleteShader(shader));
    };
  }, [source, generation]);

  return <canvas ref={canvasRef} width={width} height={height} className={className}
    style={{ visibility: ready ? 'visible' : 'hidden' }} aria-hidden="true" data-chapel-wind data-wind-ready={ready} />;
}
