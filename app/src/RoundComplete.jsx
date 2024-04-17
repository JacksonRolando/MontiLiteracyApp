import { React } from 'react'
import Confetti from 'react-confetti'
import { motion } from 'framer-motion'

import './RoundComplete.css'

const starSize = 150

const RoundComplete = ({ toHome, goAgain }) => {
    return (
        <div className='roundComplete'>
            <Confetti gravity={0.6} numberOfPieces={50} />
            <div className='stars'>
                <motion.img
                    transition={{ duration: 1 }}
                    initial={{ scale: 0.001, translateY: '-10rem', translateX: '-10rem', rotate: -360 * 2 }}
                    animate={{ scale: 1, translateY: 0, translateX: 0, rotate: 0 }}
                    src='./icons/star.svg'
                    height={starSize + 'rem'}
                />
                <motion.img
                    transition={{ duration: 1 }}
                    initial={{ scale: 0.001, translateY: '-10rem', rotate: -360 * 2 }}
                    animate={{ scale: 1, translateY: '-1rem', rotate: 0 }}
                    src='./icons/star.svg'
                    height={starSize + 'rem'}
                />
                <motion.img
                    transition={{ duration: 1 }}
                    initial={{ scale: 0.001, translateY: '-10rem', translateX: '10rem', rotate: -360 * 2 }}
                    animate={{ scale: 1, translateY: 0, translateX: 0, rotate: 0 }}
                    src='./icons/star.svg'
                    height={starSize + 'rem'}
                />
            </div>
            <div style={{ display: 'flex' }}>
                <motion.button
                    whileTap={{ scale: 0.9, filter: 'brightness(50%)' }}
                    transition={{ duration: .1 }}
                    onClick={() => toHome()}
                    style={{ marginRight: '2rem' }}
                >
                    <img src="./icons/home.svg" height='70rem' />
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.9, filter: 'brightness(50%)' }}
                    transition={{ duration: .1 }}
                    onClick={() => goAgain()}
                >
                    <img src="./icons/undo.svg" height='70rem' />
                </motion.button>
            </div>
        </div>
    )
}

export default RoundComplete