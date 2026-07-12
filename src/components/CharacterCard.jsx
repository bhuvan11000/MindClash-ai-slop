import { useNavigate } from 'react-router-dom'
import TiltedCard from './TiltedCard'
import BorderGlow from './BorderGlow'

function hexToHSL(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255
  let g = parseInt(hex.slice(3, 5), 16) / 255
  let b = parseInt(hex.slice(5, 7), 16) / 255
  let max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2
  if (max !== min) {
    let d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)} ${Math.round(l * 100)}`
}

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
      <BorderGlow
        className="h-full"
        edgeSensitivity={20}
        glowColor={hexToHSL(character.theme.accentColor)}
        backgroundColor="transparent"
        borderRadius={20}
        glowRadius={30}
        glowIntensity={1.2}
        coneSpread={20}
        animated={false}
        colors={character.theme.gradientColors}
        fillOpacity={0.3}
        style={{ gridTemplateRows: '1fr' }}
      >
        <div
          className="relative flex-1 w-full rounded-[20px] overflow-hidden cursor-pointer"
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
      </BorderGlow>
    </TiltedCard>
  )
}

export default CharacterCard
