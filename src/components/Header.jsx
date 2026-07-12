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
          className="bg-white text-[#08080c] px-6 py-2 rounded-full text-sm font-semibold hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-300"
        >
          Start Chatting
        </Link>
      </div>
    </header>
  )
}

export default Header
