import { ReactElement } from "react"

const Show = ({ when, children }: { when: boolean, children: ReactElement }) => {
  return (
    <>
      {when && children}
    </>
  )
}

export default Show