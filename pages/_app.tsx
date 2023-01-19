import { AppProps } from 'next/app'
import GlobalStyles from '../components/game/GlobalStyles';

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <Component {...pageProps} />
            <style jsx>{GlobalStyles}</style>
        </>
    );
}

export default MyApp