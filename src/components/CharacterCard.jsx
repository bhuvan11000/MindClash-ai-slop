import { useNavigate } from 'react-router-dom'

function CharacterCard({ character }) {
  const navigate = useNavigate()

  return (
    <div
      className="relative h-[200px] rounded-[20px] overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1"
      style={{ boxShadow: 'none' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 8px 40px ${character.theme.accentColor}4D`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
      }}
      onClick={() => navigate(`/chat?character=${character.id}`)}
    >
      <div
        className="absolute inset-0"
        style={{ background: character.theme.cardGradient }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 70%)',
        }}
      />
      <div className="absolute top-4 right-4">
        <div className="w-12 h-12 rounded-xl bg-black/40 backdrop-blur-sm border border-white/15 flex items-center justify-center">
          <span className="text-white font-bold text-sm">{character.avatarInitials}</span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 p-5">
        <h3 className="font-heading font-bold text-lg text-white">{character.name}</h3>
        <p className="text-[11px] uppercase tracking-wider text-white/70 mt-0.5">
          {character.category} · {character.subcategory}
        </p>
        <p className="text-[13px] italic text-white/60 mt-1 leading-tight">{character.tagline}</p>
      </div>
    </div>
  )
}

export default CharacterCard
