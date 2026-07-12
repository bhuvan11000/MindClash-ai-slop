import { Link } from 'react-router-dom'

function Header({ fullWidth }) {
  return (
    <header className="sticky top-0 z-50 h-16 bg-black/20 backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)] flex items-center px-6">
      <div className={`w-full mx-auto flex items-center justify-between ${fullWidth ? '' : 'max-w-[1200px]'}`}>
        <Link to="/" className="font-heading font-bold text-xl text-white">
          MindClash
        </Link>
        <Link
          to="/chat"
          className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-2 rounded-full text-sm font-medium hover:scale-105 transition-all duration-300"
        >
          Start Chatting
        </Link>
      </div>
    </header>
  )
}

export default Header
