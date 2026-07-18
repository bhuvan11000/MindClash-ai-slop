import { useState, useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'

const TYPING_TEXTS = {
  socrates: "Socrates is formulating a question...",
  shakespeare: "Shakespeare is composing a verse...",
  ramsay: "Gordon is judging your life choices...",
  elon: "Elon is calculating from first principles...",
  intern: "The intern is typing REALLY fast...",
  butcher: "Butcher is thinking of something diabolical...",
  trump: "Trump is crafting the best response ever...",
  bangalore: "Bangalore Bro is stuck in Silk Board traffic...",
  luffy: "Luffy is thinking (this might take a while)...",
  karen: "Karen is asking for the manager...",
}

const CONVERSATION_STARTERS = {
  socrates: ["What is the meaning of justice?", "Question my beliefs", "Teach me wisdom"],
  shakespeare: ["Write me a sonnet", "What inspired Hamlet?", "Insult me poetically"],
  ramsay: ["Rate my cooking skills", "What's the worst dish ever?", "Teach me a recipe"],
  elon: ["How do we get to Mars?", "What's the future of AI?", "Roast my startup idea"],
  intern: ["Tell me about your first day", "What's your LinkedIn strategy?", "How's the coffee here?"],
  butcher: ["What do you think of superheroes?", "Tell me about Homelander", "Got any life advice?"],
  trump: ["Make my life great again", "What's your best deal?", "Rate my business idea"],
  bangalore: ["How's the traffic today?", "Best filter coffee spot?", "Tell me about IT life"],
  luffy: ["Who's the strongest pirate?", "Tell me about your crew", "What's your favorite food?"],
  karen: ["I have a complaint", "Can I see the manager?", "Rate this customer service"],
}

function ChatInterface({ character }) {
  const [messages, setMessages] = useState({})
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const sessionStartRef = useRef(null)
  const inputWrapperRef = useRef(null)

  const currentMessages = character ? messages[character.id] || [] : []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentMessages, isLoading])

  useEffect(() => {
    if (character) {
      sessionStartRef.current = messages[character.id]?.length || 0
    }
  }, [character?.id])

  const sendMessage = async (retryMessages) => {
    if (!character) return

    const msgs = retryMessages || currentMessages
    const lastUserMsg = msgs[msgs.length - 1]
    if (!lastUserMsg || lastUserMsg.role !== 'user') return

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterId: character.id,
          messages: msgs,
        }),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Request failed')
      }

      const data = await res.json()
      const reply = { role: 'model', content: data.reply }

      setMessages((prev) => ({
        ...prev,
        [character.id]: [...(prev[character.id] || []), reply],
      }))
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (starter) => {
    if (!character || isLoading) return
    const text = starter || inputValue.trim()
    if (!text) return

    const userMessage = { role: 'user', content: text }
    const updatedMessages = [...currentMessages, userMessage]

    setMessages((prev) => ({
      ...prev,
      [character.id]: updatedMessages,
    }))
    setInputValue('')

    sendMessage(updatedMessages)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleInputFocus = () => {
    const el = inputWrapperRef.current
    if (!el) return
    el.style.boxShadow = `3px 3px 0 ${character.theme.accentColor}`
  }

  const handleInputBlur = () => {
    const el = inputWrapperRef.current
    if (!el) return
    el.style.boxShadow = '3px 3px 0 var(--color-ink)'
  }

  const starters = character ? CONVERSATION_STARTERS[character.id] || [] : []

  const groupedMessages = currentMessages.reduce((acc, msg, i) => {
    const prevRole = i > 0 ? currentMessages[i - 1].role : null
    const isGrouped = msg.role === prevRole
    acc.push({ ...msg, showAvatar: !isGrouped, isGrouped })
    return acc
  }, [])

  if (!character) {
    return (
      <div className="flex-1 h-full flex flex-col overflow-hidden bg-white border-[3px] border-[--color-ink] shadow-[--shadow-sm]">
        <div className="flex-1 flex items-center justify-center">
          <p className="font-mono text-xs uppercase tracking-wider text-[--color-ink-muted]">Select a character to start chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden bg-white border-[3px] border-[--color-ink] shadow-[--shadow-sm]">
      <div className="flex-shrink-0 bg-white border-b-[3px] border-[--color-ink]">
        <div className="flex items-center px-6 py-4 gap-4">
          <div
            className="w-14 h-14 flex items-center justify-center flex-shrink-0 border-[3px] border-[--color-ink] shadow-[--shadow-sm]"
            style={{
              background: character.theme.cardColor,
              boxShadow: `3px 3px 0 var(--color-ink)`,
            }}
          >
            <span className="text-white text-lg font-bold">{character.avatarInitials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5">
              <p className="font-heading text-xl text-[--color-ink]">{character.name}</p>
              <span
                className="font-mono text-[9px] uppercase tracking-wider px-2 py-1 border-[2px] border-[--color-ink]"
                style={{
                  background: character.theme.accentColorMuted,
                  color: character.theme.accentColor,
                  borderColor: character.theme.accentColor,
                }}
              >
                {character.category}
              </span>
              <div className="w-3 h-3 animate-pulse-dot" style={{ background: 'var(--color-success)' }} />
            </div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-[--color-ink-muted] mt-0.5 truncate">{character.tagline}</p>
          </div>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto p-8 flex flex-col relative noise-overlay"
        style={{
          background: `color-mix(in srgb, ${character.theme.cardColor} 15%, #ffffff)`,
        }}
      >
        {currentMessages.length === 0 && !error ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div
              className="w-20 h-20 flex items-center justify-center border-[3px] border-[--color-ink] shadow-[--shadow-sm]"
              style={{
                background: character.theme.cardColor,
                boxShadow: `5px 5px 0 var(--color-ink)`,
              }}
            >
              <span className="text-white text-2xl font-bold">{character.avatarInitials}</span>
            </div>
            <p className="font-mono text-xs uppercase tracking-wider text-[--color-ink-muted] mt-5 max-w-sm text-center">
              "{character.tagline}"
            </p>
            {starters.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {starters.map((starter) => (
                  <button
                    key={starter}
                    onClick={() => handleSubmit(starter)}
                    className="font-mono text-[10px] uppercase tracking-wider px-4 py-2 bg-white border-[3px] border-[--color-ink] text-[--color-ink-muted] shadow-[--shadow-sm] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[--shadow-md] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-100 cursor-pointer"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col">
            {groupedMessages.map((msg, i) => (
              <div key={i} style={i > 0 ? { marginTop: msg.isGrouped ? '4px' : '16px' } : undefined}>
                <MessageBubble
                  message={msg}
                  character={character}
                  isNew={i >= (sessionStartRef.current || 0)}
                  showAvatar={msg.showAvatar}
                />
              </div>
            ))}
            {error && (
              <div className="self-center max-w-md w-full bg-[#FF3B30]/10 border-[3px] border-[#FF3B30] px-4 py-3 text-center mt-4">
                <p className="font-mono text-xs uppercase tracking-wider text-[#FF3B30]">Something went wrong. Please try again.</p>
                <button
                  onClick={() => sendMessage()}
                  className="font-mono text-[10px] uppercase tracking-wider text-[#FF3B30] underline cursor-pointer mt-1"
                >
                  Retry
                </button>
              </div>
            )}
            {isLoading && (
              <div className="self-start inline-flex bg-white border-[3px] border-[--color-ink] shadow-[--shadow-sm] px-4 py-2 items-center gap-2.5 mt-2">
                <div
                  className="w-7 h-7 flex items-center justify-center flex-shrink-0 border-[2px] border-[--color-ink]"
                  style={{ background: character.theme.cardColor }}
                >
                  <span className="text-white text-[11px] font-bold">{character.avatarInitials}</span>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[--color-ink-muted]">
                  {TYPING_TEXTS[character.id] || `${character.name} is typing...`}
                </p>
                <span className="flex gap-[3px] items-center">
                  <span className="w-2 h-2 animate-bounce-dot" style={{ background: character.theme.accentColor, animationDelay: '0s' }} />
                  <span className="w-2 h-2 animate-bounce-dot" style={{ background: character.theme.accentColor, animationDelay: '0.15s' }} />
                  <span className="w-2 h-2 animate-bounce-dot" style={{ background: character.theme.accentColor, animationDelay: '0.3s' }} />
                </span>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-shrink-0 bg-white border-t-[3px] border-[--color-ink] p-4 px-6">
        <div
          ref={inputWrapperRef}
          className="flex items-center gap-3 bg-white border-[3px] border-[--color-ink] pl-5 pr-2 py-3 transition-all duration-100"
          style={{ boxShadow: '3px 3px 0 var(--color-ink)' }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={`Message ${character.name}...`}
            className="flex-1 bg-transparent border-none outline-none text-[--color-ink] text-sm placeholder-[--color-ink-muted]"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSubmit()}
            disabled={isLoading || !inputValue.trim()}
            className="w-10 h-10 flex items-center justify-center text-white text-lg flex-shrink-0 border-[3px] border-[--color-ink] shadow-[--shadow-sm] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[--shadow-md] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-100 disabled:opacity-30 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[--shadow-sm]"
            style={{ background: character.theme.accentColor }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
