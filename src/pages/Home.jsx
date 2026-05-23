import { motion, AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'
import { CustomButton } from '../components'
import {
    headContainerAnimation,
    headContentAnimation,
    headTextAnimation,
    slideAnimation
} from '../config/motion'
import state from '../store'

const Home = () => {
    const snap = useSnapshot(state)

    return (
        <AnimatePresence>
            {snap.intro && (
                <motion.div className='home' {...slideAnimation("left")}>
                    {/* Floating fixed header */}
                    <motion.header className='home-header' {...slideAnimation("down")}>
                        <img src="./threejs.png" alt="logo" className='w-8 h-8 object-contain' />
                    </motion.header>

                    {/* Section 1: Hero */}
                    <section className="home-section">
                        <motion.div className='home-content' {...headContainerAnimation}>
                            <motion.div {...headTextAnimation}>
                                <h1 className="head-text">LET'S <br className='xl:block hidden'/> DO IT</h1>
                            </motion.div>
                            <motion.div {...headContentAnimation} className='flex flex-col gap-5'>
                                <p className='max-w-md font-normal text-gray-600 text-base'>
                                    Unleash your imagination and design your own ultimate look. Experience cutting-edge 3D configuration in real-time.
                                </p>
                                <CustomButton 
                                    type="filled"
                                    title="Customize it"
                                    handleClick={() => state.intro = false}
                                    customStyles="w-fit px-5 py-3 font-bold text-sm shadow-md"
                                />
                            </motion.div>
                        </motion.div>
                    </section>

                    {/* Section 2: Craftsmanship */}
                    <section className="home-section">
                        <motion.div className='home-content' {...headContainerAnimation}>
                            <motion.div {...headTextAnimation}>
                                <h1 className="text-5xl xl:text-6xl font-black text-black leading-tight">
                                    PREMIUM<br/>CRAFT
                                </h1>
                            </motion.div>
                            <motion.div {...headContentAnimation} className='flex flex-col gap-5'>
                                <p className='max-w-md font-normal text-gray-600 text-base'>
                                    Engineered with the finest heavy-weight fabrics and modern tailoring. Scroll to rotate and inspect every angle of the athletic silhouette.
                                </p>
                                <div className="text-sm font-semibold text-blue-600 tracking-wider uppercase">
                                    Swipe or scroll down to explore
                                </div>
                            </motion.div>
                        </motion.div>
                    </section>

                    {/* Section 3: Call to Action */}
                    <section className="home-section">
                        <motion.div className='home-content' {...headContainerAnimation}>
                            <motion.div {...headTextAnimation}>
                                <h1 className="text-5xl xl:text-6xl font-black text-black leading-tight">
                                    UNLIMITED<br/>STYLES
                                </h1>
                            </motion.div>
                            <motion.div {...headContentAnimation} className='flex flex-col gap-5'>
                                <p className='max-w-md font-normal text-gray-600 text-base'>
                                    Color-customize the hoodie, pants, and shoes independently. Create your custom collection in our interactive 3D studio.
                                </p>
                                <CustomButton 
                                    type="filled"
                                    title="Start Customizing"
                                    handleClick={() => state.intro = false}
                                    customStyles="w-fit px-5 py-3 font-bold text-sm shadow-md"
                                />
                            </motion.div>
                        </motion.div>
                    </section>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default Home
