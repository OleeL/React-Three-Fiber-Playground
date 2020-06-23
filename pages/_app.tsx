import { AppProps } from 'next/app'
import Game from './index'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return <Game />
}

export default MyApp