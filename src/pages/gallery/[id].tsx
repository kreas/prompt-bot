import { GetServerSideProps } from 'next'
import { trpc } from 'src/utils/trpc'
import DreamPreview from 'components/DreamPreview'

type ViewDreamImageProps = {
  id: string
}

const ViewDreamImage: React.FC<ViewDreamImageProps> = ({ id }) => {
  return (
    <div className="w-full mx-4">
      <DreamPreview dreamId={id} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { id: context.query.id },
  }
}

export default ViewDreamImage
