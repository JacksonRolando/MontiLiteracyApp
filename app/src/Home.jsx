import "./Home.css"

import React from "react"
import montiLogo from "./bundledImages/montiLogo.png"
import { motion } from 'framer-motion'

const Home = ({toLevel}) => {
    return <div className="home">
        <div className="title-logo">
            <img src={montiLogo} id='montiLogo' alt="logo"/>
        </div>
        <motion.button  
            whileTap={{ scale: 0.9, filter: 'brightness(50%)'}}
            transition={{duration: .1}}
            className="startButton bree"
            onClick={() => toLevel()}
        >
            Begin
        </motion.button>
    </div>
}

export default Home