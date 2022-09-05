import NavBar from './Navbar'

type BaseLayoutProps = {
  children: React.ReactNode
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <NavBar />
      <main className="flex flex-1 w-full m-auto mb-4">{children}</main>
    </div>
  )
}

export default BaseLayout
