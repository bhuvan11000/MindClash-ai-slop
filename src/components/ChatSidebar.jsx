function ChatSidebar({ characters, selectedId, onSelect }) {
  return (
    <aside className="w-[280px] flex-shrink-0 h-full bg-[#0f0f14] rounded-2xl overflow-hidden shadow-lg shadow-black/20 flex flex-col">
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs uppercase tracking-wider text-[#606070] font-semibold">Characters</p>
      </div>
      <div className="flex-1 overflow-y-auto pb-2">
        {characters.map((character) => {
          const isSelected = character.id === selectedId
          return (
            <div
              key={character.id}
              className={`mx-2 mb-1 py-3 px-3 rounded-xl cursor-pointer transition-all duration-200 ease-out ${
                isSelected
                  ? ''
                  : 'hover:bg-white/[0.04]'
              }`}
              style={
                isSelected
                  ? {
                      background: character.theme.accentColorMuted,
                      boxShadow: `inset 0 0 0 1px ${character.theme.accentColor}33`,
                    }
                  : undefined
              }
              onClick={() => onSelect(character.id)}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                  style={{
                    background: character.theme.accentColor,
                    ...(isSelected ? { boxShadow: `0 0 0 2px #0f0f14, 0 0 0 4px ${character.theme.accentColor}` } : {}),
                  }}
                >
                  <span className="text-white text-[13px] font-bold">{character.avatarInitials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#f0f0f2] truncate">{character.name}</p>
                  <p className="text-xs text-[#505060] truncate">{character.tagline}</p>
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
