import { authOptions } from 'api/auth/[...nextauth]'
import { extractDreams } from 'src/utils/extractDreams'
import { GetServerSideProps } from 'next'
import { Session, unstable_getServerSession } from 'next-auth'
import { trpc } from 'src/utils/trpc'
import { useIntersectionObserver } from 'src/hooks/userIntersectionObserver'
import { useRef, useState } from 'react'
import Card from 'components/dreams/Card'
import Modal from 'components/dreams/Modal'
import Head from 'next/head'
import Link from 'next/link'
import Masonry from 'react-masonry-css'
import Preview from 'components/dreams/Preview'

interface GalleryProps {
  session: Session | null
}

const Gallery: React.FC<GalleryProps> = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [favorites, setFavorites] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const trpcQuery = trpc.useInfiniteQuery(['gallery.my-items', { limit: 10, favorites }], {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  const { fetchNextPage, hasNextPage } = trpcQuery || {}
  const images = extractDreams(trpcQuery)

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  })

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  }

  return (
    <>
      <Head>
        <title>Scrollrack | Gallery</title>
      </Head>

      <div className="flex flex-col flex-1 gap-4 h-full">
        <div className="tabs px-4">
          <a className={`tab tab-bordered ${favorites || 'tab-active'}`} onClick={() => setFavorites(false)}>
            All
          </a>
          <a className={`tab tab-bordered ${favorites && 'tab-active'}`} onClick={() => setFavorites(true)}>
            Favorites
          </a>
        </div>

        <section id="gallery no-scrollbar" style={{ overflowY: 'scroll' }}>
          <Masonry breakpointCols={breakpointColumnsObj} className="masonry-grid flex gap-4 px-4" style={{ margin: 0 }}>
            {images.map((image) => image && <Card image={image} selectImage={setSelectedImage} key={image?.id} />)}
          </Masonry>
          <div id="scroll-end" className='mb-28' ref={loadMoreRef} />
        </section>

        {!hasNextPage && (
          <p className="text-center text-sm">
            You have reached the end... &nbsp;
            <Link href="/">
              <a className="bold underline">Go dream some more.</a>
            </Link>
          </p>
        )}
      </div>

      {selectedImage && (
        <Modal>
          <Preview dreamId={selectedImage} />
        </Modal>
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}

export default Gallery
