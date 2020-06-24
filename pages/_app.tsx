import { AppProps } from 'next/app'
import Game from './index'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default MyApp