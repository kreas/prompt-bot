import * as Sentry from '@sentry/nextjs'
import NextErrorComponent from 'next/error'

const CustomErrorComponent = (props: any) => {
  return <NextErrorComponent statusCode={props.statusCode} />
}

CustomErrorComponent.getInitialProps = async (contextData: any) => {
  await Sentry.captureUnderscoreErrorException(contextData)
  return NextErrorComponent.getInitialProps(contextData)
}

export default CustomErrorComponent
