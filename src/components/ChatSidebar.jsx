function ChatSidebar({ characters, selectedId, onSelect }) {
  return (
    <aside className="w-[280px] flex-shrink-0 h-full bg-white border-r-[3px] border-[--color-ink] overflow-hidden flex flex-col">
      <div className="px-4 pt-4 pb-2 border-b-[2px] border-[--color-ink]">
        <p className="font-mono text-xs uppercase tracking-wider text-[--color-ink-muted]">Characters</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {characters.map((character) => {
          const isSelected = character.id === selectedId
          return (
            <div
              key={character.id}
              className={`border-b-[2px] border-[--color-ink] cursor-pointer transition-all duration-100 ${
                isSelected
                  ? ''
                  : 'hover:bg-black/[0.02]'
              }`}
              style={
                isSelected
                  ? {
                      background: character.theme.accentColorMuted,
                      borderLeft: `4px solid var(--color-ink)`,
                    }
                  : {}
              }
              onClick={() => onSelect(character.id)}
            >
              <div className="flex items-center gap-3 py-3 px-4">
                <div className="w-10 h-10 flex-shrink-0 border-[2px] border-[--color-ink] overflow-hidden">
                  <img src={`/avatars/${character.id}.webp`} alt={character.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs uppercase tracking-wider text-[--color-ink] font-semibold truncate">{character.name}</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[--color-ink-muted] truncate">{character.tagline}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}

export default ChatSidebar
