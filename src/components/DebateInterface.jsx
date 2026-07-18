import { useState, useRef, useCallback, useEffect } from 'react'

const DEBATE_ROUNDS = 3

function buildMessages(topic, debateHistory, speakingChar, otherChar) {
  const msgs = [
    { role: 'user', content: 'Debate topic: ' + topic + '. You are debating against ' + otherChar.name + '. Respond in character.' }
  ]
  for (const entry of debateHistory) {
    if (entry.characterId === speakingChar.id) {
      msgs.push({ role: 'assistant', content: entry.content })
    } else {
      msgs.push({ role: 'user', content: otherChar.name + ' says: ' + entry.content })
    }
  }
  return msgs
}

function DebateInterface({ leftCharacter, rightCharacter, dragSide, onClearLeft, onClearRight }) {
  const [topic, setTopic] = useState('')
  const [debateHistory, setDebateHistory] = useState([])
  const [isDebating, setIsDebating] = useState(false)
  const [leftSpeaking, setLeftSpeaking] = useState(false)
  const [rightSpeaking, setRightSpeaking] = useState(false)
  const abortRef = useRef(false)

  const startDebate = useCallback(async () => {
    if (!leftCharacter || !rightCharacter || !topic.trim()) return
    abortRef.current = false
    setIsDebating(true)
    setDebateHistory([])

    const history = []

    for (let round = 0; round < DEBATE_ROUNDS; round++) {
      if (abortRef.current) break

      setLeftSpeaking(true)
      setRightSpeaking(false)

      const leftMsgs = buildMessages(topic, history, leftCharacter, rightCharacter)

      try {
        const res = await fetch('/.netlify/functions/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ characterId: leftCharacter.id, messages: leftMsgs })
        })
        const data = await res.json()
        if (abortRef.current) break
        const leftReply = data.reply || '...'
        history.push({ characterId: leftCharacter.id, content: leftReply })
        setDebateHistory([...history])
      } catch {
        break
      }

      if (abortRef.current || round === DEBATE_ROUNDS - 1) {
        setLeftSpeaking(false)
        break
      }

      await new Promise(r => setTimeout(r, 500))

      setLeftSpeaking(false)
      setRightSpeaking(true)

      const rightMsgs = buildMessages(topic, history, rightCharacter, leftCharacter)

      try {
        const res = await fetch('/.netlify/functions/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ characterId: rightCharacter.id, messages: rightMsgs })
        })
        const data = await res.json()
        if (abortRef.current) break
        const rightReply = data.reply || '...'
        history.push({ characterId: rightCharacter.id, content: rightReply })
        setDebateHistory([...history])
      } catch {
        break
      }

      await new Promise(r => setTimeout(r, 500))
    }

    setLeftSpeaking(false)
    setRightSpeaking(false)
    setIsDebating(false)
  }, [leftCharacter, rightCharacter, topic])

  useEffect(() => {
    return () => { abortRef.current = true }
  }, [])

  const leftMessages = debateHistory.filter(e => e.characterId === leftCharacter?.id)
  const rightMessages = debateHistory.filter(e => e.characterId === rightCharacter?.id)

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="flex-1 flex min-h-0">
        <div
          className={'flex-1 flex flex-col border-r-[3px] border-[--color-ink] overflow-hidden transition-colors duration-150 ' + (dragSide === 'left' ? 'bg-black/[0.04]' : '')}
          style={leftCharacter ? { background: 'color-mix(in srgb, ' + leftCharacter.theme.cardColor + ' 8%, #ffffff)' } : {}}
        >
          {leftCharacter ? (
            <>
              <div className="flex-shrink-0 bg-white border-b-[3px] border-[--color-ink] px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 flex-shrink-0 border-[2px] border-[--color-ink] overflow-hidden"
                  style={{ background: leftCharacter.theme.cardColor }}
                >
                  <img src={"/avatars/" + leftCharacter.id + ".png"} alt={leftCharacter.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-lg text-[--color-ink]">{leftCharacter.name}</p>
                </div>
                <button onClick={onClearLeft} className="font-mono text-[10px] uppercase tracking-wider text-[--color-ink-muted] hover:text-[--color-ink] cursor-pointer">Remove</button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {leftMessages.length === 0 && !leftSpeaking && (
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[--color-ink-muted] text-center mt-8">Waiting for debate...</p>
                )}
                {leftMessages.map((msg, i) => (
                  <div key={i} className="bg-white border-[2px] border-[--color-ink] shadow-[--shadow-sm] px-4 py-3"
                    style={{ borderRadius: '2px 2px 14px 2px' }}
                  >
                    <p className="text-sm text-[--color-ink] leading-relaxed">{msg.content}</p>
                  </div>
                ))}
                {leftSpeaking && (
                  <div className="self-start bg-white border-[2px] border-[--color-ink] shadow-[--shadow-sm] px-4 py-3 flex items-center gap-2"
                    style={{ borderRadius: '2px 2px 14px 2px' }}
                  >
                    <span className="w-2 h-2 bg-[--color-ink] animate-bounce-dot" style={{ animationDelay: '0s' }} />
                    <span className="w-2 h-2 bg-[--color-ink] animate-bounce-dot" style={{ animationDelay: '0.15s' }} />
                    <span className="w-2 h-2 bg-[--color-ink] animate-bounce-dot" style={{ animationDelay: '0.3s' }} />
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-8">
                <div className="w-16 h-16 mx-auto mb-3 border-[3px] border-dashed border-[--color-ink-muted] flex items-center justify-center">
                  <span className="font-mono text-[20px] text-[--color-ink-muted]">?</span>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[--color-ink-muted]">Drop a character here</p>
              </div>
            </div>
          )}
        </div>

        <div
          className={'flex-1 flex flex-col overflow-hidden transition-colors duration-150 ' + (dragSide === 'right' ? 'bg-black/[0.04]' : '')}
          style={rightCharacter ? { background: 'color-mix(in srgb, ' + rightCharacter.theme.cardColor + ' 8%, #ffffff)' } : {}}
        >
          {rightCharacter ? (
            <>
              <div className="flex-shrink-0 bg-white border-b-[3px] border-[--color-ink] px-4 py-3 flex items-center gap-3">
                <button onClick={onClearRight} className="font-mono text-[10px] uppercase tracking-wider text-[--color-ink-muted] hover:text-[--color-ink] cursor-pointer">Remove</button>
                <div className="flex-1 min-w-0 text-right">
                  <p className="font-heading text-lg text-[--color-ink]">{rightCharacter.name}</p>
                </div>
                <div className="w-10 h-10 flex-shrink-0 border-[2px] border-[--color-ink] overflow-hidden"
                  style={{ background: rightCharacter.theme.cardColor }}
                >
                  <img src={"/avatars/" + rightCharacter.id + ".png"} alt={rightCharacter.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 items-end">
                {rightMessages.length === 0 && !rightSpeaking && (
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[--color-ink-muted] text-center mt-8 w-full">Waiting for debate...</p>
                )}
                {rightMessages.map((msg, i) => (
                  <div key={i} className="bg-white border-[2px] border-[--color-ink] shadow-[--shadow-sm] px-4 py-3"
                    style={{ borderRadius: '2px 2px 2px 14px' }}
                  >
                    <p className="text-sm text-[--color-ink] leading-relaxed">{msg.content}</p>
                  </div>
                ))}
                {rightSpeaking && (
                  <div className="self-end bg-white border-[2px] border-[--color-ink] shadow-[--shadow-sm] px-4 py-3 flex items-center gap-2"
                    style={{ borderRadius: '2px 2px 2px 14px' }}
                  >
                    <span className="w-2 h-2 bg-[--color-ink] animate-bounce-dot" style={{ animationDelay: '0s' }} />
                    <span className="w-2 h-2 bg-[--color-ink] animate-bounce-dot" style={{ animationDelay: '0.15s' }} />
                    <span className="w-2 h-2 bg-[--color-ink] animate-bounce-dot" style={{ animationDelay: '0.3s' }} />
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-8">
                <div className="w-16 h-16 mx-auto mb-3 border-[3px] border-dashed border-[--color-ink-muted] flex items-center justify-center">
                  <span className="font-mono text-[20px] text-[--color-ink-muted]">?</span>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[--color-ink-muted]">Drop a character here</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 bg-white border-t-[3px] border-[--color-ink] px-5 py-4">
        {leftCharacter && rightCharacter ? (
          <div className="flex gap-3">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a debate topic..."
              disabled={isDebating}
              className="flex-1 px-4 py-2.5 font-mono text-xs uppercase tracking-wider bg-white border-[3px] border-[--color-ink] text-[--color-ink] placeholder:text-[--color-ink-muted] outline-none focus:shadow-[--shadow-sm] transition-shadow duration-100 disabled:opacity-50"
            />
            <button
              onClick={startDebate}
              disabled={isDebating || !topic.trim()}
              className="bg-[--color-ink] text-white px-6 py-2.5 font-mono text-xs uppercase tracking-wider border-[3px] border-[--color-ink] shadow-[--shadow-sm] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[--shadow-md] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-100 disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[--shadow-sm] cursor-pointer disabled:cursor-not-allowed"
            >
              {isDebating ? 'Debating...' : 'Start Debate'}
            </button>
          </div>
        ) : (
          <p className="font-mono text-[10px] uppercase tracking-wider text-[--color-ink-muted] text-center">
            Drop a character on both sides to start a debate
          </p>
        )}
      </div>
    </div>
  )
}

export default DebateInterface
