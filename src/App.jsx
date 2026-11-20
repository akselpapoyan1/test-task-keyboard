import { Suspense } from 'react'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { usePhysicalKeys } from './hooks/usePhysicalKeys'
import Header from './sections/Header/Header'
import Hero from './sections/Hero/Hero'
import Sound from './sections/Sound/Sound'
import Inside from './sections/Inside/Inside'
import Build from './sections/Build/Build'
import TryIt from './sections/TryIt/TryIt'
import Specs from './sections/Specs/Specs'
import Faq from './sections/Faq/Faq'
import Reserve from './sections/Reserve/Reserve'
import Footer from './sections/Footer/Footer'
import StructuredData from './components/StructuredData'

export default function App() {
  useSmoothScroll()
  usePhysicalKeys()

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        {/* each boundary hydrates on its own, which keeps the main thread from one long task */}
        <Suspense>
          <Sound />
        </Suspense>
        <Suspense>
          <Inside />
        </Suspense>
        <Suspense>
          <Build />
        </Suspense>
        <Suspense>
          <TryIt />
        </Suspense>
        <Suspense>
          <Specs />
        </Suspense>
        <Suspense>
          <Faq />
        </Suspense>
        <Suspense>
          <Reserve />
        </Suspense>
      </main>
      <Footer />
      <StructuredData />
    </>
  )
}
