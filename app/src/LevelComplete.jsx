import { React } from "react";
import { MotionConfig, motion } from "framer-motion";

import './level.css';

const iconSize = 200

const LevelComplete = ({ goToNext }) => {
    return (
        <MotionConfig transition={{ duration: 0.4 }}>
            <div className="completeScreen col">
                <motion.div
                    key="LevelComplete"
                    className="completeScreen"
                    initial={{ opacity: 0, y: 100, scale: 0.2, rotate: 90 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                >
                    <img src="./icons/excited.svg" height={iconSize + 'rem'} />
                    <img src="./icons/thumb.svg" height={3.5 / 5 * iconSize + 'rem'} />
                </motion.div >
                <motion.button
                    whileTap={{ scale: 0.9, filter: 'brightness(50%)' }}
                    transition={{ duration: .1 }}
                    onClick={() => goToNext()}
                >
                    <img src="./icons/forward.svg" height='50rem' />
                </motion.button>
            </div>
        </MotionConfig>
    )
}

export default LevelComplete