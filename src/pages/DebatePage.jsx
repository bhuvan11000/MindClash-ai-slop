import { useState, useCallback } from 'react'
import Header from '../components/Header'
import DebateInterface from '../components/DebateInterface'
import characters from '../data/characters.json'

function DebatePage() {
  const [leftCharacter, setLeftCharacter] = useState(null)
  const [rightCharacter, setRightCharacter] = useState(null)
  const [dragSide, setDragSide] = useState(null)

  const handleDragStart = useCallback((e, characterId) => {
    e.dataTransfer.setData('text/plain', characterId)
    e.dataTransfer.effectAllowed = 'copy'
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  const handleDropLeft = useCallback((e) => {
    e.preventDefault()
    setDragSide(null)
    const id = e.dataTransfer.getData('text/plain')
    if (!id) return
    const char = characters.find(c => c.id === id)
    if (char && char.id !== rightCharacter?.id) setLeftCharacter(char)
  }, [rightCharacter])

  const handleDropRight = useCallback((e) => {
    e.preventDefault()
    setDragSide(null)
    const id = e.dataTransfer.getData('text/plain')
    if (!id) return
    const char = characters.find(c => c.id === id)
    if (char && char.id !== leftCharacter?.id) setRightCharacter(char)
  }, [leftCharacter])

  const handleDragEnterLeft = useCallback((e) => {
    e.preventDefault()
    setDragSide('left')
  }, [])

  const handleDragEnterRight = useCallback((e) => {
    e.preventDefault()
    setDragSide('right')
  }, [])

  const handleDragLeave = useCallback((e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragSide(null)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className={'flex h-[calc(100vh-56px)] ' + (dragSide ? 'bg-black/[0.02]' : '')}>
        <aside className="w-[200px] flex-shrink-0 h-full bg-white border-r-[3px] border-[--color-ink] overflow-y-auto">
          <div className="border-b-[2px] border-[--color-ink] px-3 py-2.5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[--color-ink-muted]">Drag a character</p>
          </div>
          {characters.map((character) => (
            <div
              key={character.id}
              draggable
              data-char-id={character.id}
              onDragStart={(e) => handleDragStart(e, character.id)}
              className="border-b-[2px] border-[--color-ink] cursor-grab active:cursor-grabbing hover:bg-black/[0.02] transition-colors duration-100"
            >
              <div className="flex items-center gap-3 py-2.5 px-3">
                <div className="w-8 h-8 flex-shrink-0 border-[2px] border-[--color-ink] overflow-hidden"
                  style={{ background: character.theme.cardColor }}
                >
                  <img src={"/avatars/" + character.id + ".png"} alt={character.name} draggable="false" className="w-full h-full object-cover select-none" />
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
          dragSide={dragSide}
          onClearLeft={() => setLeftCharacter(null)}
          onClearRight={() => setRightCharacter(null)}
          onDragOver={handleDragOver}
          onDropLeft={handleDropLeft}
          onDropRight={handleDropRight}
          onDragEnterLeft={handleDragEnterLeft}
          onDragEnterRight={handleDragEnterRight}
          onDragLeave={handleDragLeave}
        />

        <aside className="w-[200px] flex-shrink-0 h-full bg-white border-l-[3px] border-[--color-ink] overflow-y-auto">
          <div className="border-b-[2px] border-[--color-ink] px-3 py-2.5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[--color-ink-muted]">Drag a character</p>
          </div>
          {characters.map((character) => (
            <div
              key={character.id}
              draggable
              data-char-id={character.id}
              onDragStart={(e) => handleDragStart(e, character.id)}
              className="border-b-[2px] border-[--color-ink] cursor-grab active:cursor-grabbing hover:bg-black/[0.02] transition-colors duration-100"
            >
              <div className="flex items-center gap-3 py-2.5 px-3">
                <div className="w-8 h-8 flex-shrink-0 border-[2px] border-[--color-ink] overflow-hidden"
                  style={{ background: character.theme.cardColor }}
                >
                  <img src={"/avatars/" + character.id + ".png"} alt={character.name} draggable="false" className="w-full h-full object-cover select-none" />
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
