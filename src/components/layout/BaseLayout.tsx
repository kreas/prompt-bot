import NavBar from './Navbar'
import SideBar from './Sidebar'

type BaseLayoutProps = {
  children: React.ReactNode
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  return (
    <SideBar>
      <div className="flex gap-4 flex-col w-full h-screen overflow-hidden">
        <NavBar />
        <main className="flex flex-1 w-full h-full no-scrollbar">{children}</main>
      </div>
    </SideBar>
  )
}

export default BaseLayout
