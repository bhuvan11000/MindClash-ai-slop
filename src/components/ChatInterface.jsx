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

function ChatInterface({ character }) {
  const [messages, setMessages] = useState({})
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const prevGradientRef = useRef(null)
  const [oldGradient, setOldGradient] = useState(null)

  const currentMessages = character ? messages[character.id] || [] : []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentMessages, isLoading])

  useEffect(() => {
    if (!character) return
    const currentGradient = character.theme.gradientCSS
    if (prevGradientRef.current && prevGradientRef.current !== currentGradient) {
      setOldGradient(prevGradientRef.current)
      const t = setTimeout(() => setOldGradient(null), 500)
      prevGradientRef.current = currentGradient
      return () => clearTimeout(t)
    }
    prevGradientRef.current = currentGradient
  }, [character])

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

  const handleSubmit = () => {
    if (!character || !inputValue.trim() || isLoading) return

    const userMessage = { role: 'user', content: inputValue.trim() }
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

  const handleInputFocus = (e) => {
    const wrapper = e.currentTarget.parentElement
    if (wrapper) {
      wrapper.style.borderColor = character.theme.accentColor
      wrapper.style.boxShadow = `0 0 0 3px ${character.theme.accentColorMuted}`
    }
  }

  const handleInputBlur = (e) => {
    const wrapper = e.currentTarget.parentElement
    if (wrapper) {
      wrapper.style.borderColor = 'rgba(255,255,255,0.08)'
      wrapper.style.boxShadow = 'none'
    }
  }

  if (!character) {
    return (
      <div className="flex-1 h-full flex flex-col bg-[#08080c]">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[#606070] text-sm">Select a character to start chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 h-full flex flex-col relative overflow-hidden">
      {oldGradient && (
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ background: oldGradient, opacity: oldGradient ? 1 : 0 }}
        />
      )}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ background: character.theme.gradientCSS }}
      />
      <div className="relative z-10 flex flex-col h-full">
        <div className="h-16 flex-shrink-0 bg-black/40 backdrop-blur-xl border-b border-white/[0.06] flex items-center px-5 gap-3">
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
            style={{ background: character.theme.cardGradient }}
          >
            <span className="text-white text-sm font-bold">{character.avatarInitials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-heading font-semibold text-base text-white">{character.name}</p>
            <p
              className="text-[11px] uppercase tracking-wider"
              style={{ color: character.theme.accentColor }}
            >
              {character.category} · {character.subcategory}
            </p>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot" />
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
          {currentMessages.length === 0 && !error ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ background: character.theme.cardGradient }}
              >
                <span className="text-white text-2xl font-bold">{character.avatarInitials}</span>
              </div>
              <p className="text-[#a0a0b0] text-base mt-4">
                Start a conversation with {character.name}
              </p>
              <p className="text-[#606070] text-[13px] mt-1">
                Say hello, ask a question, or just vibe.
              </p>
            </div>
          ) : (
            <>
              {currentMessages.map((msg, i) => (
                <MessageBubble key={i} message={msg} character={character} />
              ))}
              {error && (
                <div className="self-center max-w-md w-full bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 text-center">
                  <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
                  <button
                    onClick={() => sendMessage()}
                    className="text-red-400 underline text-xs cursor-pointer mt-1 hover:text-red-300 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}
              {isLoading && (
                <div className="flex gap-2.5 items-center">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: character.theme.cardGradient }}
                  >
                    <span className="text-white text-[11px] font-bold">{character.avatarInitials}</span>
                  </div>
                  <p className="italic text-[13px] text-[#606070]">
                    {TYPING_TEXTS[character.id] || `${character.name} is typing...`}
                  </p>
                  <span className="flex gap-[3px] items-center">
                    <span className="w-1 h-1 rounded-full bg-[#606070] animate-bounce-dot" style={{ animationDelay: '0s' }} />
                    <span className="w-1 h-1 rounded-full bg-[#606070] animate-bounce-dot" style={{ animationDelay: '0.15s' }} />
                    <span className="w-1 h-1 rounded-full bg-[#606070] animate-bounce-dot" style={{ animationDelay: '0.3s' }} />
                  </span>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex-shrink-0 bg-black/50 backdrop-blur-xl border-t border-white/[0.06] p-3 px-4">
          <div className="flex items-center gap-3 bg-white/[0.06] border border-white/[0.08] rounded-full pl-5 pr-2 py-2 transition-all duration-200">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder={`Message ${character.name}...`}
              className="flex-1 bg-transparent border-none outline-none text-[#f0f0f2] text-sm placeholder-[#606070]"
              disabled={isLoading}
            />
            <button
              onClick={handleSubmit}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 12px ${character.theme.accentColor}66`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none'
              }}
              disabled={isLoading || !inputValue.trim()}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-lg flex-shrink-0 hover:scale-105 transition-all duration-150 disabled:opacity-50 disabled:hover:scale-100"
              style={{ background: character.theme.accentColor }}
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
