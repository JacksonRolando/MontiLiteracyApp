import { React } from "react"
import { motion } from "framer-motion"

const letterData = {
    'letters': [
        'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'
    ],
    'data': {
        'a': {
            'start': true
        }
    }
}
const Level = ({back}) => {
    return <div className="level">
        
        <motion.button onClick={() => back()}>Back</motion.button>
    </div>
}

export default Level