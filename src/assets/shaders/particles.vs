attribute float size;
attribute float zoom;
attribute float canvasHeight;

varying vec3 vColor;

#define HEIGHT 1024.0

void main() {
  vColor = color;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  gl_PointSize = size / -mvPosition.z * zoom * canvasHeight / HEIGHT;
  gl_Position = projectionMatrix * mvPosition;
}