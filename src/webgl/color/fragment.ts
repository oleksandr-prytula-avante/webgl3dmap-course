export const fragmentShader = `
precision highp float;

varying vec2 v_texcoord;

uniform float scale;
uniform sampler2D displacementMap;

void main() {
  float offset = 0.01;

  vec2 uv0 = v_texcoord;
  vec2 uv1 = v_texcoord + vec2(offset, 0);
  vec2 uv2 = v_texcoord + vec2(0, offset);

  vec4 tex0 = texture2D(displacementMap, uv0);
  vec4 tex1 = texture2D(displacementMap, uv1);
  vec4 tex2 = texture2D(displacementMap, uv2);

  float h0 = (tex0.r + tex0.g + tex0.b) * 0.33;
  float h1 = (tex1.r + tex1.g + tex1.b) * 0.33;
  float h2 = (tex2.r + tex2.g + tex2.b) * 0.33;

  vec3 p0 = vec3(uv0, h0 * scale);
  vec3 p1 = vec3(uv1, h1 * scale);
  vec3 p2 = vec3(uv2, h2 * scale);

  vec3 v0 = p1 - p0;
  vec3 v1 = p2 - p0;

  vec3 color = vec3(tex0.r, tex0.g, tex0.b);

  vec3 normal = normalize(cross(v1, v0));
  vec3 lightDir = normalize(vec3(1, -3, 2));
  float light = dot(lightDir, normal);

  gl_FragColor = vec4(color * (light * 0.5 + 0.5), 1);
}`;
