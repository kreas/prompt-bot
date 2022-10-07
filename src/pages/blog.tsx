import { NotionAPI } from 'notion-client'
import { NotionRenderer } from 'react-notion-x'
import { Collection } from 'react-notion-x/build/third-party/collection'
import Image from 'next/image'
import Link from 'next/link'

const BlogIndexPage = ({ page }) => {
  return (
    <div className="overflow-y-auto p-4 w-full">
      <NotionRenderer
        recordMap={page}
        fullPage={false}
        darkMode={true}
        mapPageUrl={(pageId) => `/blog/${pageId}`}
        components={{
          nextImage: Image,
          nextLink: Link,
          Collection,
        }}
      />
    </div>
  )
}

export const getServerSideProps = async () => {
  const api = new NotionAPI()
  const page = await api.getPage('b2600f7333cb475796d404669a8a28d8')

  return {
    props: {
      page,
    },
  }
}

export default BlogIndexPage
