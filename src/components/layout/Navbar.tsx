import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'

const NavBar: React.FC = () => {
  const { data: session } = useSession()

  return (
    <div className="navbar bg-base-300 w-full drop-shadow-sm mb-4">
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
        <Link href="/">
          <a className="btn btn-ghost normal-case text-xl">scrollrack</a>
        </Link>
      </div>
      <div className="flex-none hidden md:block">
        <ul>
          <li>
            {session ? (
              <Link href="/projects">
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <Image src={session.user.image as string} width={150} height={150} alt={session.user.name as string} />
                  </div>
                </div>
              </Link>
            ) : (
              <button className="btn btn-ghost normal-case" onClick={() => signIn()}>
                Sign In
              </button>
            )}
          </li>
        </ul>
      </div>
    </div>
  )
}

export default NavBar
