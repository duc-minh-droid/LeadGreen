import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowRight, QrCode, Sprout, Trophy } from "lucide-react"
import TrueFocus from "./Effects/TrueFocus"

// Plant stages shown in the hero. These are the same SVGs the game uses.
const STAGES = [
  { level: 1, name: "Leafy" },
  { level: 2, name: "Sprouto" },
  { level: 3, name: "Thorny" },
  { level: 5, name: "Budster" },
  { level: 6, name: "Twigsy" },
  { level: 10, name: "Bloomy" },
]

// A few leaves drifting in the background of the hero.
const LEAVES = [
  { left: "6%", size: 22, delay: 0, duration: 11 },
  { left: "18%", size: 14, delay: 3, duration: 9 },
  { left: "34%", size: 18, delay: 6, duration: 12 },
  { left: "58%", size: 12, delay: 1.5, duration: 10 },
  { left: "74%", size: 20, delay: 4.5, duration: 13 },
  { left: "90%", size: 16, delay: 2, duration: 9.5 },
]

function Leaf({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M20 4C10 4 4 10 4 20c10 0 16-6 16-16Z" fill="#1DB954" opacity="0.55" />
      <path d="M4 20 14 10" stroke="#168d40" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function GrowingPlant() {
  const [stage, setStage] = useState(STAGES.length - 1)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setProgress((p) => (p >= 100 ? 0 : p + 4)), 90)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (progress === 0) setStage((s) => (s + 1) % STAGES.length)
  }, [progress])

  const current = STAGES[stage]
  const r = 118
  const circumference = 2 * Math.PI * r

  return (
    <div className="relative w-[300px] h-[300px] md:w-[340px] md:h-[340px] mx-auto">
      <motion.div
        className="absolute inset-6 rounded-full bg-gradient-to-br from-green-100 via-emerald-50 to-lime-100"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 260 260">
        <circle cx="130" cy="130" r={r} stroke="#dcfce7" strokeWidth="8" fill="none" />
        <circle
          cx="130" cy="130" r={r} stroke="#1DB954" strokeWidth="8" fill="none" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress / 100)}
          style={{ transition: progress === 0 ? "none" : "stroke-dashoffset 90ms linear" }}
        />
      </svg>
      <AnimatePresence mode="popLayout">
        <motion.img
          key={current.level}
          src={`/media/plants/plant${current.level}.svg`}
          alt={current.name}
          className="absolute inset-0 m-auto w-40 h-40 md:w-48 md:h-48 drop-shadow-xl"
          initial={{ scale: 0.4, opacity: 0, rotate: -8 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 1.25, opacity: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 14 }}
          draggable={false}
        />
      </AnimatePresence>
      <motion.div
        key={`badge-${current.level}`}
        className="absolute -bottom-2 inset-x-0 mx-auto w-fit bg-white shadow-lg rounded-full px-4 py-1.5 text-sm font-semibold text-green-800 whitespace-nowrap"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Level {current.level} · {current.name}
      </motion.div>
    </div>
  )
}

const STEPS = [
  { icon: QrCode, label: "Scan a campus QR code" },
  { icon: Sprout, label: "Grow your plant with points" },
  { icon: Trophy, label: "Climb the leaderboard" },
]

export default function Section() {
  return (
    <section className="relative overflow-hidden isolate">
      {/* soft background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-green-50 via-white to-white" />
      <motion.div
        className="absolute -z-10 -top-40 -right-32 w-[520px] h-[520px] rounded-full bg-green-200/40 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -z-10 top-40 -left-40 w-[420px] h-[420px] rounded-full bg-lime-200/40 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      {LEAVES.map((leaf, i) => (
        <motion.div
          key={i}
          className="absolute -z-10 top-0 pointer-events-none"
          style={{ left: leaf.left }}
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: [-40, 620], opacity: [0, 1, 1, 0], rotate: [0, 120, 240], x: [0, 30, -20, 10] }}
          transition={{ duration: leaf.duration, delay: leaf.delay, repeat: Infinity, ease: "linear" }}
        >
          <Leaf size={leaf.size} />
        </motion.div>
      ))}

      <div className="max-w-6xl mx-auto px-6 pt-8 pb-14 md:pt-10 md:pb-20 grid md:grid-cols-[1.15fr_1fr] gap-12 items-center">
        <div className="text-center md:text-left">
          <motion.div
            className="font-sans uppercase tracking-[0.3em] md:tracking-[0.45em] text-green-700 md:text-[18px] mb-6 flex justify-center md:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <TrueFocus
              sentence="Lead Green"
              manualMode={false}
              blurAmount={5}
              borderColor="green"
              animationDuration={0.5}
              pauseBetweenAnimations={1.5}
            />
          </motion.div>

          <motion.h1
            className="font-serif text-[40px] md:text-[54px] leading-[1.08] text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Share <span className="italic text-green-700">sustainable</span> living, grow a greener campus.
          </motion.h1>

          <motion.p
            className="mt-6 text-lg md:text-xl text-gray-600 max-w-xl mx-auto md:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            LeadGreen turns eco-friendly actions into a game. Scan a QR code where you
            recycle, cycle or refill, post a photo, and spend the points you earn on a
            virtual plant that levels up as you do.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/game"
                className="inline-flex items-center gap-2 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 shadow-lg shadow-green-600/30 transition-colors"
              >
                Grow your plant <ArrowRight size={18} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/feed"
                className="inline-flex items-center gap-2 rounded-full bg-white text-green-800 font-semibold px-6 py-3 border border-green-200 hover:border-green-400 shadow-sm transition-colors"
              >
                See the feed
              </Link>
            </motion.div>
          </motion.div>

          <motion.ul
            className="mt-8 flex flex-wrap gap-x-6 gap-y-3 justify-center md:justify-start text-sm text-gray-600"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.9 } } }}
          >
            {STEPS.map(({ icon: Icon, label }) => (
              <motion.li
                key={label}
                className="flex items-center gap-2"
                variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
              >
                <span className="grid place-items-center w-8 h-8 rounded-full bg-green-100 text-green-700">
                  <Icon size={16} />
                </span>
                {label}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <GrowingPlant />
        </motion.div>
      </div>
    </section>
  )
}
