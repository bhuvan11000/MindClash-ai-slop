import { Link } from 'react-router-dom'
import Header from '../components/Header'
import CharacterCard from '../components/CharacterCard'
import characters from '../data/characters.json'

function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#08080c]">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-[hsla(260,70%,40%,0.12)] blur-[120px] animate-blob-1" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-[hsla(200,70%,35%,0.08)] blur-[120px] animate-blob-2" />
      </div>

      <Header />

      <main className="max-w-[1200px] mx-auto px-6">
        <section className="pt-20 pb-12 text-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-purple-400/20 bg-purple-400/10 text-[12px] uppercase tracking-wider text-purple-400 mb-8">
            Powered by Gemini
          </div>

          <h1 className="font-heading font-extrabold text-6xl text-white bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">
            MindClash
          </h1>

          <p className="text-lg text-[#a0a0b0] mt-4 max-w-md mx-auto">
            Pick a personality. Start a conversation. Regret nothing.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
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
            className="inline-block bg-gradient-to-r from-purple-500 to-purple-700 text-white px-10 py-4 rounded-full text-lg font-medium hover:scale-105 transition-all duration-300"
          >
            Start Chatting →
          </Link>
        </section>
      </main>

      <footer className="text-center text-[#606070] text-[13px] pb-12">
        Built for fun. Powered by Gemini. No managers were harmed.
      </footer>
    </div>
  )
}

export default HomePage
