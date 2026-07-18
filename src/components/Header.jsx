import { Link } from 'react-router-dom'

function Header({ fullWidth }) {
  return (
    <header className={`bg-white border-b-[3px] border-[--color-ink] h-14 flex items-center px-5 ${fullWidth ? '' : ''}`}>
      <div className="w-full mx-auto flex items-center justify-between max-w-[1200px]">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/avatars/luffy.webp" alt="MindClash" className="w-6 h-6" />
          <span className="font-pixel text-xs text-[--color-ink] tracking-wide">MindClash</span>
        </Link>
        <Link
          to="/chat"
          className="bg-[--color-ink] text-white px-5 py-1.5 text-sm font-semibold border-[3px] border-[--color-ink] shadow-[--shadow-sm] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[--shadow-md] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-100"
        >
          Start Chatting
        </Link>
      </div>
    </header>
  )
}

export default Header
