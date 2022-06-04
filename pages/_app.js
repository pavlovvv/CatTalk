import '../styles/globals.css'
import { Provider } from 'react-redux';
import store from '../redux/store.ts'
import Head from 'next/head';
import favicon from '../public/favicon1.ico'

function MyApp({ Component, pageProps }) {

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
