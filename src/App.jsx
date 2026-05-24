import { useEffect } from 'react'
import { useSnapshot } from 'valtio'
import state from './store'
import Lenis from 'lenis'
import Canvas from "./canvas"
import Customizer from "./pages/Customizer"
import Home from "./pages/Home"

function App() {
  const snap = useSnapshot(state)

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    window.lenis = lenis

    return () => {
      lenis.destroy()
      window.lenis = null
    }
  }, [])

  // Reset scroll position when transitioning between intro and customizer
  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [snap.intro])

  return (
    <main className={`app transition-all ease-in ${snap.intro ? "h-screen overflow-hidden xl:h-auto xl:min-h-screen xl:overflow-visible" : "h-screen overflow-hidden"}`}>
      <Home />
      <Canvas />
      <Customizer />
    </main>
  )
}

export default App