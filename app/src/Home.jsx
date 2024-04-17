import "./Home.css"

import React from "react"
import montiLogo from "./bundledImages/montiLogo.png"
import { motion } from 'framer-motion'

const Home = ({ start, settings }) => {
    return <div className="home">
        <button
            className="settings"
            onClick={() => settings()}
        >
            <img src="./icons/settings.svg" height='40rem' />
        </button>
        <div className="title-logo">
            <img src={montiLogo} id='montiLogo' alt="logo" />
        </div>
        <motion.button
            whileTap={{ scale: 0.9, filter: 'brightness(50%)' }}
            transition={{ duration: .1 }}
            className="startButton"
            style={{ width: '15rem' }}
            onClick={() => start()}
        >
            <img src="./icons/play.svg" height='70rem' />
        </motion.button>
    </div>
}

export default Home