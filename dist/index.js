var O = Object.defineProperty;
var V = (o, e, n) => e in o ? O(o, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : o[e] = n;
var v = (o, e, n) => (V(o, typeof e != "symbol" ? e + "" : e, n), n);
var M = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function U(o) {
  return o && o.__esModule && Object.prototype.hasOwnProperty.call(o, "default") ? o.default : o;
}
var N = { exports: {} };
(function(o, e) {
  (function(n, t) {
    o.exports = t();
  })(M, function() {
    var n = function() {
      function t(f) {
        return r.appendChild(f.dom), f;
      }
      function i(f) {
        for (var d = 0; d < r.children.length; d++)
          r.children[d].style.display = d === f ? "block" : "none";
        s = f;
      }
      var s = 0, r = document.createElement("div");
      r.style.cssText = "position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000", r.addEventListener("click", function(f) {
        f.preventDefault(), i(++s % r.children.length);
      }, !1);
      var m = (performance || Date).now(), l = m, a = 0, g = t(new n.Panel("FPS", "#0ff", "#002")), z = t(new n.Panel("MS", "#0f0", "#020"));
      if (self.performance && self.performance.memory)
        var _ = t(new n.Panel("MB", "#f08", "#201"));
      return i(0), { REVISION: 16, dom: r, addPanel: t, showPanel: i, begin: function() {
        m = (performance || Date).now();
      }, end: function() {
        a++;
        var f = (performance || Date).now();
        if (z.update(f - m, 200), f > l + 1e3 && (g.update(1e3 * a / (f - l), 100), l = f, a = 0, _)) {
          var d = performance.memory;
          _.update(d.usedJSHeapSize / 1048576, d.jsHeapSizeLimit / 1048576);
        }
        return f;
      }, update: function() {
        m = this.end();
      }, domElement: r, setMode: i };
    };
    return n.Panel = function(t, i, s) {
      var r = 1 / 0, m = 0, l = Math.round, a = l(window.devicePixelRatio || 1), g = 80 * a, z = 48 * a, _ = 3 * a, f = 2 * a, d = 3 * a, x = 15 * a, p = 74 * a, h = 30 * a, b = document.createElement("canvas");
      b.width = g, b.height = z, b.style.cssText = "width:80px;height:48px";
      var c = b.getContext("2d");
      return c.font = "bold " + 9 * a + "px Helvetica,Arial,sans-serif", c.textBaseline = "top", c.fillStyle = s, c.fillRect(0, 0, g, z), c.fillStyle = i, c.fillText(t, _, f), c.fillRect(d, x, p, h), c.fillStyle = s, c.globalAlpha = 0.9, c.fillRect(d, x, p, h), { dom: b, update: function(S, L) {
        r = Math.min(r, S), m = Math.max(m, S), c.fillStyle = s, c.globalAlpha = 1, c.fillRect(0, 0, g, x), c.fillStyle = i, c.fillText(l(S) + " " + t + " (" + l(r) + "-" + l(m) + ")", _, f), c.drawImage(b, d + a, x, p - a, h, d, x, p - a, h), c.fillRect(d + p - a, x, a, h), c.fillStyle = s, c.globalAlpha = 0.9, c.fillRect(d + p - a, x, a, l((1 - S / L) * h));
      } };
    }, n;
  });
})(N);
var G = N.exports;
const q = /* @__PURE__ */ U(G), {
  ARRAY_BUFFER: T,
  COLOR_ATTACHMENT0: k,
  COMPILE_STATUS: $,
  ELEMENT_ARRAY_BUFFER: H,
  FLOAT: A,
  FLOAT_MAT4: j,
  FLOAT_VEC4: W,
  FRAMEBUFFER: w,
  FRAMEBUFFER_COMPLETE: Y,
  INT: X,
  LINEAR: I,
  LINK_STATUS: J,
  RGBA: P,
  STATIC_DRAW: K,
  TEXTURE_2D: y,
  TEXTURE_MAG_FILTER: Z,
  TEXTURE_MIN_FILTER: Q,
  TEXTURE0: ee,
  UNSIGNED_BYTE: ne,
  UNSIGNED_SHORT: te
} = WebGL2RenderingContext;
class ie {
  constructor({ webgl: e, config: n, dimensions: { width: t, height: i } }) {
    v(this, "webgl");
    v(this, "config");
    v(this, "program");
    v(this, "uniforms", {});
    v(this, "buffers", {});
    v(this, "texture", null);
    v(this, "framebuffer", null);
    v(this, "positionAttribute");
    this.webgl = e, this.config = n;
    const s = this.webgl.createProgram();
    if (!s)
      throw new Error("unable to create program");
    this.program = s, this.config.shaders.forEach(
      (r) => this.attachShader(r)
    ), this.config.buffers.forEach(
      (r) => this.createBuffer(r)
    ), this.config.drawToFramebuffer && this.createFramebuffer(t, i), this.linkProgram(), this.config.uniforms.forEach(
      (r) => this.createUniform(r)
    ), this.positionAttribute = this.webgl.getAttribLocation(
      this.program,
      "a_position"
    );
  }
  use() {
    this.webgl.useProgram(this.program), this.config.uniforms.forEach(
      (e) => this.setUniform(e)
    ), this.config.buffers.forEach((e) => this.setBuffer(e));
  }
  draw(e) {
    this.config.drawToFramebuffer && (this.webgl.bindFramebuffer(w, this.framebuffer), this.webgl.clear(
      this.webgl.COLOR_BUFFER_BIT | this.webgl.DEPTH_BUFFER_BIT
    ));
    const n = this.getUniform("u_t");
    this.webgl.uniform1f(n, e);
    let t = 0;
    this.config.buffers.forEach((i) => {
      t = this.drawBuffer(i, t);
    }), this.config.drawToFramebuffer && (this.webgl.bindFramebuffer(w, null), this.webgl.activeTexture(ee), this.webgl.bindTexture(y, this.texture));
  }
  getUniform(e) {
    return this.uniforms[e] ?? null;
  }
  getBuffer(e) {
    const n = this.buffers[e];
    if (!n)
      throw new Error(`buffer ${e} not found`);
    return n;
  }
  attachShader({ name: e, type: n, source: t }) {
    const i = this.webgl.createShader(n);
    if (!i)
      throw new Error(`unable to create shader ${e}`);
    if (this.webgl.shaderSource(i, t), this.webgl.compileShader(i), !this.webgl.getShaderParameter(i, $)) {
      const s = this.webgl.getShaderInfoLog(i);
      throw new Error(`unable to compile shader ${e}:
${s}`);
    }
    this.webgl.attachShader(this.program, i);
  }
  createUniform({ name: e }) {
    const n = this.webgl.getUniformLocation(this.program, e);
    n && (this.uniforms[e] = n);
  }
  createBuffer({ name: e, type: n, values: t }) {
    const i = this.webgl.createBuffer();
    if (!i)
      throw new Error(`unable to create buffer ${e}`);
    this.webgl.bindBuffer(n, i), this.webgl.bufferData(n, t, K), this.buffers[e] = i;
  }
  createFramebuffer(e, n) {
    if (this.texture = this.webgl.createTexture(), this.webgl.bindTexture(y, this.texture), this.webgl.texParameteri(y, Q, I), this.webgl.texParameteri(y, Z, I), this.webgl.texImage2D(
      y,
      0,
      P,
      e,
      n,
      0,
      P,
      ne,
      null
    ), this.framebuffer = this.webgl.createFramebuffer(), this.webgl.bindFramebuffer(w, this.framebuffer), this.webgl.framebufferTexture2D(
      w,
      k,
      y,
      this.texture,
      0
    ), this.webgl.checkFramebufferStatus(w) !== Y)
      throw new Error("framebuffer is not complete");
    this.webgl.bindFramebuffer(w, null);
  }
  linkProgram() {
    if (this.webgl.linkProgram(this.program), !this.webgl.getProgramParameter(this.program, J)) {
      const e = this.webgl.getProgramInfoLog(this.program);
      throw new Error(`unable to link program:
${e}`);
    }
  }
  setUniform({ name: e, type: n, value: t }) {
    const i = this.getUniform(e);
    if (i)
      switch (n) {
        case A:
          this.webgl.uniform1f(i, t);
          break;
        case X:
          this.webgl.uniform1i(i, t);
          break;
        case W:
          this.webgl.uniform4f(i, t[0], t[1], t[2], t[3]);
          break;
        case j:
          this.webgl.uniformMatrix4fv(i, !1, t);
          break;
        default:
          throw new Error(
            `could not create uniform ${e}, unexpected type ${n}`
          );
      }
  }
  setBuffer({ name: e, type: n }) {
    const t = this.getBuffer(e);
    this.webgl.bindBuffer(n, t), n === T && this.enableVertexAttribute();
  }
  enableVertexAttribute() {
    this.webgl.vertexAttribPointer(
      this.positionAttribute,
      3,
      A,
      !1,
      0,
      0
    ), this.webgl.enableVertexAttribArray(this.positionAttribute);
  }
  drawBuffer({ name: e, type: n, mode: t, drawCount: i, values: s }, r) {
    const m = this.getBuffer(e);
    this.webgl.bindBuffer(n, m);
    const l = this.getUniform("u_bufferIndex");
    let a = r;
    for (let g = 0; g < i; g++) {
      switch (this.webgl.uniform1i(l, a), n) {
        case H:
          this.webgl.drawElements(t, s.length, te, 0);
          break;
        case T: {
          this.webgl.drawArrays(t, 0, s.length / 3);
          break;
        }
        default:
          throw new Error(
            `could not draw buffer ${e}, unexpected type ${n}`
          );
      }
      a++;
    }
    return a;
  }
}
const {
  BLEND: oe,
  COLOR_BUFFER_BIT: re,
  DEPTH_BUFFER_BIT: se,
  DEPTH_TEST: ae,
  ONE_MINUS_SRC_ALPHA: ce,
  SRC_ALPHA: fe
} = WebGL2RenderingContext;
class le {
  constructor({
    window: e,
    webgl: n,
    config: t,
    dimensions: { width: i, height: s },
    stats: r
  }) {
    v(this, "window");
    v(this, "webgl");
    v(this, "config");
    v(this, "programs", []);
    v(this, "stats");
    this.window = e, this.webgl = n, this.config = t, this.stats = r, this.webgl.enable(ae), this.webgl.enable(oe), this.webgl.blendFunc(fe, ce), this.linkPrograms(i, s);
  }
  run() {
    this.programs.length === 1 && this.programs[0].use();
    const e = (n) => {
      var t, i;
      this.window.requestAnimationFrame(e), (t = this.stats) == null || t.begin(), this.renderFrame(n), (i = this.stats) == null || i.end();
    };
    this.window.requestAnimationFrame(e);
  }
  linkPrograms(e, n) {
    this.config.programs.forEach((t) => {
      const i = new ie({
        webgl: this.webgl,
        config: t,
        dimensions: { width: e, height: n }
      });
      this.programs.push(i);
    });
  }
  clear() {
    this.webgl.clearColor(0, 0, 0, 0), this.webgl.clear(re | se);
  }
  renderFrame(e) {
    this.clear(), this.programs.forEach((n) => {
      this.programs.length > 1 && n.use(), n.draw(e);
    });
  }
}
var de = `#version 300 es
#extension GL_GOOGLE_include_directive : enable

precision mediump float;
precision mediump int;

uniform int u_bufferIndex;
uniform float u_t;
uniform vec4 u_edgeColor;
uniform vec4 u_faceColor;
uniform vec4 u_birdColor;
uniform vec4 u_shadowColor;

in vec2 v_uv;
in mat4 v_projectionMatrix;
in mat4 v_birdDisplacements;
in float v_isBirdVertexValid;
out vec4 out_color; 

const float shadowRadius = 0.1;
const float shadowOffset = 0.058;

void main() {
  mat4 displacements = v_projectionMatrix * v_birdDisplacements;
  vec2 heights = vec2(
    displacements[0].y,
    displacements[1].y
  ) + 1.0 / 2.0;
  vec2 birdDistances = vec2(
    distance(v_uv, displacements[0].xz),
    distance(v_uv, displacements[1].xz)
  );
  
  vec4 shadowColor = mix(u_faceColor, u_shadowColor, 0.1);
  vec2 shadowSizes = heights * shadowRadius - shadowOffset;
  vec2 shadowValues = vec2(
    smoothstep(0.0, clamp(shadowSizes[0], 0.0, 1.0), birdDistances[0]),
    smoothstep(0.0, clamp(shadowSizes[1], 0.0, 1.0), birdDistances[1])
  );
  vec4 finalColor = mix(shadowColor, u_faceColor, min(shadowValues[0], shadowValues[1]));

  vec4 birdColor = v_isBirdVertexValid * u_birdColor + (1.0 - v_isBirdVertexValid) * vec4(0.0);

  out_color = mat4(
    finalColor,
    u_edgeColor,
    birdColor,
    birdColor
  )[u_bufferIndex];
}`, ve = `#version 300 es
#extension GL_GOOGLE_include_directive : enable

precision mediump float;
precision mediump int;

float psrdnoise(vec2 x, vec2 period, float alpha, out vec2 gradient) {

	
	vec2 uv = vec2(x.x + x.y*0.5, x.y);

	
	vec2 i0 = floor(uv);
	vec2 f0 = fract(uv);
	
	float cmp = step(f0.y, f0.x);
	vec2 o1 = vec2(cmp, 1.0-cmp);

	
	vec2 i1 = i0 + o1;
	vec2 i2 = i0 + vec2(1.0, 1.0);

	
	vec2 v0 = vec2(i0.x - i0.y * 0.5, i0.y);
	vec2 v1 = vec2(v0.x + o1.x - o1.y * 0.5, v0.y + o1.y);
	vec2 v2 = vec2(v0.x + 0.5, v0.y + 1.0);

	
	vec2 x0 = x - v0;
	vec2 x1 = x - v1;
	vec2 x2 = x - v2;

	vec3 iu, iv;
	vec3 xw, yw;

	
	if(any(greaterThan(period, vec2(0.0)))) {
		xw = vec3(v0.x, v1.x, v2.x);
		yw = vec3(v0.y, v1.y, v2.y);
		if(period.x > 0.0)
			xw = mod(vec3(v0.x, v1.x, v2.x), period.x);
		if(period.y > 0.0)
			yw = mod(vec3(v0.y, v1.y, v2.y), period.y);
		
		iu = floor(xw + 0.5*yw + 0.5);
		iv = floor(yw + 0.5);
	} else { 
		iu = vec3(i0.x, i1.x, i2.x);
		iv = vec3(i0.y, i1.y, i2.y);
	}

	
	vec3 hash = mod(iu, 289.0);
	hash = mod((hash*51.0 + 2.0)*hash + iv, 289.0);
	hash = mod((hash*34.0 + 10.0)*hash, 289.0);

	
	vec3 psi = hash * 0.07482 + alpha;
	vec3 gx = cos(psi);
	vec3 gy = sin(psi);

	
	vec2 g0 = vec2(gx.x,gy.x);
	vec2 g1 = vec2(gx.y,gy.y);
	vec2 g2 = vec2(gx.z,gy.z);

	
	vec3 w = 0.8 - vec3(dot(x0, x0), dot(x1, x1), dot(x2, x2));
	w = max(w, 0.0);
	vec3 w2 = w * w;
	vec3 w4 = w2 * w2;

	
	vec3 gdotx = vec3(dot(g0, x0), dot(g1, x1), dot(g2, x2));

	
	float n = dot(w4, gdotx);

	
	vec3 w3 = w2 * w;
	vec3 dw = -8.0 * w3 * gdotx;
	vec2 dn0 = w4.x * g0 + dw.x * x0;
	vec2 dn1 = w4.y * g1 + dw.y * x1;
	vec2 dn2 = w4.z * g2 + dw.z * x2;
	gradient = 10.9 * (dn0 + dn1 + dn2);

	
	return 10.9 * n;
}
vec4 permute(vec4 x) {
     vec4 xm = mod(x, 289.0);
     return mod(((xm*34.0)+10.0)*xm, 289.0);
}

float psrdnoise(vec3 x, vec3 period, float alpha, out vec3 gradient)
{

#ifndef PERLINGRID
  
  const mat3 M = mat3(0.0, 1.0, 1.0,
                      1.0, 0.0, 1.0,
                      1.0, 1.0, 0.0);

  const mat3 Mi = mat3(-0.5, 0.5, 0.5,
                        0.5,-0.5, 0.5,
                        0.5, 0.5,-0.5);
#endif

  vec3 uvw;

  
#ifndef PERLINGRID
  
  uvw = M * x;
#else
  
  
  uvw = x + dot(x, vec3(1.0/3.0));
#endif

  
  vec3 i0 = floor(uvw);
  vec3 f0 = fract(uvw); 

  
  
  
  
  vec3 g_ = step(f0.xyx, f0.yzz); 
  vec3 l_ = 1.0 - g_;             
  vec3 g = vec3(l_.z, g_.xy);
  vec3 l = vec3(l_.xy, g_.z);
  vec3 o1 = min( g, l );
  vec3 o2 = max( g, l );

  
  vec3 i1 = i0 + o1;
  vec3 i2 = i0 + o2;
  vec3 i3 = i0 + vec3(1.0);

  vec3 v0, v1, v2, v3;

  
#ifndef PERLINGRID
  v0 = Mi * i0;
  v1 = Mi * i1;
  v2 = Mi * i2;
  v3 = Mi * i3;
#else
  
  v0 = i0 - dot(i0, vec3(1.0/6.0));
  v1 = i1 - dot(i1, vec3(1.0/6.0));
  v2 = i2 - dot(i2, vec3(1.0/6.0));
  v3 = i3 - dot(i3, vec3(1.0/6.0));
#endif

  
  vec3 x0 = x - v0;
  vec3 x1 = x - v1;
  vec3 x2 = x - v2;
  vec3 x3 = x - v3;

  if(any(greaterThan(period, vec3(0.0)))) {
    
    vec4 vx = vec4(v0.x, v1.x, v2.x, v3.x);
    vec4 vy = vec4(v0.y, v1.y, v2.y, v3.y);
    vec4 vz = vec4(v0.z, v1.z, v2.z, v3.z);
	
	if(period.x > 0.0) vx = mod(vx, period.x);
	if(period.y > 0.0) vy = mod(vy, period.y);
	if(period.z > 0.0) vz = mod(vz, period.z);
    
#ifndef PERLINGRID
    i0 = M * vec3(vx.x, vy.x, vz.x);
    i1 = M * vec3(vx.y, vy.y, vz.y);
    i2 = M * vec3(vx.z, vy.z, vz.z);
    i3 = M * vec3(vx.w, vy.w, vz.w);
#else
    v0 = vec3(vx.x, vy.x, vz.x);
    v1 = vec3(vx.y, vy.y, vz.y);
    v2 = vec3(vx.z, vy.z, vz.z);
    v3 = vec3(vx.w, vy.w, vz.w);
    
    i0 = v0 + dot(v0, vec3(1.0/3.0));
    i1 = v1 + dot(v1, vec3(1.0/3.0));
    i2 = v2 + dot(v2, vec3(1.0/3.0));
    i3 = v3 + dot(v3, vec3(1.0/3.0));
#endif
	
    i0 = floor(i0 + 0.5);
    i1 = floor(i1 + 0.5);
    i2 = floor(i2 + 0.5);
    i3 = floor(i3 + 0.5);
  }

  
  vec4 hash = permute( permute( permute( 
              vec4(i0.z, i1.z, i2.z, i3.z ))
            + vec4(i0.y, i1.y, i2.y, i3.y ))
            + vec4(i0.x, i1.x, i2.x, i3.x ));

  
  vec4 theta = hash * 3.883222077;  
  vec4 sz    = hash * -0.006920415 + 0.996539792; 
  vec4 psi   = hash * 0.108705628 ; 

  vec4 Ct = cos(theta);
  vec4 St = sin(theta);
  vec4 sz_prime = sqrt( 1.0 - sz*sz ); 

  vec4 gx, gy, gz;

  
#ifdef FASTROTATION
  
  vec4 qx = St;         
  vec4 qy = -Ct; 
  vec4 qz = vec4(0.0);

  vec4 px =  sz * qy;   
  vec4 py = -sz * qx;
  vec4 pz = sz_prime;

  psi += alpha;         
  vec4 Sa = sin(psi);
  vec4 Ca = cos(psi);

  gx = Ca * px + Sa * qx;
  gy = Ca * py + Sa * qy;
  gz = Ca * pz + Sa * qz;
#else
  
  
  if(alpha != 0.0) {
    vec4 Sp = sin(psi);          
    vec4 Cp = cos(psi);

    vec4 px = Ct * sz_prime;     
    vec4 py = St * sz_prime;     
    vec4 pz = sz;

    vec4 Ctp = St*Sp - Ct*Cp;    
    vec4 qx = mix( Ctp*St, Sp, sz);
    vec4 qy = mix(-Ctp*Ct, Cp, sz);
    vec4 qz = -(py*Cp + px*Sp);

    vec4 Sa = vec4(sin(alpha));       
    vec4 Ca = vec4(cos(alpha));

    gx = Ca * px + Sa * qx;
    gy = Ca * py + Sa * qy;
    gz = Ca * pz + Sa * qz;
  }
  else {
    gx = Ct * sz_prime;  
    gy = St * sz_prime;
    gz = sz;  
  }
#endif

  
  vec3 g0 = vec3(gx.x, gy.x, gz.x);
  vec3 g1 = vec3(gx.y, gy.y, gz.y);
  vec3 g2 = vec3(gx.z, gy.z, gz.z);
  vec3 g3 = vec3(gx.w, gy.w, gz.w);

  
  vec4 w = 0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3));
  w = max(w, 0.0);
  vec4 w2 = w * w;
  vec4 w3 = w2 * w;

  
  vec4 gdotx = vec4(dot(g0,x0), dot(g1,x1), dot(g2,x2), dot(g3,x3));

  
  float n = dot(w3, gdotx);

  
  vec4 dw = -6.0 * w2 * gdotx;
  vec3 dn0 = w3.x * g0 + dw.x * x0;
  vec3 dn1 = w3.y * g1 + dw.y * x1;
  vec3 dn2 = w3.z * g2 + dw.z * x2;
  vec3 dn3 = w3.w * g3 + dw.w * x3;
  gradient = 39.5 * (dn0 + dn1 + dn2 + dn3);

  
  return 39.5 * n;
}

uniform float u_aspectRatio;
uniform int u_gridSize;
uniform int u_bufferIndex;
uniform float u_t;
uniform float u_fov;
uniform float u_cameraHeight;

in vec3 a_position;
out vec2 v_uv;
out mat4 v_projectionMatrix;
out mat4 v_birdDisplacements;
out float v_isBirdVertexValid;

const float near = 0.1;
const float far = 100.0;

const float landscapeSpeed = 0.0002;
const float landscapeLineOffset = 0.0001;

const float noiseFreqA = 3.0;
const float noiseAmpA = 0.05;
const float noiseFreqB = 8.0;
const float noiseAmpB = 0.025;

mat4 nextBirdDisplacements;
const float birdScale = 0.01;
const float birdSpeed = 0.0003;
const float flapSpeed = 0.02;
const vec3 birdDisplacementScale = vec3(0.4, 0.15, 0.14);
const vec4 birdOffset = vec4(0.0, 0.2, -0.3, 1.0);
const mat3 birdNoiseOffsets = mat3(
  -1, 0, 1,
  0, 1, -1,
  1, -1, 0
);

float sampleNoise2(vec2 coord) {
  vec2 gradient = vec2(0.0);
  return psrdnoise(coord, vec2(0.0), 0.0, gradient);
}

float sampleNoise3(vec3 coord) {
  vec3 gradient = vec3(0.0);
  return psrdnoise(coord, vec3(0.0), 0.0, gradient);
}

vec4 getLandscapePosition() {
  ivec2 coord = ivec2(
    gl_VertexID % u_gridSize,
    gl_VertexID / u_gridSize
  );

  vec2 norm = vec2(coord) / float(u_gridSize - 1) * 2.0 - 1.0;
  float xNorm = norm.x;
  float zNorm = norm.y;

  float scaledTime = u_t * landscapeSpeed;
  float cellSize = 2.0 / float(u_gridSize);
  float cellOffset = floor(scaledTime / cellSize) * cellSize;
  
  float zOffset = mod(scaledTime, cellSize);
  vec2 noiseSample = vec2(xNorm / u_aspectRatio,  zNorm - cellOffset);
  float yDisplacement = sampleNoise2(noiseSample * noiseFreqA) * noiseAmpA
    + sampleNoise2(noiseSample * noiseFreqB) * noiseAmpB;
  vec4 position = vec4(xNorm / u_aspectRatio, yDisplacement, zNorm + zOffset, 1.0);

  return v_projectionMatrix * position;
}

mat4 getBirdDisplacements(float t) {
  float tScaled = t * birdSpeed;
  vec3 displacement1 = vec3(
    sampleNoise3(vec3(tScaled, 0, 0) + birdNoiseOffsets[0]),
    sampleNoise3(vec3(0, tScaled, 0) + birdNoiseOffsets[0]),
    sampleNoise3(vec3(0, 0, tScaled) + birdNoiseOffsets[0])
  );
  vec3 displacement2 = vec3(
    sampleNoise3(vec3(tScaled, 0, 0) + birdNoiseOffsets[1]),
    sampleNoise3(vec3(0, tScaled, 0) + birdNoiseOffsets[1]),
    sampleNoise3(vec3(0, 0, tScaled) + birdNoiseOffsets[1])
  );

  return mat4(
    vec4(displacement1 * birdDisplacementScale, 0.0) + birdOffset,
    vec4(displacement2 * birdDisplacementScale, 0.0) + birdOffset,
    vec4(0),
    vec4(0)
  );
}

mat4 getBirdRotationMatrix(vec3 rotations) {
  float xCos = cos(rotations.x);
  float xSin = sin(rotations.x);
  mat4 xRotation = mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, xCos, -xSin, 0.0,
    0.0, xSin, xCos, 0.0,
    0.0, 0.0, 0.0, 1.0
  );

  float yCos = cos(rotations.y);
  float ySin = sin(rotations.y);
  mat4 yRotation = mat4(
    yCos, 0.0, ySin, 0.0,
    0.0, 1.0, 0.0, 0.0,
    -ySin, 0.0, yCos, 0.0,
    0.0, 0.0, 0.0, 1.0
  );

  float zCos = cos(rotations.z);
  float zSin = sin(rotations.z);
  mat4 zRotation = mat4(
    zCos, -zSin, 0.0, 0.0,
    zSin, zCos, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  );

  return xRotation * yRotation * zRotation;
}

mat4 getBirdRotation(int birdIndex) {
  vec4 displacement = v_birdDisplacements[birdIndex];
  vec4 nextDisplacement = nextBirdDisplacements[birdIndex];
  vec4 diff = nextDisplacement - displacement;

  vec3 rotations = vec3(-diff.y * 5.0, diff.x, diff.x ) * 1500.0;
  return getBirdRotationMatrix(rotations);
}

vec4 getWingTipPosition(int birdIndex, vec4 vertexPosition) {
  vec4 displacement = v_birdDisplacements[birdIndex];
  vec4 flapPosition = vertexPosition + (sin(flapSpeed * u_t) - 0.5) / 1.5;
  return mix(
    flapPosition,
    vertexPosition,
    smoothstep(0.0, 0.5, (displacement.y - birdOffset.y) / birdDisplacementScale.y + 0.5)
  );
}

bool getIsBirdVertexValid() {
  return gl_VertexID < 6;
}

vec4 getBirdVertexPosition(int birdIndex) {
  vec4 vertexPosition = vec4(a_position, 1.0);
  return vec4[6](
    vertexPosition,
    getWingTipPosition(birdIndex, vertexPosition),
    vertexPosition,
    vertexPosition,
    getWingTipPosition(birdIndex, vertexPosition),
    vertexPosition
  )[gl_VertexID] * float(v_isBirdVertexValid);
}

vec4 getRotatedVertexForBird(int birdIndex) {
  mat4 rotation = getBirdRotation(birdIndex);
  return rotation * getBirdVertexPosition(birdIndex);
}

mat4 getBirdVertexPositions() {
  mat4 vertices = mat4(
    getRotatedVertexForBird(0),
    getRotatedVertexForBird(1),
    vec4(0),
    vec4(0)
  ) * birdScale;
  mat4 positions = vertices + v_birdDisplacements;
  return v_projectionMatrix * positions;
}

void main() {
  float f = 1.0 / tan(u_fov / 2.0);
  v_projectionMatrix = mat4(
    f / u_aspectRatio, 0.0, 0.0, 0.0,
    0.0, f, 0.0, 0.0,
    0.0, 0.0, (far + near) / (near - far), -1.0,
    0.0, 0.0, (2.0 * far * near) / (near - far), 0.0
  );

  v_birdDisplacements = getBirdDisplacements(u_t);
  nextBirdDisplacements = getBirdDisplacements(u_t + 1.0);
  v_isBirdVertexValid = float(getIsBirdVertexValid());

  vec4 landscapePosition = getLandscapePosition();
  mat4 birdVertexPositions = getBirdVertexPositions();
  vec4 position = mat4(
    landscapePosition,
    landscapePosition + vec4(0.0, landscapeLineOffset, 0.0, 0.0),
    birdVertexPositions[0],
    birdVertexPositions[1]
  )[u_bufferIndex];

  gl_Position = position - vec4(0.0, u_cameraHeight, 0.0, 0.0);
  v_uv = position.xz;
}`;
const {
  ARRAY_BUFFER: ue,
  ELEMENT_ARRAY_BUFFER: B,
  FLOAT: R,
  FLOAT_VEC4: E,
  FRAGMENT_SHADER: me,
  INT: F,
  LINES: ge,
  TRIANGLES: D,
  VERTEX_SHADER: xe
} = WebGL2RenderingContext, u = 100;
function C(o) {
  const e = parseInt(o.substring(1, 3), 16) / 255, n = parseInt(o.substring(3, 5), 16) / 255, t = parseInt(o.substring(5, 7), 16) / 255;
  return [e, n, t, 1];
}
function pe() {
  const o = u - 1, e = [];
  for (let n = 0; n < u * u; n++)
    n % u < o && (e.push(n), e.push(n + 1));
  return new Uint16Array(e);
}
function he() {
  const o = u - 1, e = [];
  for (let n = 0; n < u * u; n++)
    if (n % u < o && Math.floor(n / u) < o) {
      const t = n, i = n + 1, s = n + u + 1, r = n + u;
      e.push(t), e.push(i), e.push(r), e.push(s), e.push(r), e.push(i);
    }
  return new Uint16Array(e);
}
function be({
  aspectRatio: o,
  fov: e,
  cameraHeight: n,
  edgeColor: t,
  faceColor: i,
  birdColor: s,
  shadowColor: r
}) {
  return {
    drawToFramebuffer: !1,
    shaders: [
      {
        name: "vertex",
        type: xe,
        source: ve
      },
      {
        name: "fragment",
        type: me,
        source: de
      }
    ],
    uniforms: [
      {
        name: "u_aspectRatio",
        type: R,
        value: o
      },
      {
        name: "u_gridSize",
        type: F,
        value: u
      },
      {
        name: "u_bufferIndex",
        type: F,
        value: 0
      },
      {
        name: "u_t",
        type: R,
        value: 0
      },
      {
        name: "u_fov",
        type: R,
        value: e
      },
      {
        name: "u_cameraHeight",
        type: R,
        value: n
      },
      {
        name: "u_edgeColor",
        type: E,
        value: C(t)
      },
      {
        name: "u_faceColor",
        type: E,
        value: C(i)
      },
      {
        name: "u_birdColor",
        type: E,
        value: C(s)
      },
      {
        name: "u_shadowColor",
        type: E,
        value: C(r)
      }
    ],
    buffers: [
      {
        name: "faces",
        type: B,
        mode: D,
        drawCount: 1,
        values: he()
      },
      {
        name: "edges",
        type: B,
        mode: ge,
        drawCount: 1,
        values: pe()
      },
      {
        name: "bird",
        type: ue,
        mode: D,
        drawCount: 2,
        // prettier-ignore
        values: new Float32Array([
          0,
          0,
          -0.2,
          -1,
          0.5,
          0,
          0,
          0,
          0.2,
          0,
          0,
          0.2,
          1,
          0.5,
          0,
          0,
          0,
          -0.2
        ].concat(Array(u * u * 6 - 18).fill(0)))
      }
    ]
  };
}
function we(o) {
  return {
    programs: [be(o)]
  };
}
function ye(o, e) {
  const n = e.getBoundingClientRect();
  return e.width = n.width * o.devicePixelRatio, e.height = n.height * o.devicePixelRatio, e.width / e.height;
}
function ze(o, e, n, t = !1) {
  var l;
  const i = ye(o, e);
  let s;
  t && (s = new q(), (l = e.parentElement) == null || l.appendChild(s.dom));
  const r = e.getContext("webgl2");
  if (!r)
    throw new Error("unable to get webgl context");
  new le({
    window: o,
    webgl: r,
    config: we({
      ...n,
      aspectRatio: i
    }),
    dimensions: { width: e.width, height: e.height },
    stats: s
  }).run();
}
export {
  ze as renderVisuals
};
