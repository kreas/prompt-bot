import Link from 'next/link'
import Image from 'next/image'

interface SideBarProps {
  children: React.ReactNode
}

const SideBar: React.FC<SideBarProps> = ({ children }) => {
  return (
    <div className="drawer">
      <input id="sidebar" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content overflow-hidden">{children}</div>
      <div className="drawer-side">
        <label htmlFor="sidebar" className="drawer-overlay"></label>
        <div className="menu menu-compact p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
          <div className="mb-4 w-48 ml-4 mt-2">
            <Link href="/">
              <Image src="/logo.webp" height={122} width={500} alt="scrollrack" />
            </Link>
          </div>

          <ul>
            <li className="menu-title">
              <span>Dreams</span>
            </li>
            <li>
              <Link href="/" className="active">
                Canvas
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="gallery">
                Gallery
              </Link>
            </li>
          </ul>

          <ul className="mt-2 pt-2 border-top-1">
            <li className="menu-title">
              <span>Magic the Gathering</span>
            </li>
            <li>
              <div className="text-blue-500">Coming Soon</div>
            </li>
          </ul>

          <ul className="mt-2 pt-2 border-top-1">
            <li className="menu-title">
              <span>Dungeons &amp; Dragons</span>
            </li>
            <li>
              <div className="text-blue-500">Coming Soon</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SideBar
