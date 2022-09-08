import { DreamImage } from '@prisma/client'
import { authOptions } from 'api/auth/[...nextauth]'
import { GetServerSideProps } from 'next'
import { Session, unstable_getServerSession } from 'next-auth'
import Head from 'next/head'
import Image from 'next/image'
import Masonry from 'react-masonry-css'
import { prisma } from '../server/db/client'
import { truncate } from '../utils/truncate'
interface GalleryProps {
  session: Session | null
  dreams: DreamImage[]
}
const Gallery: React.FC<GalleryProps> = ({ session, dreams }) => {
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

      <Masonry breakpointCols={breakpointColumnsObj} className="masonry-grid flex gap-4 p-4">
        {images.map((image) => (
          <div className="card bg-neutral shadow-xl w-full aspect-photo mb-5" key={image?.id}>
            <figure>
              <Image
                src={image?.image}
                alt="image.prompt"
                key={image?.id}
                width={image?.width}
                height={image?.height}
              />
            </figure>
            <div className="card-body">
              <p>{truncate(image?.prompt, 90)}</p>
            </div>
          </div>
        ))}
      </Masonry>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)

  const dreams = await prisma?.dream.findMany({
    where: {
      userId: session?.user?.id,
      status: 'complete',
    },
    include: {
      dreamImages: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
      dreams: JSON.parse(JSON.stringify(dreams)),
    },
  }
}

export default Gallery
