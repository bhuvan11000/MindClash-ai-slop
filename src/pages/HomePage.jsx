import { Link } from 'react-router-dom'
import CharacterCard from '../components/CharacterCard'
import PixelSnow from '../components/PixelSnow'
import characters from '../data/characters.json'

function HomePage() {
  return (
    <div className="relative min-h-screen bg-white">
      <div className="sticky top-3 z-30 px-5">
        <div className="max-w-[1200px] mx-auto bg-white border-[3px] border-[--color-ink] shadow-[--shadow-md] h-16 flex items-center px-5">
          <div className="w-full flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src="/avatars/luffy.webp" alt="MindClash" className="w-8 h-8" />
              <span className="font-heading text-xl text-[--color-ink]">MindClash</span>
            </Link>
            <Link
              to="/chat"
              className="bg-[--color-ink] text-white px-5 py-1.5 text-sm font-semibold border-[3px] border-[--color-ink] shadow-[--shadow-sm] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[--shadow-md] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-100"
            >
              Start Chatting
            </Link>
          </div>
        </div>
      </div>

      <section className="relative z-20 pt-10 pb-6 text-center">
        <h1 className="font-heading text-8xl text-[--color-ink] leading-none" style={{ textShadow: '2px 2px 0 var(--color-ink)' }}>
          MindClash
        </h1>
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
          <Link
            to="/chat"
            className="inline-block bg-[--color-ink] text-white px-10 py-4 text-lg font-semibold border-[3px] border-[--color-ink] shadow-[--shadow-md] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[--shadow-lg] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-100"
          >
            Start Chatting →
          </Link>
        </section>
      </main>
    </div>
  )
}

export default HomePage
