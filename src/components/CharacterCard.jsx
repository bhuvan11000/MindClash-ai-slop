import { useNavigate } from 'react-router-dom'
import TiltedCard from './TiltedCard'

function CharacterCard({ character }) {
  const navigate = useNavigate()

  return (
    <TiltedCard
      containerHeight="210px"
      containerWidth="100%"
      imageHeight="210px"
      imageWidth="100%"
      scaleOnHover={1.02}
      rotateAmplitude={14}
      showMobileWarning={false}
      showTooltip={false}
    >
      <div
        className="relative flex-1 w-full h-full overflow-hidden cursor-pointer border-[3px] border-[--color-ink]"
        style={{
          boxShadow: `5px 5px 0 ${character.theme.shadowColor}`,
        }}
        onClick={() => navigate(`/chat?character=${character.id}`)}
      >
        <div
          className="absolute inset-0"
          style={{ background: character.theme.cardColor }}
        />
        <div className="absolute top-0 left-0 p-5">
          <h3 className="font-heading text-xl text-white">{character.name}</h3>
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/70 mt-0.5">
            {character.category} · {character.subcategory}
          </p>
          <p className="font-mono text-[11px] uppercase tracking-wider text-white/60 mt-1 leading-tight">
            {character.tagline}
          </p>
        </div>
        <div className="absolute bottom-0 right-0 w-24 h-24 animate-fade-in-scale"
          style={{ animationDelay: '0.15s' }}>
          <img
            src={`/avatars/${character.id}.webp`}
            alt={character.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </TiltedCard>
  )
}

export default CharacterCard
