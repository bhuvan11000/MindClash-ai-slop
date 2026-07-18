import { Link } from 'react-router-dom'

function Header({ fullWidth }) {
  return (
    <header className={`bg-white border-b-[3px] border-[--color-ink] h-14 flex items-center px-5 ${fullWidth ? '' : ''}`}>
      <div className="w-full mx-auto flex items-center justify-center max-w-[1200px]">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/avatars/luffy.webp" alt="MindClash" className="w-6 h-6" />
          <span className="font-pixel text-sm text-[--color-ink] tracking-wide">MindClash</span>
        </Link>
      </div>
    </header>
  )
}

export default Header
