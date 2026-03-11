import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Icon from '@/components/ui/icon'

export interface Slide {
  id: string
  slideNumber: number
  label?: string
  title: string
  bullets?: string[]
  content?: string
  emoji?: string
  accent: string
}

interface PresentationPageProps {
  slides: Slide[]
  presentationTitle: string
  accentColor: string
  backPath?: string
}

export default function PresentationPage({ slides, presentationTitle, accentColor, backPath = '/' }: PresentationPageProps) {
  const [activeSlide, setActiveSlide] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { scrollYProgress } = useScroll({ container: containerRef })
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollPosition = containerRef.current.scrollTop
        const windowHeight = window.innerHeight
        const newActive = Math.round(scrollPosition / windowHeight)
        setActiveSlide(Math.min(newActive, slides.length - 1))
      }
    }
    const container = containerRef.current
    if (container) container.addEventListener('scroll', handleScroll)
    return () => { if (container) container.removeEventListener('scroll', handleScroll) }
  }, [slides.length])

  const goTo = (index: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: index * window.innerHeight, behavior: 'smooth' })
    }
  }

  const goNext = () => { if (activeSlide < slides.length - 1) goTo(activeSlide + 1) }
  const goPrev = () => { if (activeSlide > 0) goTo(activeSlide - 1) }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [activeSlide])

  return (
    <div className="h-screen overflow-hidden bg-gray-950 relative">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 origin-left z-50"
        style={{ scaleX, backgroundColor: accentColor }}
      />

      <button
        onClick={() => navigate(backPath)}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 text-white/60 hover:text-white transition-colors bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 text-sm"
      >
        <Icon name="ArrowLeft" size={16} />
        Назад
      </button>

      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2">
        <p className="text-white/60 text-xs text-center truncate max-w-xs">{presentationTitle}</p>
      </div>

      <nav className="fixed top-0 right-0 h-screen flex flex-col justify-center z-40 p-3 gap-1">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className="w-2.5 h-2.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor: index === activeSlide ? accentColor : '#374151',
              transform: index === activeSlide ? 'scale(1.5)' : 'scale(1)',
            }}
          />
        ))}
      </nav>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
        <button
          onClick={goPrev}
          disabled={activeSlide === 0}
          className="bg-black/40 backdrop-blur-sm rounded-full p-2 text-white/60 hover:text-white disabled:opacity-30 transition-all"
        >
          <Icon name="ChevronUp" size={20} />
        </button>
        <span className="text-white/50 text-sm tabular-nums">{activeSlide + 1} / {slides.length}</span>
        <button
          onClick={goNext}
          disabled={activeSlide === slides.length - 1}
          className="bg-black/40 backdrop-blur-sm rounded-full p-2 text-white/60 hover:text-white disabled:opacity-30 transition-all"
        >
          <Icon name="ChevronDown" size={20} />
        </button>
      </div>

      <div ref={containerRef} className="h-full overflow-y-auto snap-y snap-mandatory">
        {slides.map((slide, index) => (
          <SlideView key={slide.id} slide={slide} isActive={index === activeSlide} accentColor={accentColor} />
        ))}
      </div>
    </div>
  )
}

function SlideView({ slide, isActive, accentColor }: { slide: Slide; isActive: boolean; accentColor: string }) {
  const isFirst = slide.slideNumber === 1
  const isLast = slide.slideNumber === 15

  return (
    <section className="relative h-screen w-full snap-start flex flex-col justify-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: isFirst || isLast
            ? `linear-gradient(135deg, ${accentColor}22 0%, #111827 50%, #030712 100%)`
            : 'linear-gradient(135deg, #111827 0%, #030712 100%)',
        }}
      />
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: accentColor }}
      />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-5 blur-3xl bg-white" />

      <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-5xl">
        {slide.label && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="mb-4"
          >
            <span
              className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full border"
              style={{ color: accentColor, borderColor: `${accentColor}44`, backgroundColor: `${accentColor}11` }}
            >
              {slide.label}
            </span>
          </motion.div>
        )}

        {slide.emoji && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
            className="text-6xl mb-6"
          >
            {slide.emoji}
          </motion.div>
        )}

        <motion.div
          className="flex items-start gap-4 mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {!isFirst && !isLast && (
            <span
              className="text-5xl md:text-7xl font-black opacity-20 leading-none select-none flex-shrink-0"
              style={{ color: accentColor }}
            >
              {String(slide.slideNumber).padStart(2, '0')}
            </span>
          )}
          <h2 className={`font-bold leading-tight text-white ${isFirst || isLast ? 'text-4xl md:text-6xl lg:text-7xl' : 'text-3xl md:text-5xl'}`}>
            {slide.title}
          </h2>
        </motion.div>

        {slide.content && (
          <motion.p
            className="text-neutral-400 text-lg md:text-xl max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            {slide.content}
          </motion.p>
        )}

        {slide.bullets && (
          <ul className="mt-4 space-y-3 max-w-2xl">
            {slide.bullets.map((bullet, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                className="flex items-start gap-3 text-neutral-300 text-base md:text-lg"
              >
                <span
                  className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: accentColor }}
                />
                {bullet}
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-1 opacity-30"
        style={{ backgroundColor: accentColor }}
      />
    </section>
  )
}
