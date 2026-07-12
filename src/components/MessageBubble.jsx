function MessageBubble({ message, character, isNew }) {
  const isUser = message.role === 'user'

  return (
    <div
      className={`flex gap-2.5 max-w-[70%] ${isNew ? 'animate-message-in' : ''} ${isUser ? 'flex-row-reverse self-end' : 'flex-row self-start'}`}
    >
      {isUser ? (
        <div className="w-7 h-7 rounded-lg bg-white/[0.08] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-[11px] font-semibold">U</span>
        </div>
      ) : (
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: character.theme.cardGradient }}
        >
          <span className="text-white text-[11px] font-bold">{character.avatarInitials}</span>
        </div>
      )}
      <div
        className={`px-4 py-3 text-sm text-[#f0f0f2] leading-relaxed ${
          isUser
            ? 'bg-white/10 backdrop-blur-sm border border-white/[0.12] rounded-[16px_2px_16px_16px]'
            : 'bg-black/50 backdrop-blur-sm border border-white/[0.08] rounded-[2px_16px_16px_16px]'
        }`}
      >
        {message.content}
      </div>
    </div>
  )
}

export default MessageBubble
