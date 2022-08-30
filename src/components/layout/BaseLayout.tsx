import Footer from './Footer'
import NavBar from './Navbar'

type BaseLayoutProps = {
  children: React.ReactNode
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default BaseLayout
