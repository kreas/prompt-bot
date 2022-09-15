import NavBar from './Navbar'
import SideBar from './Sidebar'

type BaseLayoutProps = {
  children: React.ReactNode
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  return (
    <SideBar>
      <div className="flex flex-col w-full min-h-screen">
        <NavBar/>
        <main className="flex flex-1 w-full m-auto mb-4 mt-20">{children}</main>
      </div>
    </SideBar>
  )
}

export default BaseLayout
