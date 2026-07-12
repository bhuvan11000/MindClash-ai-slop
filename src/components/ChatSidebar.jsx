function ChatSidebar({ characters, selectedId, onSelect }) {
  return (
    <aside className="w-[280px] flex-shrink-0 h-full bg-[#0f0f14] border-r border-[rgba(255,255,255,0.06)] overflow-y-auto">
      {characters.map((character) => {
        const isSelected = character.id === selectedId
        return (
          <div
            key={character.id}
            className={`h-16 px-4 flex items-center gap-3 cursor-pointer transition-all duration-200 ${
              isSelected
                ? 'border-l-3'
                : 'hover:bg-white/[0.04]'
            }`}
            style={
              isSelected
                ? {
                    background: character.theme.accentColorMuted,
                    borderLeft: `3px solid ${character.theme.accentColor}`,
                  }
                : undefined
            }
            onClick={() => onSelect(character.id)}
          >
            <div
              className="w-10 h-10 rounded-[10px] flex-shrink-0 flex items-center justify-center"
              style={{ background: character.theme.cardGradient }}
            >
              <span className="text-white text-[13px] font-bold">{character.avatarInitials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#f0f0f2] truncate">{character.name}</p>
              <p className="text-xs text-[#606070] truncate">{character.tagline}</p>
            </div>
          </div>
        )
      })}
    </aside>
  )
}

export default ChatSidebar
