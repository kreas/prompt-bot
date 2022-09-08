import { DreamImage } from '@prisma/client'
import { authOptions } from 'api/auth/[...nextauth]'
import { GetServerSideProps } from 'next'
import { Session, unstable_getServerSession } from 'next-auth'
import Head from 'next/head'
import Image from 'next/image'

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

  return (
    <>
      <Head>
        <title>Scrollrack | Gallery</title>
      </Head>

      <div className="columns-2 md:columns-3 xl:columns-4 flex-col w-screen p-4 gap-5 order-1">
        {images.map((image) => (
          <div className="card bg-base-300 shadow-xl w-full aspect-photo mb-5" key={image?.id}>
            <figure>
              <Image src={image?.image} alt="image.prompt" key={image?.id} width={image?.width} height={image?.height} />
            </figure>
            <div className="card-body">
              <p>{image?.prompt}</p>
            </div>
          </div>
        ))}
      </div>
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
    }
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
