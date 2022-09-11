import { authOptions } from 'api/auth/[...nextauth]'
import { GetServerSideProps } from 'next'
import { Session, unstable_getServerSession, User } from 'next-auth'
import { trpc } from 'src/utils/trpc'
import { useRef, useState } from 'react'
import Head from 'next/head'
import ImageCard, { ImageObj } from '../components/ImageCard'
import ImageModal from 'components/ImageModal'
import Masonry from 'react-masonry-css'
import { extractDreams } from 'src/utils/extractDreams'
// import Link from 'next/link'
import { useIntersectionObserver } from 'src/hooks/userIntersectionObserver'
import Link from 'next/link'

interface GalleryProps {
  session: Session | null
}

const Gallery: React.FC<GalleryProps> = () => {
  const [selectedImage, setSelectedImage] = useState<ImageObj | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const trpcQuery = trpc.useInfiniteQuery(['gallery.my-items', { limit: 10 }], {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  const { isLoading, isFetching, fetchNextPage, hasNextPage, error } = trpcQuery
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

      <div className="flex flex-col">
        <section id="gallery">
          <Masonry breakpointCols={breakpointColumnsObj} className="masonry-grid flex gap-4 p-4" style={{ margin: 20 }}>
            {images.map((image) => image && <ImageCard image={image} selectImage={setSelectedImage} key={image?.id} />)}
          </Masonry>
        </section>

        <div id="scroll-end" ref={loadMoreRef} />

        {!hasNextPage && (
          <p className="text-center text-sm">
            You have reached the end... &nbsp;
            <Link href="/">
              <a className="bold underline">
                Go dream some more.
              </a>
            </Link>
          </p>
        )}
      </div>

      {selectedImage && <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />}
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
