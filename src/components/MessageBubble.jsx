function MessageBubble({ message, character, isNew, showAvatar = true }) {
  const isUser = message.role === 'user'

  return (
    <div
      className={`flex gap-2.5 max-w-[70%] ${isNew ? 'animate-message-in' : ''} ${isUser ? 'flex-row-reverse ml-auto' : 'flex-row mr-auto'}`}
    >
      {showAvatar ? (
        isUser ? (
          <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 border-[2px] border-[--color-ink] bg-white">
            <span className="font-mono text-[9px] text-[--color-ink] font-semibold">U</span>
          </div>
        ) : (
          <div className="w-7 h-7 flex-shrink-0 border-[2px] border-[--color-ink] overflow-hidden" style={{ background: character.theme.cardColor }}>
            <img src={`/avatars/${character.id}.webp`} alt={character.name} className="w-full h-full object-cover" />
          </div>
        )
      ) : (
        <div className="w-7 flex-shrink-0" />
      )}
      <div className="flex flex-col">
        <div
          className={`px-5 py-3.5 text-sm text-[--color-ink] leading-relaxed ${
            isUser
              ? 'bg-white border-[3px] border-[--color-ink] shadow-[--shadow-sm]'
              : ''
          }`}
          style={
            isUser
              ? { borderRadius: '2px 2px 18px 2px' }
              : {
                  borderRadius: '2px 2px 2px 18px',
                  background: `color-mix(in srgb, ${character.theme.accentColor} 6%, #ffffff)`,
                  border: `3px solid ${character.theme.accentColor}`,
                  boxShadow: `3px 3px 0 ${character.theme.shadowColor}`,
                }
          }
        >
          {message.content}
        </div>
        <p className="font-mono text-[9px] uppercase tracking-wider text-[--color-ink-muted] mt-1">just now</p>
      </div>
    </div>
  )
}

export default MessageBubble
