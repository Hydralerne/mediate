// GrayscaleShader.js
import { Shaders, Node, GLSL } from 'gl-react';

export const shaders = Shaders.create({
  Grayscale: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      uniform sampler2D video;

      void main () {
        vec4 color = texture2D(video, uv);
        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        gl_FragColor = vec4(vec3(gray), color.a);
      }
    `
  }
});

export const Grayscale = ({ children }) => (
  <Node shader={shaders.Grayscale} uniforms={{ video: children }} />
);
