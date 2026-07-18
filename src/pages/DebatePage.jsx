import { useState, useRef, useCallback, useEffect } from 'react'
import Header from '../components/Header'
import DebateInterface from '../components/DebateInterface'
import characters from '../data/characters.json'

function DebatePage() {
  const [leftCharacter, setLeftCharacter] = useState(null)
  const [rightCharacter, setRightCharacter] = useState(null)
  const [dragSide, setDragSide] = useState(null)
  const rowRef = useRef(null)
  const dragIdRef = useRef(null)

  const handleDragStart = useCallback((e, characterId) => {
    e.dataTransfer.setData('text/plain', characterId)
    e.dataTransfer.effectAllowed = 'copy'
    dragIdRef.current = characterId
  }, [])

  const handleDropLeft = useCallback((id) => {
    const char = characters.find(c => c.id === id)
    if (char && char.id !== rightCharacter?.id) setLeftCharacter(char)
  }, [rightCharacter])

  const handleDropRight = useCallback((id) => {
    const char = characters.find(c => c.id === id)
    if (char && char.id !== leftCharacter?.id) setRightCharacter(char)
  }, [leftCharacter])

  useEffect(() => {
    const el = rowRef.current
    if (!el) return

    const getSidebarWidths = () => {
      const leftSidebar = el.querySelector('aside:first-child')
      const rightSidebar = el.querySelector('aside:last-child')
      return {
        left: leftSidebar ? leftSidebar.getBoundingClientRect().width : 200,
        right: rightSidebar ? rightSidebar.getBoundingClientRect().width : 200
      }
    }

    const handleDocDragStart = (e) => {
      const charEl = e.target.closest?.('[data-char-id]')
      if (charEl) {
        dragIdRef.current = charEl.getAttribute('data-char-id')
      }
    }

    const handleDragOver = (e) => {
      const id = dragIdRef.current || e.dataTransfer.types.includes('text/plain')
      if (!id) return
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
      const rect = el.getBoundingClientRect()
      const sidebars = getSidebarWidths()
      const localX = e.clientX - rect.left
      if (localX < sidebars.left || localX > rect.width - sidebars.right) {
        setDragSide(null)
      } else {
        const midX = rect.left + rect.width / 2
        setDragSide(e.clientX < midX ? 'left' : 'right')
      }
    }

    const handleDragLeave = (e) => {
      if (!el.contains(e.relatedTarget)) {
        setDragSide(null)
      }
    }

    const handleDragEnd = () => {
      setDragSide(null)
      dragIdRef.current = null
    }

    const handleDrop = (e) => {
      e.preventDefault()
      setDragSide(null)
      const id = dragIdRef.current || e.dataTransfer.getData('text/plain')
      dragIdRef.current = null
      if (!id) return
      const rect = el.getBoundingClientRect()
      const sidebars = getSidebarWidths()
      const localX = e.clientX - rect.left
      if (localX < sidebars.left || localX > rect.width - sidebars.right) return
      const midX = rect.left + rect.width / 2
      if (e.clientX < midX) {
        handleDropLeft(id)
      } else {
        handleDropRight(id)
      }
    }

    document.addEventListener('dragstart', handleDocDragStart)
    document.addEventListener('dragend', handleDragEnd)
    el.addEventListener('dragover', handleDragOver)
    el.addEventListener('dragleave', handleDragLeave)
    el.addEventListener('drop', handleDrop)

    return () => {
      document.removeEventListener('dragstart', handleDocDragStart)
      document.removeEventListener('dragend', handleDragEnd)
      el.removeEventListener('dragover', handleDragOver)
      el.removeEventListener('dragleave', handleDragLeave)
      el.removeEventListener('drop', handleDrop)
    }
  }, [handleDropLeft, handleDropRight])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div ref={rowRef} className={'flex h-[calc(100vh-56px)] ' + (dragSide ? 'bg-black/[0.02]' : '')}>
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
