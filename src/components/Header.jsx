import { Link } from 'react-router-dom'

function Header({ fullWidth }) {
  return (
    <header className={`sticky z-50 h-14 bg-black/40 backdrop-blur-xl rounded-full border border-white/[0.06] flex items-center px-5 transition-all duration-200 ${fullWidth ? 'top-3 mx-3 mt-3' : 'top-3 mt-3 max-w-[1200px] mx-auto'}`}>
      <div className="w-full mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5">
            <line x1="5" y1="5" x2="27" y2="27" stroke="white" stroke-width="6" stroke-linecap="round"/>
            <line x1="27" y1="5" x2="5" y2="27" stroke="white" stroke-width="6" stroke-linecap="round"/>
          </svg>
          <span className="font-heading font-bold text-lg text-white">MindClash</span>
        </Link>
        <Link
          to="/chat"
          className="bg-white text-[#08080c] px-5 py-1.5 rounded-full text-sm font-semibold hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-300"
        >
          Start Chatting
        </Link>
      </div>
    </header>
  )
}

export default Header
