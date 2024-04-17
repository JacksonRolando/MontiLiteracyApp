import trace_points from './trace_points'

const levels = [
    { letters: ['a', 'm', 'e', 'l'] },
    { letters: ['s', 'i', 'p', 'o'] },
    { letters: ['f', 'u', 't', 'c'] },
    { letters: ['b', 'n', 'g', 'j'] },
    { letters: ['d', 'r', 'k', 'w'] },
    { letters: ['h', 'v', 'x', 'q'] },
    { letters: ['y', 'z'] }
]

const colorByLetter = {
    'a': '#00207b',
    'e': '#00207b',
    'i': '#00207b',
    'o': '#00207b',
    'u': '#00207b',
    'default': '#bf907f'
}

for (let level of levels) {
    level.tracePoints = level.tracePoints || {}
    for (let letter of level.letters) {
        level.tracePoints[letter] = trace_points[letter]
    }
}

export { levels, colorByLetter }