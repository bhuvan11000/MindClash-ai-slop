import { Link } from 'react-router-dom'

function Header({ fullWidth }) {
  return (
    <header className={`bg-white border-b-[3px] border-[--color-ink] h-14 flex items-center px-5 ${fullWidth ? '' : ''}`}>
      <div className="w-full mx-auto flex items-center justify-between max-w-[1200px]">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/avatars/luffy.webp" alt="MindClash" className="w-6 h-6" />
          <span className="font-pixel text-sm text-[--color-ink] tracking-wide">MindClash</span>
        </Link>
        <nav className="flex items-center gap-5">
          <Link to="/chat" className="font-mono text-[11px] uppercase tracking-wider text-[--color-ink-muted] hover:text-[--color-ink] transition-colors duration-100">Chat</Link>
          <Link to="/debate" className="font-mono text-[11px] uppercase tracking-wider text-[--color-ink-muted] hover:text-[--color-ink] transition-colors duration-100">Debate</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
