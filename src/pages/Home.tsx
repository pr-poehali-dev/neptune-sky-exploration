import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Squares } from '@/components/landing/squares-background'

const presentations = [
  {
    path: '/rules',
    emoji: '📋',
    title: 'Правила игры в волейбол',
    desc: '15 слайдов · Основы и регламент',
    color: '#2563EB',
    bg: 'from-blue-900 to-blue-950',
  },
  {
    path: '/tactics',
    emoji: '🏐',
    title: 'Тактика и техника волейбола',
    desc: '15 слайдов · Приёмы и стратегии',
    color: '#16A34A',
    bg: 'from-green-900 to-green-950',
  },
]

export default function Home() {
  const navigate = useNavigate()
  return (
    <div className="h-screen overflow-hidden bg-black relative flex flex-col items-center justify-center">
      <div className="absolute inset-0 z-10">
        <Squares direction="diagonal" speed={0.3} squareSize={40} borderColor="#1a1a1a" hoverFillColor="#111" />
      </div>
      <div className="relative z-20 flex flex-col items-center gap-10 px-6 w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="text-5xl mb-4">🏐</div>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Волейбол</h1>
          <p className="text-neutral-400 mt-3 text-lg">Выберите презентацию</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {presentations.map((p, i) => (
            <motion.button
              key={p.path}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(p.path)}
              className={`bg-gradient-to-br ${p.bg} rounded-2xl p-8 text-left border border-white/10 hover:border-white/30 transition-all cursor-pointer`}
            >
              <div className="text-5xl mb-4">{p.emoji}</div>
              <h2 className="text-xl font-bold text-white mb-2">{p.title}</h2>
              <p className="text-neutral-400 text-sm">{p.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
