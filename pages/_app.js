import '../styles/globals.css'
import { useRouter } from 'next/router'
import Footer from '../components/Footer'
import Analytics from '../components/Analytics'

const NO_FOOTER = ['/maintenance']

export default function App({ Component, pageProps }) {
  const { pathname } = useRouter()
  return (
    <>
      <Analytics />
      <Component {...pageProps} />
      {!NO_FOOTER.includes(pathname) && <Footer />}
    </>
  )
}
