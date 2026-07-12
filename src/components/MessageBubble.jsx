function MessageBubble({ message, character, isNew, showAvatar = true }) {
  const isUser = message.role === 'user'

  return (
    <div
      className={`flex gap-2.5 max-w-[70%] ${isNew ? 'animate-message-in' : ''} ${isUser ? 'flex-row-reverse self-end' : 'flex-row self-start'}`}
    >
      {showAvatar ? (
        isUser ? (
          <div className="w-7 h-7 rounded-lg bg-white/[0.08] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[11px] font-semibold">U</span>
          </div>
        ) : (
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: character.theme.accentColor }}
          >
            <span className="text-white text-[11px] font-bold">{character.avatarInitials}</span>
          </div>
        )
      ) : (
        <div className="w-7 flex-shrink-0" />
      )}
      <div className="flex flex-col">
        <div
          className={`px-5 py-3.5 text-sm text-[#f0f0f2] leading-relaxed shadow-md shadow-black/20 ${
            isUser
              ? 'bg-[#1a1a22] border border-white/[0.06] rounded-[16px_2px_16px_16px]'
              : 'bg-[#141418] border border-white/[0.05] rounded-[2px_16px_16px_16px]'
          }`}
          style={
            !isUser
              ? { borderLeft: `2px solid ${character.theme.accentColor}4d` }
              : undefined
          }
        >
          {message.content}
        </div>
        <p className="text-[10px] text-[#404050] mt-1">just now</p>
      </div>
    </div>
  )
}

export default MessageBubble
