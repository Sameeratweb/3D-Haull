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

    const handleScroll = (e) => {
        state.homeScrollY = e.currentTarget.scrollTop;
    }

    return (
        <AnimatePresence>
            {snap.intro && (
                <motion.div 
                    className='home' 
                    {...slideAnimation("left")}
                    onScroll={handleScroll}
                >

                    {/* Section 1: Hero */}
                    <section className="home-section">
                        <motion.div className='home-content' {...headContainerAnimation}>
                            <motion.div {...headTextAnimation}>
                                <h1 className="head-text">3D <br className='xl:block hidden'/> HAUL</h1>
                            </motion.div>
                            <motion.div {...headContentAnimation} className='flex flex-col gap-5'>
                                <p className='max-w-md font-normal text-gray-600 text-base'>
                                    Customize shirts, pants, and shoes with interactive 3D controls and create a look that is uniquely yours.
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
                                    LIVE 3D <br/>PREVIEW
                                </h1>
                            </motion.div>
                            <motion.div {...headContentAnimation} className='flex flex-col gap-5'>
                                <p className='max-w-md font-normal text-gray-600 text-base'>
                                    
                                See every change instantly.
Rotate, zoom, and inspect your outfit from every angle before making your final design.
                                </p>
                                <div className="text-sm font-semibold text-blue-600 tracking-wider uppercase">
                                    scroll down to explore
                                </div>
                            </motion.div>
                        </motion.div>
                    </section>

                    {/* Section 3: Call to Action */}
                    <section className="home-section">
                        <motion.div className='home-content' {...headContainerAnimation}>
                            <motion.div {...headTextAnimation}>
                                <h1 className="text-5xl xl:text-6xl font-black text-black leading-tight">
                                    PERSONALIZE<br/>EVERYTHING
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
