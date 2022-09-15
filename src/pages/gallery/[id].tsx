import { DreamImage } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { trpc } from 'src/utils/trpc'
import Image from 'next/image'
import CopyPrompt from 'components/CopyPrompt'
import DreamPreview from 'components/DreamPreview'

type ViewDreamImageProps = {
  id: string
}

const ViewDreamImage: React.FC<ViewDreamImageProps> = ({ id }) => {
  const { data: image } = trpc.useQuery(['gallery.image', { id }])

  if (!image) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full mx-4">
      <DreamPreview image={image} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { id: context.query.id },
  }
}

export default ViewDreamImage
