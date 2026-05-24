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

  // Synchronize URL Hash -> Valtio State (Browser Back/Forward / Mobile Swipe Gestures)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '' || hash === '#' || hash === '#/') {
        if (!state.intro || state.selectedMesh !== null) {
          state.intro = true;
          state.selectedMesh = null;
          state.hasInteracted = false;
        }
      } else if (hash === '#shop') {
        if (state.intro || state.selectedMesh !== null) {
          state.intro = false;
          state.selectedMesh = null;
        }
      } else if (hash.startsWith('#customize/')) {
        const productId = hash.replace('#customize/', '');
        if (state.intro || state.selectedMesh !== productId) {
          state.intro = false;
          state.selectedMesh = productId;
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Sync initial hash on load
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Synchronize Valtio State -> URL Hash (User UI Click Transitions)
  useEffect(() => {
    if (snap.intro) {
      if (window.location.hash !== '' && window.location.hash !== '#/' && window.location.hash !== '#') {
        window.location.hash = '#/';
      }
    } else if (snap.selectedMesh) {
      const targetHash = `#customize/${snap.selectedMesh}`;
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
      }
    } else {
      const targetHash = '#shop';
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
      }
    }
  }, [snap.intro, snap.selectedMesh]);

  return (
    <main className={`app transition-all ease-in ${snap.intro ? "h-screen overflow-hidden xl:h-auto xl:min-h-screen xl:overflow-visible" : "h-screen overflow-hidden"}`}>
      <Home />
      <Canvas />
      <Customizer />
    </main>
  )
}

export default App