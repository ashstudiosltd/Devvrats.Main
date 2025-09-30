'use client'
import Head from 'next/head'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'

// --- Animated floating sphere for hero ---
function FloatingSphere({ speed = 0.3, radius = 1, position = [0, 0, 0], color = '#6366f1' }: { speed?: number; radius?: number; position?: [number, number, number]; color?: string }) {
  const ref = useRef<any>()
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * speed * 0.2
      ref.current.rotation.x += delta * speed * 0.1
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5
    }
  })
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} opacity={0.9} transparent />
    </mesh>
  )
}

// Example Curriculum Data
const CURRICULUM: Record<string, Record<string, { title: string; desc: string; duration: string }[]>> = {
  JavaScript: {
    Fundamentals: [
      { title: 'Variables & Data Types', desc: 'Understanding let, const, var and primitive types', duration: '2h' },
      { title: 'Functions & Scope', desc: 'Arrow functions, closures, and execution context', duration: '3h' },
      { title: 'Loops & Conditionals', desc: 'Control flow and iteration patterns', duration: '2h' },
      { title: 'ES6+ Features', desc: 'Modern JavaScript syntax and features', duration: '4h' },
    ],
    Algorithms: [
      { title: 'Sorting Algorithms', desc: 'Bubble sort, merge sort, quick sort implementations', duration: '5h' },
      { title: 'Searching Methods', desc: 'Binary search, linear search strategies', duration: '3h' },
      { title: 'Recursion Patterns', desc: 'Recursive thinking and base cases', duration: '4h' },
      { title: 'Big O Analysis', desc: 'Time and space complexity evaluation', duration: '3h' },
    ],
    'Data Structures': [
      { title: 'Arrays & Objects', desc: 'Native JavaScript data containers', duration: '3h' },
      { title: 'Stacks & Queues', desc: 'LIFO and FIFO data structures', duration: '4h' },
      { title: 'Hash Maps', desc: 'Key-value pair storage and retrieval', duration: '3h' },
      { title: 'Linked Lists', desc: 'Dynamic data structure implementation', duration: '5h' },
    ],
    Advanced: [],
  },
  Python: {
    Fundamentals: [
      { title: 'Python Basics', desc: 'Variables, data types, and basic syntax', duration: '2h' },
      { title: 'Functions & Modules', desc: 'Defining functions and importing modules', duration: '3h' },
      { title: 'Control Flow', desc: 'If statements, loops, and iterations', duration: '2h' },
      { title: 'Lists & Dictionaries', desc: 'Working with Python collections', duration: '3h' },
    ],
    Algorithms: [
      { title: 'Sorting in Python', desc: 'Implementing sorting algorithms', duration: '4h' },
      { title: 'Search Algorithms', desc: 'Binary and linear search methods', duration: '3h' },
      { title: 'Dynamic Programming', desc: 'Memoization and tabulation', duration: '5h' },
      { title: 'Graph Algorithms', desc: 'BFS, DFS, and pathfinding', duration: '6h' },
    ],
    'Data Structures': [
      { title: 'Lists & Tuples', desc: 'Sequence data structures', duration: '3h' },
      { title: 'Sets & Dictionaries', desc: 'Hash-based collections', duration: '3h' },
      { title: 'Trees & Graphs', desc: 'Hierarchical data structures', duration: '5h' },
      { title: 'Heaps & Priority Queues', desc: 'Specialized data structures', duration: '4h' },
    ],
    Advanced: [],
  },
  'C++': {
    Fundamentals: [
      { title: 'C++ Basics', desc: 'Variables, types, and operators', duration: '3h' },
      { title: 'Pointers & References', desc: 'Memory management fundamentals', duration: '4h' },
      { title: 'Classes & Objects', desc: 'Object-oriented programming', duration: '4h' },
      { title: 'Templates', desc: 'Generic programming in C++', duration: '3h' },
    ],
    Algorithms: [
      { title: 'STL Algorithms', desc: 'Standard Template Library algorithms', duration: '4h' },
      { title: 'Sorting & Searching', desc: 'Efficient algorithms in C++', duration: '4h' },
      { title: 'Graph Algorithms', desc: 'Advanced graph traversal', duration: '6h' },
      { title: 'Optimization', desc: 'Performance optimization techniques', duration: '5h' },
    ],
    'Data Structures': [
      { title: 'Arrays & Vectors', desc: 'Dynamic arrays in C++', duration: '3h' },
      { title: 'Linked Lists', desc: 'Pointer-based structures', duration: '4h' },
      { title: 'Trees & BST', desc: 'Binary search trees', duration: '5h' },
      { title: 'Hash Tables', desc: 'Unordered maps and sets', duration: '4h' },
    ],
    Advanced: [],
  },
  Java: {
    Fundamentals: [
      { title: 'Java Basics', desc: 'Syntax, variables, and data types', duration: '3h' },
      { title: 'OOP Concepts', desc: 'Classes, objects, and inheritance', duration: '4h' },
      { title: 'Collections Framework', desc: 'Lists, sets, and maps', duration: '3h' },
      { title: 'Exception Handling', desc: 'Try-catch and error handling', duration: '2h' },
    ],
    Algorithms: [
      { title: 'Sorting in Java', desc: 'Comparators and sorting', duration: '4h' },
      { title: 'Search Techniques', desc: 'Binary search implementations', duration: '3h' },
      { title: 'Backtracking', desc: 'Recursive problem solving', duration: '5h' },
      { title: 'Dynamic Programming', desc: 'DP patterns in Java', duration: '6h' },
    ],
    'Data Structures': [
      { title: 'ArrayList & LinkedList', desc: 'List implementations', duration: '3h' },
      { title: 'Stack & Queue', desc: 'LIFO and FIFO structures', duration: '3h' },
      { title: 'HashMap & TreeMap', desc: 'Map implementations', duration: '4h' },
      { title: 'Trees & Graphs', desc: 'Complex data structures', duration: '5h' },
    ],
    Advanced: [],
  },
  'React / Next.js': {
    Fundamentals: [
      { title: 'React Basics', desc: 'Components, props, and state', duration: '3h' },
      { title: 'Hooks', desc: 'useState, useEffect, and custom hooks', duration: '4h' },
      { title: 'Next.js Setup', desc: 'Pages, routing, and SSR', duration: '3h' },
      { title: 'Styling', desc: 'CSS modules and Tailwind', duration: '2h' },
    ],
    Algorithms: [
      { title: 'Rendering Optimization', desc: 'Memoization and performance', duration: '4h' },
      { title: 'State Management', desc: 'Context and Redux patterns', duration: '5h' },
      { title: 'Data Fetching', desc: 'SWR and React Query', duration: '4h' },
      { title: 'Algorithm Visualization', desc: 'Building interactive demos', duration: '5h' },
    ],
    'Data Structures': [
      { title: 'Component Trees', desc: 'React component hierarchy', duration: '3h' },
      { title: 'State Management', desc: 'Structuring application state', duration: '4h' },
      { title: 'Form Handling', desc: 'Complex form structures', duration: '3h' },
      { title: 'Data Tables', desc: 'Efficient table rendering', duration: '4h' },
    ],
    Advanced: [],
  },
  TypeScript: {
    Fundamentals: [
      { title: 'TypeScript Basics', desc: 'Types, interfaces, and annotations', duration: '3h' },
      { title: 'Advanced Types', desc: 'Generics, unions, and intersections', duration: '4h' },
      { title: 'Classes & Interfaces', desc: 'OOP in TypeScript', duration: '3h' },
      { title: 'Type Guards', desc: 'Runtime type checking', duration: '2h' },
    ],
    Algorithms: [
      { title: 'Generic Algorithms', desc: 'Type-safe algorithm implementations', duration: '4h' },
      { title: 'Data Transformations', desc: 'Mapped and conditional types', duration: '5h' },
      { title: 'Algorithm Typing', desc: 'Strong typing for algorithms', duration: '4h' },
      { title: 'Performance Patterns', desc: 'Optimized TypeScript code', duration: '4h' },
    ],
    'Data Structures': [
      { title: 'Typed Collections', desc: 'Arrays, sets, and maps with types', duration: '3h' },
      { title: 'Custom Data Structures', desc: 'Building type-safe structures', duration: '4h' },
      { title: 'Immutable Data', desc: 'Readonly and const assertions', duration: '3h' },
      { title: 'Generic Structures', desc: 'Reusable data structures', duration: '4h' },
    ],
    Advanced: [],
  },
}

const STATS = [
  { number: '10,000+', label: 'Students Enrolled' },
  { number: '50+', label: 'Hours of Content' },
  { number: '6', label: 'Languages Covered' },
  { number: '95%', label: 'Success Rate' },
]

const FEATURES = [
  { icon: '🎯', title: 'Structured Learning', desc: 'Follow a proven curriculum from basics to advanced topics' },
  { icon: '💻', title: 'Hands-on Practice', desc: 'Learn by doing with practical coding exercises' },
  { icon: '🚀', title: 'Career Ready', desc: 'Build portfolio projects and prepare for interviews' },
  { icon: '🏆', title: 'Expert Guidance', desc: 'Learn from industry professionals with years of experience' },
]

export default function KutirPage(): JSX.Element {
  const [dark, setDark] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [dark])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const LANGS = Object.keys(CURRICULUM)
  const MODULES = ['Fundamentals', 'Algorithms', 'Data Structures', 'Advanced']

  const [query, setQuery] = useState('')
  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    const hits: { lang: string; matchedModules: string[] }[] = []
    for (const lang of LANGS) {
      if (lang.toLowerCase().includes(q)) hits.push({ lang, matchedModules: MODULES })
      else {
        const matched = MODULES.filter((m) => m.toLowerCase().includes(q))
        if (matched.length) hits.push({ lang, matchedModules: matched })
      }
    }
    return hits
  }, [query, LANGS])

  const [openPremium, setOpenPremium] = useState(false)
  const [openSuggest, setOpenSuggest] = useState(false)
  const [currentView, setCurrentView] = useState<'home' | 'language'>('home')
  const [selectedLang, setSelectedLang] = useState<string | null>(null)
  const [openLesson, setOpenLesson] = useState<{ title: string; desc: string } | null>(null)

  const handleLanguageSelect = (lang: string) => {
    setSelectedLang(lang)
    setCurrentView('language')
    setQuery('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0e27] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Head>
        <title>Kutir (Powered by Anu) — Master Programming from Zero to Hero</title>
      </Head>

      {/* Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/10 dark:bg-[#0a0e27]/80 backdrop-blur-xl' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <div 
              className="text-sm tracking-[0.3em] font-bold cursor-pointer hover:text-pink-400 transition-colors uppercase" 
              onClick={() => setCurrentView('home')}
            >
              KUTIR.
            </div>
            {currentView === 'language' && selectedLang && (
              <>
                <span className="text-gray-400">/</span>
                <span className="text-sm font-medium text-pink-400">{selectedLang}</span>
              </>
            )}
          </div>
          <div className="flex-1 px-4 max-w-md">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search languages or modules..."
                className="w-full rounded-full border border-gray-300 dark:border-gray-700 px-5 py-2 bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm focus:border-pink-400 dark:focus:border-pink-400 outline-none transition-all"
              />
              {query && (
                <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-3 z-50">
                  {results.length ? results.map((r) => (
                    <div 
                      key={r.lang} 
                      className="cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/20 p-3 rounded-xl transition-colors" 
                      onClick={() => handleLanguageSelect(r.lang)}
                    >
                      <div className="font-semibold text-pink-600 dark:text-pink-400">{r.lang}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{r.matchedModules.join(', ')}</div>
                    </div>
                  )) : (
                    <div className="text-center py-3">
                      <p className="text-gray-500 mb-2">No results found</p>
                      <button onClick={() => setOpenSuggest(true)} className="text-pink-600 hover:text-pink-700 underline text-sm">Suggest a language</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <button 
            className="px-6 py-2 rounded-full border border-gray-300 dark:border-gray-600 hover:border-pink-400 dark:hover:border-pink-400 transition-all text-sm font-medium"
          >
            Join Sabha-Free Forever
          </button>
        </div>
      </header>

      {/* Main Content */}
      {currentView === 'home' ? (
        <>
          {/* Hero Section with Stars */}
          <section className="relative overflow-hidden bg-[#0a0e27] dark:bg-[#0a0e27]">
            {/* Animated Stars Background */}
            <div className="absolute inset-0">
              {[...Array(100)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 sm:py-40 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl sm:text-7xl font-bold mb-6 leading-tight">
                  <span className="text-white">Learning, Creating</span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-pink-500 to-purple-500">
                    thriving together.
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                  Community of learners and creators, united by curiosity and collaboration. Ideas turn into action, 
                  skills transform into innovation, and together we shape the future of technology and beyond.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button 
                    onClick={() => window.scrollTo({ top: document.getElementById('programs')?.offsetTop || 800, behavior: 'smooth' })}
                    className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                  >
                    Start Learning Free 🚀
                  </button>
                  <button 
                    className="text-gray-300 hover:text-white underline underline-offset-4 transition-colors"
                  >
                    Read our Blogs
                  </button>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {STATS.map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="text-4xl sm:text-5xl font-extrabold text-pink-600 dark:text-pink-400 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Why Choose Kutir?</h2>
                <p className="text-xl text-gray-600 dark:text-gray-400">Everything you need to become a successful developer</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {FEATURES.map((feature, idx) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
                  >
                    <div className="text-5xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Programs Section */}
          <section id="programs" className="py-20 max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Choose Your Path</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">Select a language and start your journey</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {LANGS.map((lang, idx) => (
                <motion.div
                  key={lang}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative rounded-3xl p-8 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all cursor-pointer bg-white dark:bg-gray-800 hover:border-pink-500 dark:hover:border-pink-400 overflow-hidden"
                  onClick={() => handleLanguageSelect(lang)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">{lang}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">{MODULES.length} comprehensive tracks</p>
                    <div className="flex items-center justify-between">
                      <button 
                        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold group-hover:shadow-lg transition-all" 
                        onClick={(e) => { e.stopPropagation(); handleLanguageSelect(lang) }}
                      >
                        Start Learning
                      </button>
                      <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Career?</h2>
              <p className="text-xl mb-8 opacity-90">Join thousands of students already learning with Kutir</p>
              <button 
                onClick={() => window.scrollTo({ top: document.getElementById('programs')?.offsetTop || 800, behavior: 'smooth' })}
                className="px-10 py-4 bg-white text-pink-600 rounded-full font-bold text-lg hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                Get Started Now
              </button>
            </div>
          </section>
        </>
      ) : currentView === 'language' && selectedLang ? (
        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-8">
            <button 
              onClick={() => setCurrentView('home')}
              className="text-indigo-600 hover:text-indigo-700 flex items-center gap-2 mb-6 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Programs
            </button>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-5xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{selectedLang} Learning Path</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">Follow the structured curriculum to master {selectedLang}</p>
            </motion.div>
          </div>

          {MODULES.map((module, moduleIdx) => (
            <motion.div 
              key={module} 
              className="mb-16"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: moduleIdx * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                  {moduleIdx + 1}
                </div>
                <div>
                  <h3 className="text-3xl font-bold flex items-center gap-3">
                    {module}
                    {module === 'Advanced' && (
                      <span className="px-4 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm rounded-full font-semibold shadow-md">
                        Premium
                      </span>
                    )}
                  </h3>
                </div>
              </div>

              {module === 'Advanced' ? (
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setOpenPremium(true)}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-12 text-center cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 transition-all bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900"
                >
                  <div className="text-6xl mb-4">🔒</div>
                  <p className="text-2xl font-bold mb-3">Premium Content</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    Unlock advanced topics, exclusive projects, and expert mentorship
                  </p>
                  <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full font-bold shadow-lg transition-all">
                    Upgrade to Premium ✨
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {(CURRICULUM[selectedLang]?.[module] || []).map((lesson, idx) => (
                    <div key={lesson.title}>
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setOpenLesson(lesson)}
                        className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-2xl transition-all cursor-pointer group bg-white dark:bg-gray-800 hover:border-indigo-500 dark:hover:border-indigo-400"
                      >
                        <div className="flex items-start gap-5">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md">
                            <span className="text-indigo-600 dark:text-indigo-300 font-bold text-xl">{idx + 1}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-bold text-xl group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {lesson.title}
                              </h4>
                              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                                <span>⏱️</span> {lesson.duration}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">{lesson.desc}</p>
                          </div>
                          <div className="text-indigo-600 text-2xl group-hover:translate-x-2 transition-transform">→</div>
                        </div>
                      </motion.div>
                      {idx < (CURRICULUM[selectedLang]?.[module] || []).length - 1 && (
                        <div className="flex justify-center py-3">
                          <div className="w-1 h-10 bg-gradient-to-b from-indigo-300 to-transparent dark:from-indigo-700"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {moduleIdx < MODULES.length - 1 && (
                <div className="flex justify-center py-10">
                  <div className="w-1 h-16 bg-gradient-to-b from-indigo-300 via-purple-300 to-transparent dark:from-indigo-700 dark:via-purple-700 rounded-full"></div>
                </div>
              )}
            </motion.div>
          ))}
        </main>
      ) : null}

      {/* Lesson Modal */}
      <AnimatePresence>
        {openLesson && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpenLesson(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 20 }} 
              className="max-w-3xl w-full bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{openLesson.title}</h4>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">{openLesson.desc}</p>
              
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-12 text-center mb-8 border-2 border-dashed border-gray-300 dark:border-gray-700">
                <div className="text-7xl mb-6">🎥</div>
                <p className="text-2xl font-bold text-red-500 mb-3">Video Not Found</p>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  This lesson video is coming soon. Stay tuned for updates!
                </p>
              </div>

              <div className="flex justify-end gap-4">
                <button 
                  onClick={() => setOpenLesson(null)} 
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-semibold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Modal */}
      <AnimatePresence>
        {openPremium && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpenPremium(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 20 }} 
              className="max-w-lg w-full bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">✨</div>
                <h4 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Upgrade to Premium
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Unlock the full potential of your learning journey
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  'Access to all Advanced modules',
                  'Exclusive video content & tutorials',
                  'Real-world project walkthroughs',
                  'Priority support from experts',
                  'Early access to new courses',
                  'Certificate of completion'
                ].map((feature, idx) => (
                  <motion.div 
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-green-500 text-2xl">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl p-6 mb-8 text-center border-2 border-indigo-200 dark:border-indigo-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Special Launch Price</p>
                <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">$49<span className="text-lg">/month</span></p>
                <p className="text-sm text-gray-500">Cancel anytime</p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setOpenPremium(false)} 
                  className="flex-1 px-6 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-semibold"
                >
                  Maybe Later
                </button>
                <button 
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all font-bold shadow-lg hover:shadow-xl"
                >
                  Get Premium
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggest Modal */}
      <AnimatePresence>
        {openSuggest && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpenSuggest(false)}
          >
            <motion.div 
              initial={{ y: 20, scale: 0.9 }} 
              animate={{ y: 0, scale: 1 }} 
              exit={{ y: 20, scale: 0.9 }} 
              className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-2xl font-bold mb-2">💡 Suggest a Feature</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Help us improve Kutir by sharing your ideas</p>
              <textarea 
                className="w-full h-40 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 resize-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                placeholder="Tell us what you'd like to see..."
              />
              <div className="mt-6 flex justify-end gap-3">
                <button 
                  onClick={() => setOpenSuggest(false)} 
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-semibold"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setOpenSuggest(false)
                    alert('Thank you for your suggestion!')
                  }} 
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all font-semibold shadow-lg"
                >
                  Send Suggestion
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span>📚</span> Kutir
              </h3>
              <p className="text-gray-400">Empowering students to master programming through structured learning and hands-on practice.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Connect</h4>
              <div className="flex gap-4 text-2xl">
                <a href="#" className="hover:text-indigo-400 transition-colors">🐦</a>
                <a href="#" className="hover:text-indigo-400 transition-colors">📘</a>
                <a href="#" className="hover:text-indigo-400 transition-colors">📷</a>
                <a href="#" className="hover:text-indigo-400 transition-colors">💼</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
            <p>© 2025 Kutir (Powered by Anu). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}