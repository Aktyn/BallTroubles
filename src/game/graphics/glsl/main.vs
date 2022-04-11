attribute vec4 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTextureCoord;

void main() {
  vTextureCoord = aVertexPosition.xy * 0.5 + 0.5;
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}