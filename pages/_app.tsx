import '../styles/globals.css'
import { Provider } from 'react-redux';
import store from '../redux/store'
import Head from 'next/head';
import favicon from '../public/favicon1.ico'
import { AppProps } from 'next/app';
import '../other/firebase'

function MyApp({ Component, pageProps }: AppProps) {

  return <>
    <Head>
      <link rel="shortcut icon" href={favicon.src} />
    </Head>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
  </>
}

export default MyApp
