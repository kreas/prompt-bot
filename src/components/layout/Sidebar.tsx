import Link from "next/link"

interface SideBarProps {
  children: React.ReactNode
}

const SideBar: React.FC<SideBarProps> = ({ children }) => {
  return (
    <div className="drawer">
      <input id="sidebar" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content overflow-hidden">
        {children}
      </div>
      <div className="drawer-side">
        <label htmlFor="sidebar" className="drawer-overlay"></label>
        <ul className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
          <li><Link href="/" className="active">Dream</Link></li>
          <li><Link href="/gallery" className="gallery">Gallery</Link></li>
        </ul>
      </div>
    </div>
  )
}

export default SideBar
