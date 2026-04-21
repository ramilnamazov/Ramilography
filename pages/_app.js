import '../styles/globals.css'
import { useRouter } from 'next/router'
import Footer from '../components/Footer'

const NO_FOOTER = ['/']

export default function App({ Component, pageProps }) {
  const { pathname } = useRouter()
  return (
    <>
      <Component {...pageProps} />
      {!NO_FOOTER.includes(pathname) && <Footer />}
    </>
  )
}
