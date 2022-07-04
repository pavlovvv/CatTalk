import '../styles/globals.css'
import { Provider } from 'react-redux';
import store from '../redux/store'
import Head from 'next/head';
import catlogo from '../public/catlogo1.png'
import { AppProps } from 'next/app';
import '../other/firebase'
import { appWithTranslation } from 'next-i18next';

function MyApp({ Component, pageProps }: AppProps) {
  
  return <>
    <Head>
      <link rel="shortcut icon" href={catlogo.src} />
    </Head>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
  </>
}

export default appWithTranslation(MyApp)
