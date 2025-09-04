
"use client";
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const BayerDitheringBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl2');
    if (!gl) {
      console.error("WebGL 2 not supported");
      return;
    }

    const renderer = new THREE.WebGLRenderer({ canvas, context: gl });

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform vec2 uResolution;
      uniform float uTime;

      const float PIXEL_SIZE = 4.0; // Size of each pixel in the Bayer matrix
      const float CELL_PIXEL_SIZE = 8.0 * PIXEL_SIZE; // 8x8 Bayer matrix

      // Bayer 8x8 dithering shader with direction-free fBm animation
      // The noise mutates in-place (no visible drift) by sampling 3-D value noise
      // where time is treated as the third dimension.

      out vec4 fragColor;

      // Bayer matrix helpers (ordered dithering thresholds)
      float Bayer2(vec2 a) {
          a = floor(a);
          return fract(a.x / 2. + a.y * a.y * .75);
      }

      #define Bayer4(a) (Bayer2(.5*(a))*0.25 + Bayer2(a))
      #define Bayer8(a) (Bayer4(.5*(a))*0.25 + Bayer2(a))

      #define FBM_OCTAVES     5
      #define FBM_LACUNARITY  1.25
      #define FBM_GAIN        1.
      #define FBM_SCALE       4.0          // master scale for uv

      /*-------------------------------------------------------------
        1-D hash and 3-D value-noise helpers (unchanged)
      -------------------------------------------------------------*/
      float hash11(float n) { return fract(sin(n)*43758.5453); }

      float vnoise(vec3 p)
      {
          vec3 ip = floor(p);
          vec3 fp = fract(p);

          float n000 = hash11(dot(ip + vec3(0.0,0.0,0.0), vec3(1.0,57.0,113.0)));
          float n100 = hash11(dot(ip + vec3(1.0,0.0,0.0), vec3(1.0,57.0,113.0)));
          float n010 = hash11(dot(ip + vec3(0.0,1.0,0.0), vec3(1.0,57.0,113.0)));
          float n110 = hash11(dot(ip + vec3(1.0,1.0,0.0), vec3(1.0,57.0,113.0)));
          float n001 = hash11(dot(ip + vec3(0.0,0.0,1.0), vec3(1.0,57.0,113.0)));
          float n101 = hash11(dot(ip + vec3(1.0,0.0,1.0), vec3(1.0,57.0,113.0)));
          float n011 = hash11(dot(ip + vec3(0.0,1.0,1.0), vec3(1.0,57.0,113.0)));
          float n111 = hash11(dot(ip + vec3(1.0,1.0,1.0), vec3(1.0,57.0,113.0)));

          vec3 w = fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);   // smootherstep

          float x00 = mix(n000, n100, w.x);
          float x10 = mix(n010, n110, w.x);
          float x01 = mix(n001, n101, w.x);
          float x11 = mix(n011, n111, w.x);

          float y0  = mix(x00, x10, w.y);
          float y1  = mix(x01, x11, w.y);

          return mix(y0, y1, w.z) * 2.0 - 1.0;         // [-1,1]
      }

      /*-------------------------------------------------------------
        Stable fBm – no default args, loop fully static
      -------------------------------------------------------------*/
      float fbm2(vec2 uv, float t)
      {
          vec3 p   = vec3(uv * FBM_SCALE, t);
          float amp  = 1.;
          float freq = 1.;
          float sum  = 1.;

          for (int i = 0; i < FBM_OCTAVES; ++i)
          {
              sum  += amp * vnoise(p * freq);
              freq *= FBM_LACUNARITY;
              amp  *= FBM_GAIN;
          }
          
          return sum * 0.5 + 0.5;   // [0,1]
      }

      void main() {
          float pixelSize = PIXEL_SIZE; // Size of each pixel in the Bayer matrix
          vec2 fragCoord = gl_FragCoord.xy - uResolution * .5;

          // Calculate the UV coordinates for the grid
          float aspectRatio = uResolution.x / uResolution.y;

          vec2 pixelId = floor(fragCoord / pixelSize); // integer Bayer cell
          vec2 pixelUV = fract(fragCoord / pixelSize); 

          float cellPixelSize =  8. * pixelSize; // 8x8 Bayer matrix
          vec2 cellId = floor(fragCoord / cellPixelSize); // integer Bayer cell
          
          vec2 cellCoord = cellId * cellPixelSize;
          
          
          vec2 uv = ((cellCoord / (uResolution) )) * vec2(aspectRatio, 1.0);

          float feed = fbm2(uv, uTime * 0.1);
              
          float brightness = -.65;
          float contrast = .5;
          feed = feed * contrast + brightness; // Apply contrast and brightness adjustments

          float bayerValue = Bayer8(fragCoord / pixelSize) - .5;
          
          float bw = step(0.5, feed + bayerValue);

          fragColor = vec4(vec3(bw), 1.0);
      }
    `;

    const uniforms = {
      uResolution: { value: new THREE.Vector2() },
      uTime: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      glslVersion: THREE.GLSL3
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width, height);
    };

    window.addEventListener('resize', resize);
    resize();

    const clock = new THREE.Clock();
    const render = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      // Clean up Three.js resources if needed
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />;
};

export default BayerDitheringBackground;
