import { React, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import "./App.css"
import Home from "./Home"
import Level from "./Level"

const App = () => {
  const [pageSet, setPageSet] = useState({'home': true})

  const easySetPage = (page) => {
    for (let key of Object.keys(pageSet)){
      pageSet[key] = false
    }
    pageSet[page] = true
    setPageSet({...pageSet})
  }

  return <AnimatePresence mode="wait">
    {pageSet['home'] && (
      <motion.div
        key="home"
        className="App"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
      >
        <Home toLevel={() => easySetPage('level')}/>
      </motion.div>
    )}
    {pageSet['level'] && (
      <motion.div
        key="level"
        className="App"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
      >
        <Level back={() => easySetPage('home')}/>
      </motion.div>
    )}
    </AnimatePresence>
}

export default App
