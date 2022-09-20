import { GetServerSideProps } from 'next'
import Preview from 'components/dreams/Preview'

type ViewDreamImageProps = {
  id: string
}

const ViewDreamImage: React.FC<ViewDreamImageProps> = ({ id }) => {
  return (
    <div className="w-full mx-4">
      <Preview dreamId={id} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { id: context.query.id },
  }
}

export default ViewDreamImage
