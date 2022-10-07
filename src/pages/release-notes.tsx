import { NotionAPI } from 'notion-client'
import { NotionRenderer } from 'react-notion-x'
import Image from 'next/image'
import Link from 'next/link'

const ReleaseNotesPage = ({ page }: any) => {
  return (
    <div className="overflow-y-auto p-4 w-full">
      <NotionRenderer
        recordMap={page}
        fullPage={false}
        darkMode={true}
        components={{
          nextImage: Image,
          nextLink: Link,
        }}
      />
    </div>
  )
}

export const getServerSideProps = async () => {
  const api = new NotionAPI()
  const page = await api.getPage('304affb58aaa431398d78d4ccd708315')

  return {
    props: {
      page,
    },
  }
}

export default ReleaseNotesPage
