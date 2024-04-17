import { React, useState } from "react"
import { motion, AnimatePresence, MotionConfig } from "framer-motion"
import "./App.css"

import Home from "./Home"
import Level from "./Level"
import AskStart from "./AskStart"
import LevelComplete from "./LevelComplete"
import Settings from "./Settings"
import RoundComplete from "./RoundComplete"


import { completeRound, getUserLevel, saveLevel, setUserLevel } from "./utils/user"
import { levels } from "./utils/levelData"

const App = () => {
  const [pageSet, setPageSet] = useState({ 'home': true })

  const easySetPage = (page) => {
    for (let key of Object.keys(pageSet)) {
      pageSet[key] = false
    }
    pageSet[page] = true
    setPageSet({ ...pageSet })
  }

  let startToPage = getUserLevel() > 0 ? 'askStart' : 'level'

  return <MotionConfig transition={{ duration: 0.5 }}>
    <AnimatePresence mode="wait">
      {pageSet['home'] && (
        <motion.div
          key="home"
          className="App"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Home start={() => easySetPage(startToPage)} settings={() => easySetPage('settings')} />
        </motion.div>
      )}
      {pageSet['askStart'] && (
        <motion.div
          key="askStart"
          className="App"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <AskStart toLevelNum={getUserLevel()} goToLevel={() => easySetPage('level')} />
        </motion.div>
      )}
      {pageSet['settings'] && (
        <motion.div
          key="settings"
          className="App"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Settings back={() => easySetPage('home')} />
        </motion.div>
      )}
      {pageSet['level'] && (
        <motion.div
          key="level"
          className="App"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Level levelNum={getUserLevel()} completeLevel={(performanceData) => {
            saveLevel(performanceData)
            setUserLevel(getUserLevel() + 1)

            if (getUserLevel() >= levels.length) {
              easySetPage('roundComplete')
              completeRound().catch(e => console.error('error completing round: ', e))
            } else {
              easySetPage('levelComplete')
            }
          }
          } />
        </motion.div>
      )}
      {pageSet['levelComplete'] && (
        <motion.div
          key="levelComplete"
          className="App"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <LevelComplete goToNext={() => easySetPage('level')} />
        </motion.div>
      )}
      {pageSet['roundComplete'] && (
        <motion.div
          key="roundComplete"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <RoundComplete toHome={() => easySetPage('home')} goAgain={() => easySetPage('level')} />
        </motion.div>
      )}
    </AnimatePresence>
  </MotionConfig>
}

export default App
