import _ from 'lodash'
var user

const defaultRound = {
    levelNum: 0,
    levelStats: []
}

const loadUser = () => {
    user = JSON.parse(localStorage.getItem('user'))
    if (!user) {
        user = {
            id: crypto.randomUUID(),
            rounds: [],
            roundInProgress: _.cloneDeep(defaultRound)
        }

        localStorage.setItem('user', JSON.stringify(user))
    }
}

loadUser()

const setUserLevel = (levelNum) => {
    if (levelNum !== 0 && !levelNum) {
        throw ("Cannot set levelnum to " + levelNum)
    }

    user.roundInProgress.levelNum = levelNum
    localStorage.setItem('user', JSON.stringify(user))
}

const getUserLevel = () => {
    return user.roundInProgress?.levelNum || 0
}

const saveLevel = (performanceData) => {
    user.roundInProgress.levelStats.push(_.cloneDeep(performanceData))
}

const completeRound = async () => {
    sendPromise = sendRound(_.cloneDeep(user.roundInProgress))
    user.rounds.push(user.roundInProgress)
    user.roundInProgress = _.cloneDeep(defaultRound)
    await sendPromise
}

const sendRound = async (round) => {
    console.log('round sent! (at some point lol)\n', round);
}

export { user, setUserLevel, getUserLevel, saveLevel, completeRound }