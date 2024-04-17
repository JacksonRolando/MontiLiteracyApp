import { React } from 'react'
import { motion } from 'framer-motion'
import { setUserLevel } from './utils/user'

import "./Home.css"


const AskStart = ({ goToLevel }) => {

    return <div className="askStart">
        <motion.button
            whileTap={{ scale: 0.9, filter: 'brightness(50%)' }}
            transition={{ duration: .1 }}
            className="button small bree"
            onClick={() => {
                setUserLevel(0)
                goToLevel()
            }}
        >
            <img src='./icons/undo.svg' height='50rem' alt='start over' />
        </motion.button>
        <motion.button
            whileTap={{ scale: 0.9, filter: 'brightness(50%)' }}
            transition={{ duration: .1 }}
            className="button bree"
            onClick={() => goToLevel()}
        >
            <img src='./icons/forward.svg' height='180rem' alt='go to level' />
        </motion.button>
    </div>
}


export default AskStart