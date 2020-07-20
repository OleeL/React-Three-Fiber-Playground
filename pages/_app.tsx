import { AppProps } from 'next/app'
import { StoreProvider } from '../stores/StoreContext';
import 'mobx-react-lite/batchingForReactDom';
import GlobalStyles from '../components/game/GlobalStyles';

const MyApp = ({ Component, pageProps }: AppProps) => {
    return(
        <StoreProvider>
            <Component {...pageProps} />
            <style jsx>{GlobalStyles}</style>
        </StoreProvider>
    );
}

export default MyApp