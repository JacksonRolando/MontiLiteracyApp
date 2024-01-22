import { React } from "react"
import "./level.css"

const Level = ({back}) => {
    return <div className="level">
        <h1>Hello!</h1>
        <button onClick={() => back()}>Back</button>
    </div>
}

export default Level