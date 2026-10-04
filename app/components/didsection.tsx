'use client'
import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion'

/* ============================================================================
   DID section: standalone (all styles live at the bottom of this file).
   Logo: /public/didlogo.PNG   (path is case-sensitive on Linux hosts)
   ========================================================================== */

const W = 1200, H = 920            // design size of the connected graph (desktop)
const LOGO = '/didlogo.PNG'

/* ---------- small pieces ---------- */
function Logo({ className = '' }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={LOGO} alt="" draggable={false} className={`logo ${className}`} />
}

const IC = {
  folder: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
  users: 'M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2 19c0-3 3-5 6-5s6 2 6 5M14.5 14.5c.8-.3 1.6-.5 2.5-.5 3 0 5 1.8 5 5',
  clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  code: 'M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14',
  bars: 'M5 20V10M12 20V4M19 20v-7',
  bookmark: 'M6 3h12v18l-6-4-6 4z',
  building: 'M5 21V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v17M15 9h3a1 1 0 0 1 1 1v11M3 21h18M9 7h2M9 11h2M9 15h2',
  pin: 'M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  chevron: 'M6 9l6 6 6-6',
} as const

function Ic({ n }: { n: keyof typeof IC }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={IC[n]} />
    </svg>
  )
}

/* ---------- typography effects ---------- */
const GENTLE = [0.22, 0.61, 0.36, 1] as const
const SNAP = { duration: 0 }

const wordV: Variants = {
  hidden: { opacity: 0, filter: 'blur(14px)', y: 20, rotate: 3, transition: SNAP },
  show: {
    opacity: 1, filter: 'blur(0px)', y: 0, rotate: 0,
    transition: {
      opacity: { duration: 1.4, ease: GENTLE },
      filter: { duration: 1.8, ease: GENTLE },
      y: { duration: 1.8, ease: GENTLE },
      rotate: { duration: 1.8, ease: GENTLE },
    },
  },
}

const fadeV: Variants = {
  hidden: { opacity: 0, transition: SNAP },
  show: (delay: number) => ({ opacity: 1, transition: { duration: 1.4, ease: GENTLE, delay } }),
}

type Part = { t: string; c?: string }

function BlurWords({ parts, as = 'div', className, delay = 0, stagger = 0.07 }: {
  parts: Part[]; as?: 'h1' | 'h2' | 'p' | 'div'; className?: string; delay?: number; stagger?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.25, once: true })
  const reduce = useReducedMotion()
  const Tag = motion[as] as typeof motion.div
  const words = parts.flatMap(p => p.t.split(' ').filter(Boolean).map(w => ({ w, c: p.c })))
  const container: Variants = { hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }
  return (
    <Tag ref={ref} variants={container} initial={reduce ? false : 'hidden'} animate={reduce || inView ? 'show' : 'hidden'} className={className}>
      <span className="sr">{words.map(x => x.w).join(' ')}</span>
      {words.map((x, i) => (
        <span key={i} aria-hidden>
          <motion.span variants={wordV} className={`bw ${x.c ?? ''}`}>{x.w}</motion.span>{' '}
        </span>
      ))}
    </Tag>
  )
}

/* the hero glow rises in with the same long, soft ease as the headline words */
function Glow() {
  const reduce = useReducedMotion()
  return (
    <motion.div aria-hidden className="glow"
      initial={reduce ? false : { opacity: 0, y: 90 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 2.4, ease: GENTLE, delay: 0.1 }} />
  )
}

function Fade({ as = 'p', delay = 0, className, children }: {
  as?: 'p' | 'div'; delay?: number; className?: string; children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3, once: true })
  const reduce = useReducedMotion()
  const Tag = motion[as] as typeof motion.div
  return (
    <Tag ref={ref} variants={fadeV} custom={delay} initial={reduce ? false : 'hidden'} animate={reduce || inView ? 'show' : 'hidden'} className={className}>
      {children}
    </Tag>
  )
}

/* ---------- contribution heatmap (deterministic, so SSR and client match) ---------- */
function mulberry(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function Heat({ weeks = 52, seed = 1, className = '' }: { weeks?: number; seed?: number; className?: string }) {
  const cols = useMemo(() => {
    const r = mulberry(seed)
    return Array.from({ length: weeks }, () => Array.from({ length: 7 }, () => {
      const v = r()
      return v < 0.16 ? 0 : v < 0.5 ? 1 : v < 0.78 ? 2 : v < 0.93 ? 3 : 4
    }))
  }, [weeks, seed])
  return (
    <div className={`hm ${className}`} aria-hidden>
      {cols.map((w, i) => <div className="wk" key={i}>{w.map((l, j) => <i key={j} data-l={l} />)}</div>)}
    </div>
  )
}

/* ---------- platform cards ---------- */
function Ring() {
  const r = 40, C = 2 * Math.PI * r, gap = 5, total = 612
  const segs: [number, string][] = [[281, '#22c55e'], [276, '#f5b83d'], [55, '#ef4444']]
  let off = 0
  return (
    <svg viewBox="0 0 100 100" className="ring" aria-hidden>
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="8" />
      {segs.map(([n, c]) => {
        const len = (n / total) * C
        const el = (
          <circle key={c} cx="50" cy="50" r={r} fill="none" stroke={c} strokeWidth="8"
            strokeDasharray={`${Math.max(len - gap, 1)} ${C}`} strokeDashoffset={-off} transform="rotate(-90 50 50)" />
        )
        off += len
        return el
      })}
      <text x="50" y="52" textAnchor="middle" className="rn">612</text>
      <text x="50" y="65" textAnchor="middle" className="rs">solved</text>
    </svg>
  )
}

const LC_ROWS: [string, number, number, string][] = [
  ['Easy', 281, 800, '#22c55e'], ['Medium', 276, 1600, '#f5b83d'], ['Hard', 55, 700, '#ef4444'],
]

const CF_RATING = [1200, 1240, 1190, 1310, 1380, 1350, 1450, 1520, 1490, 1580, 1642]
const CF_PTS = CF_RATING.map((v, i) => `${(i / (CF_RATING.length - 1)) * 120},${38 - ((v - 1150) / 550) * 34}`).join(' ')

const HF_ROWS: [string, boolean[]][] = [
  ['llm-7b', [true, false]],
  ['did-vision', [false, true]],
]

const Tick = () => <span className="tk"><Ic n="check" /></span>

function GitHubCard() {
  return (
    <div className="nc">
      <div className="ch"><span className="pb gh">GH</span><b>GitHub</b></div>
      <div className="gh-graph">
        <div className="gh-months">{MONTHS.map(m => <span key={m}>{m}</span>)}</div>
        <Heat weeks={52} seed={11} />
      </div>
      <div className="cf">
        <strong>1,284</strong><span>contributions</span>
        <div className="lgd" aria-hidden>{[0, 1, 2, 3, 4].map(l => <i key={l} data-l={l} />)}</div>
      </div>
    </div>
  )
}

function LeetCodeCard() {
  return (
    <div className="nc">
      <div className="ch"><span className="pb lc">LC</span><b>LeetCode</b></div>
      <div className="lc-row">
        <Ring />
        <div className="lc-bars">
          {LC_ROWS.map(([name, n, of, c]) => (
            <div className="lb" key={name}>
              <div className="lt"><span>{name}</span><b>{n}<small>/{of}</small></b></div>
              <div className="tr"><i style={{ width: `${(n / of) * 100}%`, background: c }} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function HuggingFaceCard() {
  return (
    <div className="nc">
      <div className="ch"><span className="pb hf">HF</span><b>Hugging Face</b></div>
      <div className="hf-counts">
        <div><b>8</b><span>Models</span></div>
        <div><b>3</b><span>Datasets</span></div>
        <div><b>5</b><span>Spaces</span></div>
      </div>
      <table className="hf-t">
        <thead><tr><th>Repo</th><th>Text</th><th>Image</th></tr></thead>
        <tbody>
          {HF_ROWS.map(([name, caps]) => (
            <tr key={name}><td>{name}</td>{caps.map((on, i) => <td key={i}>{on ? <Tick /> : null}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CodeforcesCard() {
  return (
    <div className="nc">
      <div className="ch"><span className="pb cf2">CF</span><b>Codeforces</b></div>
      <div className="cf-top"><strong>1642</strong><span className="rank">Expert</span></div>
      <svg viewBox="0 0 120 40" preserveAspectRatio="none" className="cf-line" aria-hidden>
        <polyline points={CF_PTS} fill="none" stroke="#7aa7ff" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  )
}

function CredentialsCard() {
  const rows = ['Frontend Developer', 'Open Source Contributor']
  return (
    <div className="nc">
      <div className="ch"><span className="pb cr"><Ic n="check" /></span><b>Credentials</b><em>6 verified</em></div>
      <ul className="rows">
        {rows.map(r => <li key={r}><span>{r}</span><Tick /></li>)}
      </ul>
    </div>
  )
}

function SabhaCard() {
  const rows: [string, string][] = [['Next.js deep dive', '120'], ['Building in public', '86']]
  return (
    <div className="nc">
      <div className="ch"><span className="pb sb">S</span><b>Sabha</b><em>3 hosted</em></div>
      <ul className="rows">
        {rows.map(([a, b]) => <li key={a}><span>{a}</span><small>{b}</small></li>)}
      </ul>
    </div>
  )
}

/* ---------- graph: hub in the centre, six platform cards feeding into it ---------- */
type NodeDef = { id: string; x: number; y: number; w: number; h: number; cls?: string; body: ReactNode }

const NODES: NodeDef[] = [
  { id: 'hub', x: 465, y: 333, w: 270, h: 330, cls: 'hub', body: (
    <div className="nc hubc">
      <div className="top">
        <div className="av"><Logo /></div>
        <div className="who"><b>Ashutosh Kahlon</b><small>ashutoshkahlon</small></div>
      </div>
      <div className="layers"><i>Full-stack</i><i>Open source</i><i>Highly active</i></div>
      <div className="stats">
        <div><strong>12</strong><span>Projects</span></div>
        <div><strong>1.3k</strong><span>Github Contributions</span></div>
        <div><strong>6</strong><span>Credentials</span></div>
      </div>
      <em className="ok">✓ Verified profile</em>
    </div>) },

  { id: 'github', x: 50, y: 235, w: 300, h: 132, cls: 'card', body: <GitHubCard /> },
  { id: 'leetcode', x: 140, y: 430, w: 240, h: 122, cls: 'card', body: <LeetCodeCard /> },
  { id: 'hf', x: 70, y: 610, w: 240, h: 140, cls: 'card', body: <HuggingFaceCard /> },

  { id: 'cf', x: 890, y: 240, w: 240, h: 108, cls: 'card', body: <CodeforcesCard /> },
  { id: 'creds', x: 820, y: 430, w: 240, h: 106, cls: 'card', body: <CredentialsCard /> },
  { id: 'sabha', x: 890, y: 610, w: 240, h: 106, cls: 'card', body: <SabhaCard /> },
]

type Side = 'l' | 'r' | 't' | 'b'
const EDGES: [string, string, Side, Side][] = [
  ['github', 'hub', 'r', 'l'], ['leetcode', 'hub', 'r', 'l'], ['hf', 'hub', 'r', 'l'],
  ['cf', 'hub', 'l', 'r'], ['creds', 'hub', 'l', 'r'], ['sabha', 'hub', 'l', 'r'],
]
const anchor = (n: { x: number; y: number; w: number; h: number }, s: Side): [number, number] =>
  s === 'r' ? [n.x + n.w, n.y + n.h / 2] : s === 'l' ? [n.x, n.y + n.h / 2] : s === 'b' ? [n.x + n.w / 2, n.y + n.h] : [n.x + n.w / 2, n.y]

type Off = { x: number; y: number }

function GraphNode({ n, side, onOff, getScale }: { n: NodeDef; side: 'c' | 'l' | 'r'; onOff: (id: string, o: Off) => void; getScale: () => number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [off, setOff] = useState<Off>({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const st = useRef({ sx: 0, sy: 0, ox: 0, oy: 0, active: false, touch: false, timer: 0 })
  useEffect(() => { onOff(n.id, off) }, [off, n.id, onOff])

  /* keep the card inside its parent: the stage on desktop, the card column on small screens */
  const clamp = (el: HTMLElement, x: number, y: number): Off => {
    const par = el.offsetParent as HTMLElement | null
    if (!par) return { x, y }
    return {
      x: Math.max(-el.offsetLeft, Math.min(par.clientWidth - el.offsetWidth - el.offsetLeft, x)),
      y: Math.max(-el.offsetTop, Math.min(par.clientHeight - el.offsetHeight - el.offsetTop, y)),
    }
  }

  /* once a touch drag has started, stop the page from scrolling under the finger */
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const s = st.current
    const block = (e: TouchEvent) => { if (s.active) e.preventDefault() }
    el.addEventListener('touchmove', block, { passive: false })
    return () => { el.removeEventListener('touchmove', block); window.clearTimeout(s.timer) }
  }, [])

  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const s = st.current, el = e.currentTarget, id = e.pointerId
    s.sx = e.clientX; s.sy = e.clientY; s.ox = off.x; s.oy = off.y; s.touch = e.pointerType === 'touch'
    const start = () => {
      try { el.setPointerCapture(id) } catch { /* pointer already gone */ }
      s.active = true; setDragging(true)
    }
    if (s.touch) { window.clearTimeout(s.timer); s.timer = window.setTimeout(start, 220) } // press and hold to drag
    else { start(); e.preventDefault() }
  }
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const s = st.current
    if (!s.active) {
      if (s.touch && Math.hypot(e.clientX - s.sx, e.clientY - s.sy) > 8) window.clearTimeout(s.timer) // the person is scrolling
      return
    }
    const k = getComputedStyle(e.currentTarget).position === 'absolute' ? getScale() || 1 : 1
    setOff(clamp(e.currentTarget, s.ox + (e.clientX - s.sx) / k, s.oy + (e.clientY - s.sy) / k))
  }
  const up = () => { const s = st.current; window.clearTimeout(s.timer); s.active = false; setDragging(false) }

  const nudge = (e: KeyboardEvent<HTMLDivElement>) => {
    const k = ({ ArrowLeft: [-12, 0], ArrowRight: [12, 0], ArrowUp: [0, -12], ArrowDown: [0, 12] } as Record<string, number[]>)[e.key]
    if (!k) return
    e.preventDefault()
    setOff(clamp(e.currentTarget, off.x + k[0], off.y + k[1]))
  }

  const style = { '--x': `${n.x}px`, '--y': `${n.y}px`, '--w': `${n.w}px`, '--h': `${n.h}px`, '--dx': `${off.x}px`, '--dy': `${off.y}px` } as CSSProperties
  return (
    <div ref={ref} data-id={n.id} tabIndex={0} onKeyDown={nudge}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onContextMenu={e => e.preventDefault()}
      className={`node z-${side} ${n.cls ?? ''} ${dragging ? 'drag' : ''}`} style={style}>
      {n.body}
    </div>
  )
}

function Graph() {
  const secRef = useRef<HTMLElement>(null)
  const scale = useRef(1)
  const getScale = useRef(() => scale.current).current
  const nodesRef = useRef<HTMLDivElement>(null)
  const [zig, setZig] = useState<{ d: string; a: [number, number]; b: [number, number] }[]>([])
  const [offs, setOffs] = useState<Record<string, Off>>({})
  const offsRef = useRef(offs)
  offsRef.current = offs
  const onOff = useRef((id: string, o: Off) => setOffs(p => (p[id]?.x === o.x && p[id]?.y === o.y ? p : { ...p, [id]: o }))).current
  const geo = (id: string) => { const n = NODES.find(x => x.id === id)!; const o = offs[id] ?? { x: 0, y: 0 }; return { ...n, x: n.x + o.x, y: n.y + o.y } }
  const calcRef = useRef<() => void>(() => {})

  /* scale the 1200px stage down to fit the section on mid-size screens; below 1000px the cards stack instead */
  useEffect(() => {
    const el = secRef.current
    if (!el) return
    const apply = () => {
      const s = Math.min(1, el.clientWidth / W)
      scale.current = s
      el.style.setProperty('--s', String(s))
    }
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  /* small screens: cards zig-zag down the page, ending in the hub; a curve runs from the bottom of each card to the next */
  useEffect(() => {
    const el = nodesRef.current
    if (!el) return
    const rect = (k: HTMLElement) => {
      const o = offsRef.current[k.dataset.id ?? ''] ?? { x: 0, y: 0 }
      return { l: k.offsetLeft + o.x, t: k.offsetTop + o.y, w: k.offsetWidth, h: k.offsetHeight }
    }
    const calc = () => {
      if (getComputedStyle(el).display === 'contents') { setZig([]); return } // desktop graph draws its own wires
      const kids = Array.from(el.querySelectorAll<HTMLElement>(':scope > .node')).reverse() // top to bottom
      const out: { d: string; a: [number, number]; b: [number, number] }[] = []
      for (let i = 1; i < kids.length; i++) {
        const p = rect(kids[i - 1]), n = rect(kids[i]), to = kids[i]
        let x1: number, x2: number, c2: [number, number]
        const y1 = p.t + p.h
        let y2: number
        if (to.classList.contains('hub')) {
          x1 = p.l + p.w / 2; x2 = n.l + n.w / 2; y2 = n.t
          const k = Math.max(30, (y2 - y1) / 2)
          c2 = [x2, y2 - k]
        } else {
          const onLeft = to.classList.contains('z-l') // card sits on the left, so the wire arrives at its right edge
          x1 = onLeft ? p.l + p.w - 36 : p.l + 36
          x2 = onLeft ? n.l + n.w : n.l
          y2 = n.t + n.h / 2
          const k2 = Math.max(28, Math.abs(x2 - x1) / 2)
          c2 = [onLeft ? x2 + k2 : x2 - k2, y2]
        }
        const k1 = Math.max(30, (y2 - y1) / 2)
        out.push({ d: `M${x1},${y1} C${x1},${y1 + k1} ${c2[0]},${c2[1]} ${x2},${y2}`, a: [x1, y1], b: [x2, y2] })
      }
      setZig(out)
    }
    calcRef.current = calc
    calc()
    const ro = new ResizeObserver(calc)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  useEffect(() => { calcRef.current() }, [offs])

  return (
    <section className="section" data-slow aria-label="How Devvrats ID connects your platforms" ref={secRef}>
      <div className="fit">
        <div className="stage">
          <h2 className="gtitle">Your work. One platform. Everything connected.</h2>
          <svg className="wires" aria-hidden>
            <defs>
              <linearGradient id="did-g" gradientUnits="userSpaceOnUse" x1="0" x2={W} y1="0" y2="0">
                <stop offset="0" stopColor="#a78bfa" stopOpacity=".15" />
                <stop offset=".5" stopColor="#a78bfa" stopOpacity=".75" />
                <stop offset="1" stopColor="#a78bfa" stopOpacity=".15" />
              </linearGradient>
            </defs>
            {EDGES.map(([a, b, sa, sb]) => {
              const [x1, y1] = anchor(geo(a), sa), [x2, y2] = anchor(geo(b), sb)
              const k = Math.max(60, Math.abs(x2 - x1) / 2, Math.abs(y2 - y1) / 2)
              const c1 = sa === 'b' || sa === 't' ? [x1, y1 + k] : [x1 + (sa === 'r' ? k : -k), y1]
              const c2 = sb === 'b' || sb === 't' ? [x2, y2 + k] : [x2 + (sb === 'l' ? -k : k), y2]
              return <path key={a + b} d={`M${x1},${y1} C${c1} ${c2} ${x2},${y2}`} />
            })}
          </svg>
          <div className="nodes" ref={nodesRef}>
            <svg className="zig" aria-hidden>
              {zig.map((z, i) => (
                <g key={i}>
                  <path d={z.d} />
                  <circle cx={z.a[0]} cy={z.a[1]} r="3.5" />
                  <circle cx={z.b[0]} cy={z.b[1]} r="3.5" />
                </g>
              ))}
            </svg>
            {NODES.map((n, i) => <GraphNode key={n.id} n={n} side={i === 0 ? 'c' : i % 2 ? 'l' : 'r'} onOff={onOff} getScale={getScale} />)}
          </div>
          <p className="sub">DID brings your developer identity together in three connected layers. Each builds on the last, turning scattered profiles, skills, projects, and contributions into one evolving identity. No fragmented portfolios. No disconnected credentials. Just your work, connected and ready to represent you.</p>
        </div>
      </div>
    </section>
  )
}

/* ---------- profile UI (inside the device) ---------- */
const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']

const LANGS: [string, number, string][] = [
  ['TypeScript', 58, '#7aa7ff'], ['JavaScript', 20, '#f1e05a'], ['CSS', 14, '#c4b5fd'], ['Python', 8, '#6fdc6f'],
]
const TECH: [string, string][] = [
  ['React', '#61dafb'], ['TypeScript', '#7aa7ff'], ['Next.js', '#e5e5e5'], ['Node.js', '#6fdc6f'], ['Tailwind', '#38bdf8'], ['Python', '#f1e05a'], ['Postgres', '#8aa4d6'],
]

function Donut() {
  let off = 0
  return (
    <svg viewBox="0 0 100 100" className="donut" aria-hidden>
      {LANGS.map(([name, v, c]) => {
        const el = (
          <circle key={name} cx="50" cy="50" r="38" fill="none" stroke={c} strokeWidth="14" pathLength={100}
            strokeDasharray={`${v} ${100 - v}`} strokeDashoffset={-off} transform="rotate(-90 50 50)" />
        )
        off += v
        return el
      })}
      <text x="50" y="54" textAnchor="middle" className="dl">{LANGS.length} langs</text>
    </svg>
  )
}

function Profile() {
  return (
    <div className="pf">
      <div className="pfi">
        <aside className="side">
          <div className="avatar"><Logo /></div>
          <div className="ident"><div className="nm">Ashutosh Kahlon</div><div className="hd">ashutoshkahlon</div></div>
          <div className="tagrow"><i>Full-stack</i><i>Open source</i><i>Verified</i><i>Highly active</i></div>
          <ul className="meta">
            <li><Ic n="building" />Devvrats</li>
            <li><Ic n="pin" />India</li>
            <li><Ic n="calendar" />Joined 2026</li>
          </ul>
          <div className="fol"><Ic n="users" /><span><b>1,284</b> followers</span><span><b>86</b> following</span></div>
          <div className="fol"><Ic n="eye" /><span><b>494</b> views</span></div>
        </aside>

        <div className="main">
          <div className="welcome">
            <div><div className="wt">Welcome to Devvrats. Hub</div></div>
          </div>

          <div className="kpis">
            <div><Ic n="folder" /><strong>12</strong><span>Projects</span></div>
            <div><Ic n="code" /><strong>1.3k</strong><span>Github Contributions</span></div>
            <div><Ic n="check" /><strong>6</strong><span>Credentials</span></div>
            <div><Ic n="clock" /><strong>3</strong><span>Years active</span></div>
          </div>

          <section className="blk">
            <div className="bh"><Ic n="bars" /><b>Github Contributions</b><span><strong>1.3k</strong> in the last year</span></div>
            <div className="panel">
              <div className="months">{MONTHS.map(m => <span key={m}>{m}</span>)}</div>
              <Heat weeks={52} seed={11} className="big-hm" />
              <div className="cap">Last 52 weeks of activity</div>
            </div>
          </section>

          <section className="blk">
            <div className="bh"><Ic n="code" /><b>Tech stack and languages</b></div>
            <div className="two">
              <div className="panel">
                <div className="cap">Core technologies</div>
                <div className="chips">
                  {TECH.map(([t, c]) => <i key={t}><u style={{ background: c }} />{t}</i>)}
                </div>
              </div>
              <div className="panel lang">
                <Donut />
                <ul>
                  {LANGS.map(([t, v, c]) => <li key={t}><u style={{ background: c }} /><span>{t}</span><b>{v}%</b></li>)}
                </ul>
              </div>
            </div>
          </section>

          <section className="blk">
            <div className="bh"><Ic n="bookmark" /><b>Notable projects</b><span className="sel">Most stars<Ic n="chevron" /></span></div>
            <div className="two">
              <div className="panel proj"><b>devvrats-web</b><span>The Devvrats platform front end</span><small>TypeScript · 120 stars</small></div>
              <div className="panel proj"><b>did-sdk</b><span>Connect profiles to a DID</span><small>TypeScript · 86 stars</small></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

/* ---------- blueprint ---------- */
const BLUEPRINT = {
  id: 'bp',
  lead: 'Your developer identity, built the Devvrats way. DID brings your skills, projects, contributions, and credentials together in one connected profile.',
  rest: 'It turns everything you build across the ecosystem into a clear identity that represents your work, your journey, and what you bring to Devvrats. The result is a developer profile that answers one question:',
  q: ['What have you built, what have you contributed, and who are you becoming as a developer?'],
}

function Blueprint() {
  const p = BLUEPRINT
  return (
    <section className="bp" id={p.id} aria-label="Blueprint">
      <Fade as="div" className="big">
        <span className="hl">{p.lead}</span>{' '}
        <span className="rest">{p.rest}</span>
      </Fade>
      <div className="qs">
        {p.q.map((t, i) => (
          <BlurWords key={t} as="div" className="q" parts={[{ t }]} delay={0.15 + i * 0.4} />
        ))}
      </div>

      {/* device: laptop on desktop, tablet on mid screens, phone on small screens */}
      <div className="meet" data-slow>
        <span className="notch" aria-hidden />
        <div className="scr">
          <div className="bar">
            <i /><i /><i />
            <span className="url">did.devvrats.in/ashutoshkahlon</span>
          </div>
          <Profile />
        </div>
      </div>
    </section>
  )
}

/* ---------- full section ---------- */
export default function DidSection() {
  return (
    <div className="did">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="wrap">
        <header className="hero">
          <Glow />
          <hgroup className="titles">
            <BlurWords as="h1" parts={[{ t: 'Our Flagship' }]} delay={0.1} />
            <BlurWords as="h2" className="brand" parts={[{ t: 'Devvrats ID' }]} delay={0.55} />
          </hgroup>
          <div className="row">
            <Fade as="p" className="desc" delay={1.3}>
              From identity to opportunity in three layers: <b>Connect, Verify, and Showcase.</b> See how DID brings your developer identity, work, and contributions together into one trusted profile across Devvrats.
            </Fade>
          </div>
        </header>
        <Graph />
        <Blueprint />
      </div>
    </div>
  )
}

/* ============================================================================
   Styles (scoped under .did). Layout switches use container queries on .did,
   so the section responds to the space it is given, not just the viewport.
   ========================================================================== */
const CSS = `
.did{container:did / inline-size;--bg:#070707;--panel:#101010;--text:#f5f3ff;--muted:#8d8a99;--accent:#a78bfa;
  --logo-bg:#000;--wire:rgba(167,139,250,.55);--card:#17171c;--line:rgba(255,255,255,.08);
  --g0:#141a16;--g1:#123a1f;--g2:#1f6b34;--g3:#3fa65a;--g4:#7ee08a;
  margin:0;background:var(--bg);color:var(--text);font-family:"Inter Tight","Inter",system-ui,sans-serif;letter-spacing:-.03em;padding:24px}
.did *{box-sizing:border-box}
.did .wrap{max-width:1280px;margin:0 auto}
.did b,.did strong{font-weight:500}
.did .node b,.did .node strong{font-weight:400}
.did svg{display:block}
.did .logo{width:100%;height:100%;object-fit:contain;display:block;user-select:none;pointer-events:none}

/* ---------- shared card parts ---------- */
.did .nc{width:100%;height:100%;padding:10px 12px;display:flex;flex-direction:column;gap:6px;min-width:0}
.did .ch{display:flex;align-items:center;gap:8px;font-size:14px}
.did .ch b{}
.did .ch em{margin-left:auto;font-style:normal;font-size:11px;color:var(--muted);white-space:nowrap}
.did .pb{width:22px;height:22px;border-radius:7px;display:grid;place-items:center;font-size:10px;flex:none;letter-spacing:0}
.did .pb svg{width:13px;height:13px}
.did .pb.gh{background:#2a2f3a;color:#e5e7eb}
.did .pb.lc{background:rgba(245,184,61,.18);color:#f5b83d}
.did .pb.hf{background:rgba(255,210,30,.16);font-size:13px}
.did .pb.cf2{background:rgba(59,130,246,.2);color:#7aa7ff}
.did .pb.cr{background:rgba(111,220,111,.16);color:#6fdc6f}
.did .pb.sb{background:rgba(167,139,250,.2);color:#c4b5fd}
.did .tk{width:16px;height:16px;border-radius:5px;background:rgba(111,220,111,.18);color:#6fdc6f;display:inline-grid;place-items:center;flex:none}
.did .tk svg{width:11px;height:11px;stroke-width:2.6}

/* heatmap */
.did .hm{display:flex;gap:2px;width:100%}
.did .hm .wk{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.did .hm i{display:block;aspect-ratio:1;border-radius:2px;background:var(--g0)}
.did .hm i[data-l="1"]{background:var(--g1)}
.did .hm i[data-l="2"]{background:var(--g2)}
.did .hm i[data-l="3"]{background:var(--g3)}
.did .hm i[data-l="4"]{background:var(--g4)}
.did .gh-graph{display:flex;flex-direction:column;gap:3px;min-width:0}
.did .gh-months{display:flex;font-size:8px;line-height:10px;color:var(--muted);letter-spacing:0}
.did .gh-months span{flex:1;min-width:0}
.did .gh-graph .hm,.did .gh-graph .hm .wk{gap:1px}
.did .gh-graph .hm i{border-radius:1px}
.did .cf{display:flex;align-items:center;gap:6px;margin-top:auto}
.did .cf strong{font-size:16px;letter-spacing:-.03em}
.did .lgd{margin-left:auto;display:flex;gap:3px}
.did .lgd i{display:block;width:8px;height:8px;border-radius:2px;background:var(--g0)}
.did .lgd i[data-l="1"]{background:var(--g1)}
.did .lgd i[data-l="2"]{background:var(--g2)}
.did .lgd i[data-l="3"]{background:var(--g3)}
.did .lgd i[data-l="4"]{background:var(--g4)}
.did .cf span{font-size:11px;color:var(--muted)}

/* leetcode */
.did .lc-row{display:flex;align-items:center;gap:12px;flex:1;min-height:0}
.did .ring{width:68px;height:68px;flex:none}
.did .ring .rn{fill:#fff;font-size:20px;letter-spacing:-.04em}
.did .ring .rs{fill:var(--muted);font-size:9px}
.did .lc-bars{flex:1;display:flex;flex-direction:column;gap:6px;min-width:0}
.did .lt{display:flex;justify-content:space-between;align-items:baseline;font-size:11px;color:#c9c6d6}
.did .lt b{color:#7dd3fc;font-size:12px}
.did .lt small{color:var(--muted);font-size:10px;margin-left:2px}
.did .tr{height:4px;border-radius:99px;background:rgba(255,255,255,.08);margin-top:3px;overflow:hidden}
.did .tr i{display:block;height:100%;border-radius:99px}

/* hugging face */
.did .hf-counts{display:flex;gap:6px}
.did .hf-counts div{flex:1;background:rgba(255,255,255,.04);border-radius:9px;padding:5px 7px;display:flex;align-items:baseline;gap:5px;min-width:0}
.did .hf-counts b{font-size:14px}
.did .hf-counts span{font-size:10px;color:var(--muted)}
.did .hf-t{width:100%;border-collapse:collapse;font-size:11px;border:1px solid var(--line);border-radius:8px;overflow:hidden}
.did .hf-t th,.did .hf-t td{padding:3px 7px;border-bottom:1px solid var(--line);text-align:center;}
.did .hf-t th{color:#c9c6d6;font-size:10px;background:rgba(255,255,255,.03)}
.did .hf-t th:first-child,.did .hf-t td:first-child{text-align:left;color:#c9c6d6;text-decoration:underline;text-underline-offset:2px;text-decoration-color:rgba(255,255,255,.25)}
.did .hf-t tr:last-child td{border-bottom:0}
.did .hf-t td .tk{vertical-align:middle}
.did .hf-t td:first-child{max-width:84px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* codeforces */
.did .cf-top{display:flex;align-items:baseline;gap:10px}
.did .cf-top strong{font-size:30px;letter-spacing:-.05em;line-height:1}
.did .cf-top .rank{font-size:12px;color:#7aa7ff;background:rgba(59,130,246,.16);padding:3px 9px;border-radius:99px}
.did .cf-line{width:100%;flex:1;min-height:22px}


/* list rows (credentials, sabha) */
.did .rows{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:5px;flex:1}
.did .rows li{display:flex;align-items:center;justify-content:space-between;gap:10px;background:rgba(255,255,255,.04);border-radius:9px;padding:6px 9px;font-size:11px;flex:1}
.did .rows small{font-size:11px;color:var(--muted);white-space:nowrap}
.did .rows li span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* ---------- graph section ---------- */
.did .section{--s:1;max-width:1280px;margin:0 auto;background:var(--panel);border-radius:40px;overflow:hidden;position:relative}
.did .fit{width:calc(${W}px * var(--s));height:calc(${H}px * var(--s));margin:0 auto}
.did .stage{position:relative;width:${W}px;height:${H}px;transform:scale(var(--s));transform-origin:0 0}
.did .nodes{display:contents}
.did .zig{display:none}
.did .gtitle{position:absolute;left:50%;top:56px;transform:translateX(-50%);margin:0;text-align:center;font-size:64px;line-height:1.05;font-weight:500;letter-spacing:-.045em;width:760px;pointer-events:none}
.did .sub{position:absolute;left:50%;bottom:36px;transform:translateX(-50%);width:860px;text-align:center;margin:0;font-size:20px;line-height:1.35;color:var(--muted);pointer-events:none}

.did svg.wires{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible}
.did svg.wires path{fill:none;stroke:url(#did-g);stroke-width:1.5}

.did .node{position:absolute;left:var(--x);top:var(--y);width:var(--w);height:var(--h);transform:translate(var(--dx,0px),var(--dy,0px)) scale(var(--k,1));cursor:grab;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent;touch-action:pan-y;transition:transform .18s ease}
.did .node.drag{--k:1.03;cursor:grabbing;z-index:20;transition:none}
.did .node:focus-visible{outline:2px solid var(--accent);outline-offset:4px}

.did .card{border-radius:18px;background:var(--card);border:1px solid var(--line)}
.did .card .nc,.did .hub .nc{border-radius:inherit;overflow:hidden}

/* hub */
.did .hub{border-radius:28px;background:#15131d;border:1px solid rgba(167,139,250,.35)}

.did .hubc{padding:20px;gap:14px;justify-content:flex-start}
.did .hubc .top{display:flex;align-items:center;gap:12px}
.did .hubc .av{width:52px;height:52px;border-radius:50%;background:var(--logo-bg);border:1px solid rgba(255,255,255,.14);padding:12px;flex:none}
.did .hubc .who{display:flex;flex-direction:column;gap:2px}
.did .hubc .who b{font-size:22px;letter-spacing:-.04em}
.did .hubc .who small{font-size:12px;color:var(--muted)}
.did .hubc .layers{display:flex;gap:6px;flex-wrap:wrap}
.did .hubc .layers i{font-style:normal;font-size:12px;padding:5px 11px;border-radius:999px;background:rgba(255,255,255,.08);color:#fff}
.did .hubc .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:6px}
.did .hubc .stats div{background:rgba(0,0,0,.28);border-radius:14px;padding:12px 10px;display:flex;flex-direction:column;gap:4px;min-width:0}
.did .hubc .stats strong{font-size:26px;letter-spacing:-.05em;line-height:1}
.did .hubc .stats span{font-size:10px;color:var(--muted)}
.did .hubc .ok{margin-top:auto;font-style:normal;font-size:13px;color:#120a2e;background:var(--accent);border-radius:12px;padding:10px 14px;text-align:center;}

/* ---------- typography helpers ---------- */
.did .bw{display:inline-block;margin:-.2em -.12em;padding:.2em .12em;transform-origin:bottom left;will-change:transform,filter,opacity}
.did .sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}

/* ---------- hero ---------- */
.did .hero{position:relative;min-height:560px;margin-bottom:24px;overflow:hidden;border-radius:40px;background:var(--bg);display:flex;flex-direction:column;justify-content:space-between;gap:48px;padding:80px 40px 48px}
.did .hero>.glow{position:absolute;left:0;right:0;bottom:0;height:85%;pointer-events:none;will-change:opacity,transform;
  background:linear-gradient(0deg,rgba(42,27,94,1.000) 0.0%,rgba(42,27,94,0.985) 7.1%,rgba(42,27,94,0.945) 14.3%,rgba(42,27,94,0.882) 21.4%,rgba(42,27,94,0.802) 28.6%,rgba(42,27,94,0.708) 35.7%,rgba(42,27,94,0.606) 42.9%,rgba(42,27,94,0.500) 50.0%,rgba(42,27,94,0.394) 57.1%,rgba(42,27,94,0.292) 64.3%,rgba(42,27,94,0.198) 71.4%,rgba(42,27,94,0.118) 78.6%,rgba(42,27,94,0.055) 85.7%,rgba(42,27,94,0.015) 92.9%,rgba(42,27,94,0.000) 100.0%)}
.did .hero>*{position:relative}
.did .titles{margin:0;display:flex;flex-direction:column;align-items:center;text-align:center}
.did .titles h1,.did .titles h2.brand{margin:0;font-weight:500;line-height:1.02;letter-spacing:-.055em;font-size:clamp(44px,6vw,92px)}
.did .titles h2.brand .bw{background:linear-gradient(180deg,#fff 30%,#c4b5fd);-webkit-background-clip:text;background-clip:text;color:transparent}
.did .row{display:flex;justify-content:flex-end}
.did .desc{max-width:380px;color:#b4b1c4;font-size:21px;line-height:1.4;margin:0}
.did .desc b{color:#fff}

/* ---------- blueprint ---------- */
.did .bp{max-width:1280px;margin:24px auto;padding:140px 20px 0;text-align:center;position:relative}
.did .big{max-width:820px;margin:0 auto;text-align:left;font-size:clamp(26px,3.3vw,42px);line-height:1.16;font-weight:500;letter-spacing:-.045em}
.did .big .hl{color:#fff}
.did .big .rest{color:#6b6b6b}
.did .q{display:inline-block;margin:10px 0 0;background:#141418;border-radius:30px;padding:10px 30px;font-size:clamp(34px,6vw,88px);font-weight:500;letter-spacing:-.055em;line-height:1.08}
.did .qs{margin-top:90px;display:flex;flex-direction:column;align-items:center;gap:14px}

/* ---------- device frame: laptop (default) ---------- */
.did .meet{position:relative;max-width:1000px;height:640px;margin:90px auto 0;border-radius:44px 44px 0 0;border:3px solid #cfcfd6;border-bottom:0;padding:26px 26px 0;background:#0b0b0d;overflow:hidden}
.did .notch{display:none}
.did .scr{height:100%;border-radius:20px 20px 0 0;background:#0a0a0c;border:1px solid rgba(167,139,250,.25);border-bottom:0;overflow:hidden;display:flex;flex-direction:column;text-align:left}
.did .bar{display:flex;align-items:center;gap:7px;padding:11px 16px;background:#16141f;border-bottom:1px solid var(--line);flex:none}
.did .bar i{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.18)}
.did .bar i:first-child{background:#a78bfa}
.did .bar .url{margin-left:14px;flex:1;max-width:320px;font-size:12px;color:var(--muted);background:rgba(255,255,255,.05);border-radius:8px;padding:5px 12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}


/* ---------- profile UI ---------- */
.did .pf{container-type:inline-size;flex:1;min-height:0;overflow:hidden;
  -webkit-mask-image:linear-gradient(#000 78%,transparent);mask-image:linear-gradient(#000 78%,transparent)}
.did .pfi{display:grid;grid-template-columns:230px 1fr;gap:22px;padding:22px}
.did .pf svg{width:15px;height:15px;flex:none}
.did .side{display:flex;flex-direction:column;gap:12px;min-width:0}
.did .avatar{width:100%;aspect-ratio:1;border-radius:50%;background:var(--logo-bg);border:1px solid rgba(255,255,255,.14);display:grid;place-items:center;padding:26%;overflow:hidden}
.did .avatar .logo{background:none;border-radius:0;padding:0}
.did .nm{font-size:26px;font-weight:500;letter-spacing:-.045em;line-height:1.1}
.did .hd{font-size:18px;color:var(--muted);margin-top:2px}
.did .follow{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;background:#17171c;border:1px solid var(--line);color:var(--text);border-radius:12px;padding:11px;font:500 14px/1 inherit;font-family:inherit;letter-spacing:-.02em;cursor:default}
.did .tagrow{display:flex;flex-wrap:wrap;gap:6px}
.did .tagrow i{font-style:normal;font-size:12px;color:#d4d1e0;border:1px solid rgba(255,255,255,.14);border-radius:99px;padding:5px 11px}
.did .meta{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:9px;font-size:14px;color:#c9c6d6}
.did .meta li,.did .fol{display:flex;align-items:center;gap:10px}
.did .meta svg,.did .fol>svg{color:var(--muted)}
.did .fol{font-size:14px;color:#c9c6d6;flex-wrap:wrap;column-gap:14px}
.did .fol b{color:#fff}

.did .main{display:flex;flex-direction:column;gap:14px;min-width:0}
.did .welcome{display:flex;justify-content:space-between;align-items:center;gap:16px;background:#0f0f12;border:1px solid var(--line);border-radius:14px;padding:16px 20px}
.did .wt{font-size:20px;font-weight:500;letter-spacing:-.04em}
.did .ws{font-size:13px;color:var(--muted);margin-top:3px}
.did .pw{font-size:12px;color:var(--muted);white-space:nowrap}
.did .pw b{color:#a78bfa}

.did .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.did .kpis div{background:#0f0f12;border:1px solid var(--line);border-radius:14px;padding:14px 8px;display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center;min-width:0}
.did .kpis svg{color:var(--muted)}
.did .kpis strong{font-size:28px;letter-spacing:-.05em;line-height:1.1}
.did .kpis span{font-size:11px;color:var(--muted)}

.did .blk{display:flex;flex-direction:column;gap:8px}
.did .bh{display:flex;align-items:center;gap:8px;font-size:15px}
.did .bh>svg{color:var(--muted)}
.did .bh>span{margin-left:auto;font-size:12px;color:var(--muted)}
.did .bh>span strong{color:#fff;font-size:13px}
.did .bh .sel{display:flex;align-items:center;gap:6px;border:1px solid var(--line);border-radius:8px;padding:5px 10px;color:#c9c6d6}
.did .panel{background:#0f0f12;border:1px solid var(--line);border-radius:14px;padding:12px 14px;min-width:0}
.did .cap{font-size:11px;color:var(--muted)}
.did .months{display:flex;font-size:10px;color:var(--muted);margin-bottom:6px}
.did .months span{flex:1}
.did .big-hm{margin-bottom:8px}
.did .two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.did .chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.did .chips i,.did .lang li u,.did .chips u{font-style:normal}
.did .chips i{display:flex;align-items:center;gap:6px;font-size:12px;color:#d4d1e0;background:rgba(255,255,255,.05);border:1px solid var(--line);border-radius:99px;padding:5px 11px}
.did .chips u,.did .lang li u{display:inline-block;width:8px;height:8px;border-radius:50%;text-decoration:none}
.did .lang{display:flex;align-items:center;gap:14px}
.did .donut{width:84px;height:84px;flex:none}
.did .donut .dl{fill:var(--muted);font-size:9px}
.did .lang ul{list-style:none;margin:0;padding:0;flex:1;display:flex;flex-direction:column;gap:6px;min-width:0}
.did .lang li{display:flex;align-items:center;gap:8px;font-size:12px;color:#d4d1e0}
.did .lang li b{margin-left:auto;color:var(--muted);font-weight:400}
.did .proj{display:flex;flex-direction:column;gap:4px}
.did .proj b{font-size:14px}
.did .proj span{font-size:12px;color:var(--muted)}
.did .proj small{font-size:11px;color:#c4b5fd}

/* profile: medium and narrow screens (the container is the device screen) */
@container (max-width:699px){
  .did .pfi{grid-template-columns:1fr;gap:16px;padding:16px}
  .did .side{display:grid;grid-template-columns:84px 1fr;align-items:center;gap:12px 16px}
  .did .avatar{grid-row:span 1}
  .did .follow,.did .tagrow,.did .meta,.did .fol{grid-column:1/-1}
  .did .meta{flex-direction:row;flex-wrap:wrap;gap:8px 18px}
  .did .nm{font-size:22px}
  .did .hd{font-size:15px}
  .did .kpis{grid-template-columns:repeat(2,1fr)}
}
@container (max-width:459px){
  .did .pfi{padding:12px;gap:12px}
  .did .side{grid-template-columns:64px 1fr}
  .did .pw{display:none}
  .did .welcome{padding:12px 14px}
  .did .wt{font-size:17px}
  .did .two{grid-template-columns:1fr}
  .did .hm .wk:nth-child(-n+26){display:none}
  .did .months span:nth-child(-n+6){display:none}
  .did .kpis strong{font-size:24px}
}

/* ---------- responsive: tablet device (section narrower than 900px) ---------- */
@container did (max-width:899px){
  .did .bp{padding-top:100px}
  .did .qs{margin-top:60px}
  .did .meet{max-width:720px;height:600px;margin-top:64px;border-radius:32px;border-bottom:3px solid #cfcfd6;padding:16px}
  .did .scr{border-radius:16px;border-bottom:1px solid rgba(167,139,250,.25)}
}

/* ---------- responsive: phone device (section narrower than 600px) ---------- */
@container did (max-width:599px){
  .did .hero{min-height:460px;padding:60px 20px 32px;gap:32px;border-radius:28px}
  .did .desc{max-width:100%;font-size:18px}
  .did .bp{padding:80px 4px 0}
  .did .q{padding:8px 18px;border-radius:22px}
  .did .meet{max-width:330px;height:620px;margin-top:48px;border-radius:42px;padding:12px}
  .did .notch{display:block;position:absolute;top:18px;left:50%;transform:translateX(-50%);width:84px;height:22px;border-radius:99px;background:#000;z-index:6}
  .did .scr{border-radius:30px;padding-top:40px}
  .did .bar{display:none}
}

/* ---------- responsive: below 1000px the graph becomes a zig-zag flow ----------
   the cards alternate left / right down the page and finish in the hub at the bottom. Curves (drawn by Graph from the
   measured card positions) leave the bottom corner of one card and enter the side of the next. */
@container did (max-width:999px){
  .did .section{border-radius:28px}
  .did .fit{width:auto;height:auto}
  .did .stage{transform:none;width:auto;height:auto;display:flex;flex-direction:column;align-items:center;gap:36px;padding:56px 22px 48px}
  .did .gtitle{position:static;transform:none;width:auto;max-width:640px;font-size:clamp(32px,7vw,52px)}
  .did .sub{position:static;transform:none;width:auto;max-width:600px;font-size:17px}
  .did .wires{display:none}

  .did .nodes{display:flex;flex-direction:column-reverse;gap:52px;position:relative;width:100%;max-width:760px}
  .did .zig{display:block;position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;z-index:0}
  .did .zig path{fill:none;stroke:var(--wire);stroke-width:1.5}
  .did .zig circle{fill:#c4b5fd;fill-opacity:.85}

  .did .node{position:relative;z-index:1;left:auto;top:auto;width:min(var(--w),max(200px,calc(100% - 96px)));height:auto;min-height:0}

  .did .node.z-l{align-self:flex-start}
  .did .node.z-r{align-self:flex-end}
  .did .node.hub{align-self:center;width:min(100%,320px);min-height:0}
  .did .node.hub .hubc{min-height:0}
}
@container did (max-width:599px){
  .did .stage{padding:48px 18px 40px}


}
@media (max-width:700px){.did{padding:12px}}
`