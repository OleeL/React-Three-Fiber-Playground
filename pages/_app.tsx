import { AppProps } from 'next/app'
import { StoreProvider, useStore } from '../stores/StoreContext';

const MyApp = ({ Component, pageProps }: AppProps) => {
    return(
        <StoreProvider>
            <Component {...pageProps} />
        </StoreProvider>
    );
}

export default MyApp