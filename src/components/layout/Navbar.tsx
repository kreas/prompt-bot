const NavBar: React.FC = () => {
  return (
    <div className="navbar bg-base-100 w-full">
      <div className="flex-none md:hidden">
        <button className="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-5 h-5 stroke-current"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">PROMPT BOT</a>
      </div>
      <div className="flex-none hidden md:block">
        <ul>
          <li>
            {}
            <button className="btn btn-ghost normal-case">Launch</button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default NavBar
