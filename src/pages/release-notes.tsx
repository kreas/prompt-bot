import { NotionAPI } from 'notion-client'

const ReleaseNotesPage = ({ page }) => {
  return <h1>Hello World</h1>
}

export const getServerSideProps = async () => {
  const api = new NotionAPI()
  const page = await api.getPage('067dd719-a912-471e-a9a3-ac10710e7fdf')

  return {
    props: {
      page,
    },
  }
}

export default ReleaseNotesPage
