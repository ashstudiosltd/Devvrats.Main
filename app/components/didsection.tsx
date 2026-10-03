'use client'
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion'
import '@/components/processsection.css'

const W = 1200, H = 820

const Mark = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"><path d="M4 19c2-8 4-13 6-13s0 13 3 13 2-10 4-10 2 6 3 6" /></svg>
)

/* ---------- typography effects (same motion as the About section) ---------- */
const GENTLE = [0.22, 0.61, 0.36, 1] as const // long, soft ease-out
const SNAP = { duration: 0 }

/* every word starts blurred, low and tilted, then glides up and sharpens */
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

/* paragraph: pure fade-in */
const fadeV: Variants = {
  hidden: { opacity: 0, transition: SNAP },
  show: (delay: number) => ({ opacity: 1, transition: { duration: 1.4, ease: GENTLE, delay } }),
}

type Part = { t: string; c?: string }

/* Blur-reveal text. Renders the real tag (h1/h2/p/div), plays once when scrolled into view. */
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

/* Fade-in block (used for paragraphs) */
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

/* ---------- drag hook ---------- */
function useDrag(init: { x: number; y: number }, bounds: (el: HTMLElement) => { w: number; h: number }) {
  const [pos, setPos] = useState(init)
  const [dragging, setDragging] = useState(false)
  const st = useRef({ sx: 0, sy: 0, ox: 0, oy: 0 })
  const bind = {
    onPointerDown: (e: PointerEvent<HTMLElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId)
      st.current = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y }
      setDragging(true); e.preventDefault()
    },
    onPointerMove: (e: PointerEvent<HTMLElement>) => {
      if (!dragging) return
      const el = e.currentTarget, b = bounds(el), s = st.current
      setPos({
        x: Math.max(0, Math.min(b.w - el.offsetWidth, s.ox + e.clientX - s.sx)),
        y: Math.max(0, Math.min(b.h - el.offsetHeight, s.oy + e.clientY - s.sy)),
      })
    },
    onPointerUp: () => setDragging(false),
    onPointerCancel: () => setDragging(false),
  }
  return { pos, setPos, dragging, bind }
}

/* ---------- graph: one hub card in the centre, six cards feeding into it ---------- */
type NodeDef = { id: string; x: number; y: number; w: number; h: number; cls?: string; label?: string; body: ReactNode }

const NODES: NodeDef[] = [
  /* hub */
  { id: 'hub', x: 470, y: 230, w: 260, h: 340, cls: 'hub', body: (
    <div className="nc hubc">
      <div className="top">
        <div className="av"><Mark /></div>
        <div className="who"><b>Devvrats ID</b><small>Developer identity</small></div>
      </div>
      <div className="layers"><i>Connect</i><i>Verify</i><i>Showcase</i></div>
      <div className="stats">
        <div><strong>12</strong><span>Projects</span></div>
        <div><strong>48</strong><span>Contributions</span></div>
        <div><strong>6</strong><span>Credentials</span></div>
      </div>
      <em className="ok">✓ Verified profile</em>
    </div>) },

  /* left: Connect */
  { id: 'skills', x: 60, y: 215, w: 200, h: 120, cls: 'card', label: 'Skills', body: (
    <div className="nc"><small>Skills</small>
      <div className="tags"><i>React</i><i>TypeScript</i><i>Next.js</i><i>Node</i></div></div>) },
  { id: 'projects', x: 150, y: 385, w: 190, h: 120, cls: 'card', label: 'Projects', body: (
    <div className="nc"><small>Projects</small><strong>12</strong><span>Shipped and live</span></div>) },
  { id: 'contrib', x: 70, y: 545, w: 200, h: 100, cls: 'card', label: 'Contributions', body: (
    <div className="nc"><small>Contributions</small>
      <div className="spark">{[30, 55, 40, 75, 60, 90, 70].map((h, i) => <i key={i} style={{ height: h + '%' }} />)}</div></div>) },

  /* right: Verify + Showcase */
  { id: 'creds', x: 940, y: 215, w: 200, h: 120, cls: 'card', label: 'Credentials', body: (
    <div className="nc"><small>Credentials</small><strong>6</strong><span>Verified ✓</span></div>) },
  { id: 'sabha', x: 860, y: 385, w: 190, h: 120, cls: 'card', label: 'Sabha', body: (
    <div className="nc"><small>Sabha</small><strong>3</strong><span>Sessions hosted</span></div>) },
  { id: 'profiles', x: 930, y: 545, w: 200, h: 100, cls: 'card', label: 'Linked profiles', body: (
    <div className="nc"><small>Linked profiles</small>
      <div className="tags"><i>GitHub</i><i>LinkedIn</i><i>Portfolio</i></div></div>) },
]

type Side = 'l' | 'r' | 't' | 'b'
/* every edge ends at the hub, so everything flows inward */
const EDGES: [string, string, Side, Side][] = [
  ['skills', 'hub', 'r', 'l'], ['projects', 'hub', 'r', 'l'], ['contrib', 'hub', 'r', 'l'],
  ['creds', 'hub', 'l', 'r'], ['sabha', 'hub', 'l', 'r'], ['profiles', 'hub', 'l', 'r'],
]
const anchor = (n: { x: number; y: number; w: number; h: number }, s: Side): [number, number] =>
  s === 'r' ? [n.x + n.w, n.y + n.h / 2] : s === 'l' ? [n.x, n.y + n.h / 2] : s === 'b' ? [n.x + n.w / 2, n.y + n.h] : [n.x + n.w / 2, n.y]

function GraphNode({ n, onMove }: { n: NodeDef; onMove: (id: string, p: { x: number; y: number }) => void }) {
  const { pos, setPos, dragging, bind } = useDrag({ x: n.x, y: n.y }, () => ({ w: W, h: H }))
  useEffect(() => { onMove(n.id, pos) }, [pos, n.id, onMove])
  const nudge = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const k = ({ ArrowLeft: [-12, 0], ArrowRight: [12, 0], ArrowUp: [0, -12], ArrowDown: [0, 12] } as Record<string, number[]>)[e.key]
    if (!k) return
    e.preventDefault()
    setPos({ x: Math.max(0, Math.min(W - n.w, pos.x + k[0])), y: Math.max(0, Math.min(H - n.h, pos.y + k[1])) })
  }
  return (
    <div {...bind} tabIndex={0} onKeyDown={nudge} className={`node ${n.cls ?? ''} ${dragging ? 'drag' : ''}`}
      style={{ left: pos.x, top: pos.y, width: n.w, height: n.h }}>
      {n.body}
      {n.label && <div className="label">{n.label}</div>}
    </div>
  )
}

function Graph() {
  const [pos, setPos] = useState<Record<string, { x: number; y: number }>>({})
  const onMove = useRef((id: string, p: { x: number; y: number }) => setPos(o => ({ ...o, [id]: p }))).current
  const geo = (id: string) => { const n = NODES.find(x => x.id === id)!; return { ...n, ...(pos[id] ?? {}) } }
  return (
    <section className="section" aria-label="Design process">
      <div className="scroller"><div className="stage">
        <h2>Your work. One platform. Everything connected.</h2>
        <svg className="wires">
          <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stopColor="#a78bfa" stopOpacity=".15" /><stop offset=".5" stopColor="#a78bfa" stopOpacity=".7" /><stop offset="1" stopColor="#a78bfa" stopOpacity=".15" /></linearGradient></defs>
          {EDGES.map(([a, b, sa, sb]) => {
            const [x1, y1] = anchor(geo(a), sa), [x2, y2] = anchor(geo(b), sb)
            const k = Math.max(60, Math.abs(x2 - x1) / 2, Math.abs(y2 - y1) / 2)
            const c1 = sa === 'b' || sa === 't' ? [x1, y1 + k] : [x1 + (sa === 'r' ? k : -k), y1]
            const c2 = sb === 'b' || sb === 't' ? [x2, y2 + k] : [x2 + (sb === 'l' ? -k : k), y2]
            const d = `M${x1},${y1} C${c1} ${c2} ${x2},${y2}`
            return (
              <g key={a + b}>
                <path d={d} />
                <path d={d} className="flow" />
              </g>
            )
          })}
        </svg>
        {NODES.map(n => <GraphNode key={n.id} n={n} onMove={onMove} />)}
        <p className="sub">DID brings your developer identity together in three connected layers. Each builds on the last, turning scattered profiles, skills, projects, and contributions into one evolving identity. No fragmented portfolios. No disconnected credentials. Just your work, connected and ready to represent you.</p>
      </div></div>
    </section>
  )
}

/* ---------- blueprint (single section) ---------- */
const BLUEPRINT = {
  id: 'bp',
  lead: 'Your developer identity, built the Devvrats way. DID brings your skills, projects, contributions, and credentials together in one connected profile.',
  rest: 'It turns everything you build across the ecosystem into a clear identity that represents your work, your journey, and what you bring to Devvrats. The result is a developer profile that answers one question:',
  q: ['What have you built, what have you contributed, and who are you becoming as a developer?'],
  chips: ['✓ Credential verified', 'Contribution merged'],
}

function Chip({ x, y, children, accent }: { x: number; y: number; children: ReactNode; accent?: boolean }) {
  const { pos, bind } = useDrag({ x, y }, el => ({ w: el.parentElement!.clientWidth, h: el.parentElement!.clientHeight }))
  return <div {...bind} className={`chip ${accent ? 'o' : ''}`} style={{ left: pos.x, top: pos.y, bottom: 'auto', right: 'auto' } as CSSProperties}>{children}</div>
}

function Blueprint() {
  const p = BLUEPRINT
  return (
    <section className="bp" id={p.id} aria-label="Blueprint">
      {/* paragraph: fade only */}
      <Fade as="div" className="big">
        <span className="hl">{p.lead}</span>{' '}
        <span className="rest">{p.rest}</span>
      </Fade>
      <div className="qs">
        {p.q.map((t, i) => (
          <BlurWords key={t} as="div" className="q" parts={[{ t }]} delay={0.15 + i * 0.4} />
        ))}
      </div>

      {/* laptop: DID profile screen */}
      <div className="meet">
        <div className="scr">
          <div className="bar">
            <i /><i /><i />
            <span className="url">did.devvrats.in/you</span>
          </div>

          <div className="body">
            <div className="prof">
              <div className="pav"><Mark /></div>
              <div className="pwho">
                <b>Your Name</b>
                <small>Full-stack developer · Devvrats</small>
              </div>
              <em className="vbadge">✓ Verified</em>
            </div>

            <div className="pstats">
              <div><strong>12</strong><span>Projects</span></div>
              <div><strong>48</strong><span>Contributions</span></div>
              <div><strong>6</strong><span>Credentials</span></div>
            </div>

            <div className="pgrid">
              <div className="pbox">
                <small>Contribution activity</small>
                <div className="spark">
                  {[30, 55, 40, 75, 60, 90, 70, 50, 85, 65, 95, 72].map((h, i) => <i key={i} style={{ height: h + '%' }} />)}
                </div>
              </div>
              <div className="pbox">
                <small>Skills</small>
                <div className="tags"><i>React</i><i>TypeScript</i><i>Next.js</i><i>Node</i><i>Tailwind</i></div>
              </div>
            </div>
          </div>
        </div>

        <Chip x={40} y={300}>{p.chips[0]}</Chip>
        <Chip x={720} y={300} accent>{p.chips[1]}</Chip>
      </div>
    </section>
  )
}

/* ---------- full section ---------- */
export default function DidSection() {
  return (
    <div className="ps-root"><div className="wrap">
      <header className="hero">
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
    </div></div>
  )
}