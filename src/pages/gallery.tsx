import { authOptions } from 'api/auth/[...nextauth]'
import { GetServerSideProps } from 'next'
import { Session, unstable_getServerSession } from 'next-auth'
import { trpc } from 'src/utils/trpc'
import { useState } from 'react'
import Head from 'next/head'
import ImageCard, { ImageObj } from '../components/ImageCard'
import ImageModal from 'components/ImageModal'
import Masonry from 'react-masonry-css'

interface GalleryProps {
  session: Session | null
}

const Gallery: React.FC<GalleryProps> = () => {
  const [selectedImage, setSelectedImage] = useState<ImageObj | null>(null)
  const { data: dreams } = trpc.useQuery(['gallery.items.my-items'])

  if (!dreams) return null

  const images = dreams.map((dream: any) => {
    const image = dream.dreamImages[0]
    if (!image) return null

    return {
      id: image.id,
      dreamId: dream.id,
      prompt: dream.prompt,
      image: image.image,
      seed: image.seed,
      createdAt: dream.createdAt,
      width: dream.width,
      height: dream.height,
      user: dream.user,
    }
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

      <Masonry breakpointCols={breakpointColumnsObj} className="masonry-grid flex gap-4 p-4" style={{ margin: 20 }}>
        {images.map((image) => image && <ImageCard image={image} selectImage={setSelectedImage} key={image?.id} />)}
      </Masonry>

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
