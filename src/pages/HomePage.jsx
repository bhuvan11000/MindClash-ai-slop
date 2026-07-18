import { Link } from 'react-router-dom'
import CharacterCard from '../components/CharacterCard'
import PixelSnow from '../components/PixelSnow'
import Shuffle from '../components/Shuffle'
import characters from '../data/characters.json'

function HomePage() {
  return (
    <div className="relative min-h-screen bg-white">
      <div className="sticky top-3 z-30 px-5">
        <div className="max-w-[1200px] mx-auto bg-white border-[3px] border-[--color-ink] shadow-[--shadow-md] h-16 flex items-center px-5">
          <div className="w-full flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src="/avatars/luffy.png" alt="MindClash" className="w-8 h-8" />
              <span className="font-pixel text-base text-[--color-ink] tracking-wide">MindClash</span>
            </Link>
            <nav className="flex items-center gap-5">
              <Link to="/chat" className="font-mono text-[11px] uppercase tracking-wider text-[--color-ink-muted] hover:text-[--color-ink] transition-colors duration-100">Chat</Link>
              <Link to="/debate" className="font-mono text-[11px] uppercase tracking-wider text-[--color-ink-muted] hover:text-[--color-ink] transition-colors duration-100">Debate</Link>
            </nav>
          </div>
        </div>
      </div>

      <section className="relative z-20 pt-10 pb-16 text-center">
        <Shuffle
          text="MindClash"
          tag="h1"
          className="font-pixel text-7xl text-[--color-ink] leading-relaxed"
          shuffleDirection="right"
          duration={0.35}
          animationMode="evenodd"
          shuffleTimes={2}
          ease="power3.out"
          stagger={0.03}
          threshold={0}
          triggerOnce={true}
          triggerOnHover={true}
          respectReducedMotion={true}
        />
      </section>

      <div className="fixed inset-0 z-0 pointer-events-none">
        <PixelSnow
          color="#1c1c1a"
          flakeSize={0.01}
          pixelResolution={300}
          speed={0.6}
          density={0.06}
          direction={135}
          brightness={0.3}
        />
      </div>

      <main className="relative z-10 max-w-[1200px] mx-auto px-6">
        <section className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
          {characters.map((character, i) => (
            <div
              key={character.id}
              className="animate-card-enter"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <CharacterCard character={character} />
            </div>
          ))}
        </section>

        <section className="text-center py-12">
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/chat"
              className="inline-block bg-[--color-ink] text-white px-10 py-4 text-lg font-semibold border-[3px] border-[--color-ink] shadow-[--shadow-md] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[--shadow-lg] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-100"
            >
              Start Chatting →
            </Link>
            <Link
              to="/debate"
              className="inline-block bg-white text-[--color-ink] px-10 py-4 text-lg font-semibold border-[3px] border-[--color-ink] shadow-[--shadow-md] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[--shadow-lg] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-100"
            >
              Debate →
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

export default HomePage
