import Head from 'next/head'
import Image from 'next/image'
import Sidebar from '../components/Sidebar'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Whatsapp 2.0</title>
        <meta name="description" content="whatsapp 2.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />

      <h1>Creating Whatsapp 2.0</h1>

    </div>
  )
}
