import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import ChatSidebar from '../components/ChatSidebar'
import ChatInterface from '../components/ChatInterface'
import characters from '../data/characters.json'

function ChatPage() {
  const [searchParams] = useSearchParams()
  const initialId = searchParams.get('character') || null
  const [selectedCharacterId, setSelectedCharacterId] = useState(initialId)
  const selectedCharacter = characters.find((c) => c.id === selectedCharacterId) || null

  return (
    <div className="min-h-screen bg-[#08080c] flex flex-col">
      <Header />
      <div className="flex h-[calc(100vh-64px)]">
        <ChatSidebar
          characters={characters}
          selectedId={selectedCharacterId}
          onSelect={setSelectedCharacterId}
        />
        <ChatInterface character={selectedCharacter} />
      </div>
    </div>
  )
}

export default ChatPage
