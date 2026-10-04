"use client";

import { useEffect, useRef } from "react";

/* ---------- shader ---------- */
const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

/**
 * Violet glow (#a78bfa) lit from below.
 * GPU savings vs. the original:
 *  - the drifting field is evaluated ONCE per pixel (the letter field is the
 *    same field nudged up, so we derive it instead of running the loop twice)
 *  - only the ramp that is actually visible is computed (background, letter,
 *    or a blend on antialiased edges)
 */
const FRAG = /* glsl */ `precision highp float;
uniform vec2 R;uniform float T,G,L,B,P;uniform sampler2D M;
float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
vec3 ramp(float v){
 vec3 c=vec3(.06,.05,.075);
 c=mix(c,vec3(.20,.11,.42),smoothstep(.14,.32,v));
 c=mix(c,vec3(.43,.30,.85),smoothstep(.32,.5,v));
 c=mix(c,vec3(.655,.545,.98),smoothstep(.5,.72,v));
 c=mix(c,vec3(.80,.73,.99),smoothstep(.72,.9,v));
 return mix(c,vec3(.86,.81,1.),smoothstep(.9,1.12,v));}
float field(vec2 q){
 float t=T;
 q.x+=.04*sin(q.y*2.+t*.25);
 float E=.92+.12*sin(q.x*1.5+t*.3)+.06*sin(q.x*2.8-t*.4+1.3);
 float v=E-q.y;
 for(int i=0;i<4;i++){float f=float(i);
  vec2 c=vec2(.3+f*.87+.6*sin(t*(.22+.05*f)+f*2.3),.3+.28*sin(t*(.28+.06*f)+f*1.9));
  vec2 d=(q-c)*vec2(.9,1.);v+=.34*exp(-dot(d,d)/.5);}
 return v;}
void main(){
 vec2 fc=gl_FragCoord.xy;
 vec2 q=vec2((fc.x-P)/(R.x-2.*P)*3.2,(fc.y-B)/L);
 float n=h(floor(fc/G))-.5;
 float m=texture2D(M,vec2(fc.x/R.x,1.-fc.y/R.y)).a;
 float v=field(q);
 vec3 col;
 if(m<.004){
  float vb=v*.5-.2;
  float gb=.03*(1.-smoothstep(.3,.8,vb))+.004;
  col=ramp(vb+n*2.*gb);
 }else{
  float vi=(v+.04)*1.05+.08;
  float gi=.01*(1.-smoothstep(.3,.7,vi))+.002;
  vec3 fg=ramp(vi+n*2.*gi);
  if(m>.996){col=fg;}
  else{
   float vb=v*.5-.2;
   float gb=.03*(1.-smoothstep(.3,.8,vb))+.004;
   col=mix(ramp(vb+n*2.*gb),fg,m);
  }
 }
 gl_FragColor=vec4(col,1.);}`;

/* ---------- wordmark typography ---------- */
const TRACK = -0.035; // base tracking in em (was -0.045, which fused the V's into a W)
const PAIRS: Record<string, number> = { VV: 0.08 }; // extra em gap for tricky pairs
const MAX_PIXELS = 2_200_000; // render-resolution budget (keeps phones/4K cool)
const FRAME_MS = 1000 / 30; // the motion is slow; 30fps looks identical, half the work

/* ---------- gradient + wordmark canvas ---------- */
type Props = { text?: string };

function GradientWordmark({ text = "DEVVRATS." }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const gl = cv.getContext("webgl", {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // uniform locations are looked up once, not every frame
    const U = {
      R: gl.getUniformLocation(prog, "R"),
      T: gl.getUniformLocation(prog, "T"),
      G: gl.getUniformLocation(prog, "G"),
      L: gl.getUniformLocation(prog, "L"),
      B: gl.getUniformLocation(prog, "B"),
      P: gl.getUniformLocation(prog, "P"),
      M: gl.getUniformLocation(prog, "M"),
    };

    const family = getComputedStyle(cv).fontFamily;
    const chars = Array.from(text);
    const mask = document.createElement("canvas"); // reused across resizes
    const x = mask.getContext("2d")!;

    let raf = 0;
    let alive = true;
    let running = false;
    let inView = true;
    let last = 0;
    let ready = false;

    /** Lay out glyphs one by one so pairs like "VV" get their own spacing. */
    const layout = (px: number) => {
      x.font = `700 ${px}px ${family}`;
      if ("fontKerning" in x) (x as CanvasRenderingContext2D).fontKerning = "none";
      if ("letterSpacing" in x) x.letterSpacing = "0px";
      const xs: number[] = [];
      let pos = 0;
      let asc = 0;
      let desc = 0;
      chars.forEach((ch, i) => {
        const m = x.measureText(ch);
        xs.push(pos);
        asc = Math.max(asc, m.actualBoundingBoxAscent);
        desc = Math.max(desc, m.actualBoundingBoxDescent);
        pos += m.width + (TRACK + (PAIRS[ch + (chars[i + 1] ?? "")] ?? 0)) * px;
      });
      const first = x.measureText(chars[0]);
      const lastG = x.measureText(chars[chars.length - 1]);
      const left = first.actualBoundingBoxLeft;
      const inkW = left + xs[xs.length - 1] + lastG.actualBoundingBoxRight;
      return { xs, asc, desc, left, inkW };
    };

    const size = () => {
      // cap render resolution by pixel budget, then by DPR
      const cw = cv.clientWidth;
      const ch = cv.clientHeight;
      if (!cw || !ch) return;
      let dpr = Math.min(devicePixelRatio || 1, 2);
      dpr *= Math.min(1, Math.sqrt(MAX_PIXELS / (cw * ch * dpr * dpr)));
      const w = Math.round(cw * dpr);
      const h = Math.round(ch * dpr);
      if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
      }
      gl.viewport(0, 0, w, h);

      mask.width = w; // also clears
      mask.height = h;
      const pad = Math.min(32, Math.max(16, innerWidth * 0.023)) * dpr;

      // fit the word edge to edge
      const probe = layout(100);
      const fit = (100 * (w - 2 * pad)) / probe.inkW;
      const g = layout(fit);

      // stretch letters vertically (more on portrait screens)
      const portrait = w / h < 1;
      const k = Math.min(portrait ? 2.8 : 1.6, Math.max(1, ((portrait ? 0.28 : 0.34) * h) / g.asc));
      const baseline = k * g.desc; // lowest ink touches the bottom edge
      const height = g.asc * k;

      x.fillStyle = "#fff";
      x.save();
      x.translate(pad + g.left, h - baseline);
      x.scale(1, k);
      chars.forEach((c, i) => x.fillText(c, g.xs[i], 0));
      x.restore();

      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mask);
      gl.uniform2f(U.R, w, h);
      gl.uniform1f(U.G, 1);
      gl.uniform1i(U.M, 0);
      gl.uniform1f(U.L, height);
      gl.uniform1f(U.B, baseline);
      gl.uniform1f(U.P, pad);
    };

    const render = (ms: number) => {
      gl.uniform1f(U.T, reduce ? 5 : ms / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (ms: number) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      if (ms - last < FRAME_MS - 1) return;
      last = ms;
      render(ms);
    };
    const start = () => {
      if (running || reduce || !ready || !inView || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // coalesce resize bursts into one rebuild per frame
    let resizeRaf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        if (!alive || !ready) return;
        size();
        render(performance.now());
      });
    });

    // don't burn GPU when the hero is scrolled away or the tab is hidden
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      inView ? start() : stop();
    });
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    const onLost = (e: Event) => {
      e.preventDefault();
      stop();
    };
    cv.addEventListener("webglcontextlost", onLost);

    document.fonts
      .load(`700 100px ${family}`)
      .catch(() => undefined)
      .then(() => {
        if (!alive) return;
        size();
        ready = true;
        render(performance.now());
        ro.observe(cv);
        io.observe(cv);
        start();
      });

    return () => {
      alive = false;
      stop();
      cancelAnimationFrame(resizeRaf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      cv.removeEventListener("webglcontextlost", onLost);
      mask.width = mask.height = 0;
      gl.deleteTexture(tex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, [text]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="absolute inset-0 size-full bg-[radial-gradient(120%_60%_at_50%_110%,#5b3fc4,#000_70%)]"
    />
  );
}

/* ---------- hero ---------- */
export default function Hero() {
  return (
    <section
      id="hero"   
      className="relative h-dvh min-h-[480px] overflow-hidden bg-black px-[clamp(16px,2.3vw,32px)] text-white"
    >
      <GradientWordmark text="DEVVRATS." />
     <h1
  className="absolute left-[56%] top-[26%] z-10 w-[32%] text-balance text-[clamp(28px,2.7vw,52px)] font-medium leading-[1.05] tracking-[-0.045em] text-white
    max-[820px]:left-6 max-[820px]:top-1/2 max-[820px]:-translate-y-1/2 max-[820px]:w-[min(calc(100%-48px),14em)] max-[820px]:text-left max-[820px]:text-[clamp(30px,8.5vw,52px)]
    max-[820px]:landscape:text-[clamp(22px,4vw,34px)]"
>
  <span className="text-[#a78bfa]">Design</span> for those who want to become a better version of themselves.
</h1>
    </section>
  );
}