import { DreamImage } from '@prisma/client'
import { authOptions } from 'api/auth/[...nextauth]'
import CopyPrompt from 'components/CopyPrompt'
import { GetServerSideProps } from 'next'
import { Session, unstable_getServerSession } from 'next-auth'
import Head from 'next/head'
import Image from 'next/image'
import Masonry from 'react-masonry-css'
import { prisma } from '../server/db/client'
import { truncate } from '../utils/truncate'
interface GalleryProps {
  dreams: DreamImage[]
}

const Gallery: React.FC<GalleryProps> = ({ dreams }) => {
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
            <div className="card-body p-4">
              <p className="text-sm">{truncate(image?.prompt, 200)}</p>
              <div className="bg-base-200 rounded-lg p-2">
                <div className="dropdown dropdown-top dropdown-end flex">
                  <div className="flex-1 flex text-sm items-center">
                    <Image src={image?.user?.image} alt="user" width={24} height={24} className="mask mask-circle" />
                    <span className='ml-2'>{image?.user.name}</span>
                  </div>
                  <label tabIndex={0} className="btn btn-ghost btn-sm text-sm w-11">
                    <Image src="/icons/more-vertical.svg" alt="share" width={24} height={24} />
                  </label>
                  <div>
                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow-md bg-base-100 rounded-box w-52 mb-1 text-sm">
                      <li><CopyPrompt prompt={image?.prompt} /></li>
                    </ul>
                  </div>
                </div>
              </div>
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
      user: true,
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
      dreams: JSON.parse(JSON.stringify(dreams)),
    },
  }
}

export default Gallery
