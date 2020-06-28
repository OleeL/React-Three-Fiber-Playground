import { AppProps } from 'next/app'
import { StoreProvider } from '../stores/StoreContext';

const MyApp = ({ Component, pageProps }: AppProps) => {
    return(
        <StoreProvider>
            <Component {...pageProps} />
        </StoreProvider>
    );
}

export default MyApp