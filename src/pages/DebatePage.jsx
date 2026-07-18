import { useState } from 'react'
import Header from '../components/Header'
import DebateInterface from '../components/DebateInterface'
import characters from '../data/characters.json'

function DebatePage() {
  const [leftCharacter, setLeftCharacter] = useState(null)
  const [rightCharacter, setRightCharacter] = useState(null)

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex h-[calc(100vh-56px)]">
        <aside className="w-[200px] flex-shrink-0 h-full bg-white border-r-[3px] border-[--color-ink] overflow-y-auto">
          <div className="border-b-[2px] border-[--color-ink] px-3 py-2.5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[--color-ink-muted]">Select a character</p>
          </div>
          {characters.map((character) => (
            <div
              key={character.id}
              onClick={() => {
                if (character.id !== rightCharacter?.id) setLeftCharacter(character)
              }}
              className={'border-b-[2px] border-[--color-ink] cursor-pointer hover:bg-black/[0.02] transition-colors duration-100 ' + (leftCharacter?.id === character.id ? 'bg-black/[0.04]' : '')}
            >
              <div className="flex items-center gap-3 py-2.5 px-3">
                <div className="w-8 h-8 flex-shrink-0 border-[2px] border-[--color-ink] overflow-hidden"
                  style={{ background: character.theme.cardColor }}
                >
                  <img src={"/avatars/" + character.id + ".png"} alt={character.name} className="w-full h-full object-cover select-none" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-[--color-ink] font-semibold truncate">{character.name}</p>
                </div>
              </div>
            </div>
          ))}
        </aside>

        <DebateInterface
          leftCharacter={leftCharacter}
          rightCharacter={rightCharacter}
          onClearLeft={() => setLeftCharacter(null)}
          onClearRight={() => setRightCharacter(null)}
        />

        <aside className="w-[200px] flex-shrink-0 h-full bg-white border-l-[3px] border-[--color-ink] overflow-y-auto">
          <div className="border-b-[2px] border-[--color-ink] px-3 py-2.5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[--color-ink-muted]">Select a character</p>
          </div>
          {characters.map((character) => (
            <div
              key={character.id}
              onClick={() => {
                if (character.id !== leftCharacter?.id) setRightCharacter(character)
              }}
              className={'border-b-[2px] border-[--color-ink] cursor-pointer hover:bg-black/[0.02] transition-colors duration-100 ' + (rightCharacter?.id === character.id ? 'bg-black/[0.04]' : '')}
            >
              <div className="flex items-center gap-3 py-2.5 px-3">
                <div className="w-8 h-8 flex-shrink-0 border-[2px] border-[--color-ink] overflow-hidden"
                  style={{ background: character.theme.cardColor }}
                >
                  <img src={"/avatars/" + character.id + ".png"} alt={character.name} className="w-full h-full object-cover select-none" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-[--color-ink] font-semibold truncate">{character.name}</p>
                </div>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  )
}

export default DebatePage
