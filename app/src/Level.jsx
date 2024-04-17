import { React, useState, useEffect, useRef, useReducer } from 'react';
import { motion } from 'framer-motion';

import './level.css';
import { levels, colorByLetter } from './utils/levelData'

const TRACE_FUDGE_FACTOR = 40
const HIT_FUDGE_FACTOR = 30

const DRAW_LINE_WIDTH = 8

const [canvasWidth, canvasHeight] = [window.innerWidth, window.innerHeight]

const transformStroke = (stroke, letterSize, pointsScale) => {
    const xMove = (canvasWidth - letterSize[0]) / 2
    const yMove = (canvasHeight - letterSize[1]) / 2

    const out = []
    for (let point of stroke) {
        out.push([pointsScale[0] * point[0] + xMove, -1 * pointsScale[1] * point[1] + yMove])
    }
    return out
}

const drawTarget = (context, tracePointIndex, traceStrokeIndex, transformStrokes, scaleFactor) => {
    context.fillStyle = "green";
    context.beginPath();
    if (transformStrokes && transformStrokes[traceStrokeIndex]) {
        const tracePoint = transformStrokes[traceStrokeIndex][tracePointIndex]
        context.ellipse(tracePoint[0], tracePoint[1], 17 * scaleFactor, 17 * scaleFactor, 0, 0, Math.PI * 2);
        context.fill();
    }
}

const checkDrawnPoint = (prevD2ToPoint, nextPoint, pointToCheck, scaleFactor) => {
    const dist = ((pointToCheck.x - nextPoint[0]) ** 2 + (pointToCheck.y - nextPoint[1]) ** 2)
    if (dist < (HIT_FUDGE_FACTOR * scaleFactor) ** 2) {
        return {
            "good": true,
            "hit": true,
            "dist": dist
        }
    }

    if (Math.max(dist - (TRACE_FUDGE_FACTOR * scaleFactor) ** 2, 0) < prevD2ToPoint) {
        return {
            "good": true,
            "hit": false,
            "dist": dist
        }
    }

    return {
        "good": false,
        "hit": false,
        "dist": dist
    }
}

const advanceLetter = (letterInd, setLetterInd, context, traceStrokeInd, tracePointInd, resetPrevDist) => {
    resetPrevDist()
    context.clearRect(0, 0, canvas.width, canvas.height);
    traceStrokeInd.current = 0
    tracePointInd.current = 0
    setLetterInd(letterInd + 1)
}

const advancePoint = (tracePointIndRef, traceStrokeIndRef, transformedStrokes, resetPrevDist, betweenStrokes) => {
    resetPrevDist()
    betweenStrokes.current = false
    tracePointIndRef.current += 1
    if (tracePointIndRef.current >= transformedStrokes[traceStrokeIndRef.current].length) {
        tracePointIndRef.current = 0
        traceStrokeIndRef.current += 1
        betweenStrokes.current = true
    }
}

const saveLetterAttrib = (performanceDataCurrent, letter, key, value) => {
    performanceDataCurrent.letters[letter] = performanceDataCurrent.letters[letter] || {}
    performanceDataCurrent.letters[letter][key] = value
}

const getLetterAttrib = (performanceDataCurrent, letter, key) => {
    performanceDataCurrent.letters[letter] = performanceDataCurrent.letters[letter] || {}
    return performanceDataCurrent.letters[letter][key]
}

const Level = ({ levelNum, completeLevel }) => {
    const [letterInd, setLetterInd] = useState(0);
    const [isDrawing, setIsDrawing] = useState(false);
    const [reloadKey, setReloadKey] = useState(-1)
    const [transformedStrokes, setTransformedStrokes] = useState(null)
    const tracePointInd = useRef(null)
    const traceStrokeInd = useRef(null)
    const context = useRef(null);
    const imgScale = useRef(null)
    const letterHeight = useRef(null)
    const lastDrawnPoint = useRef({ x: 0, y: 0 });
    const prevD2ToPoint = useRef(null)
    const betweenStrokes = useRef(null)
    const performanceData = useRef({
        time: new Date().getTime(),
        letters: {}
    })
    const hasTracked = useRef(false)

    const resetPrevDist = () => {
        prevD2ToPoint.current = (letterHeight.current * 2) ** 2
    }

    const loadImg = (event) => {
        console.log(performanceData.current);

        if (!hasTracked.current) {
            let curLetter = levels[levelNum].letters[letterInd]
            let curNumMistakes = getLetterAttrib(performanceData.current, curLetter, 'numTries') || 0
            saveLetterAttrib(performanceData.current, curLetter, 'numTries', curNumMistakes + 1)
        }

        hasTracked.current = true

        document.getElementById('level').style.backgroundColor = colorByLetter[levels[levelNum].letters[letterInd]] || colorByLetter['default']
        betweenStrokes.current = false

        const letterImg = event.target
        const scaleFactor = window.innerHeight * .0009
        imgScale.current = scaleFactor
        letterImg.height = scaleFactor * letterImg.naturalHeight
        letterHeight.current = letterImg.height

        context.current.clearRect(0, 0, canvas.width, canvas.height);

        let letter = levels[levelNum].letters[letterInd]
        let points = levels[levelNum].tracePoints[letter]

        let pointsScale = [letterImg.width / (points.dims[0]), letterImg.height / (points.dims[1])]

        const newTransformedStrokes = []
        for (let inStroke of points.points) {
            newTransformedStrokes.push(transformStroke(inStroke, [letterImg.width, letterImg.height], pointsScale))
        }

        setTransformedStrokes(newTransformedStrokes)

        tracePointInd.current = 0
        traceStrokeInd.current = 0
        resetPrevDist()
    }

    useEffect(() => {
        if (letterInd >= levels[levelNum].letters.length) {
            performanceData.current.time = new Date().getTime() - performanceData.current.time
            completeLevel(performanceData.current)
        }
    }, [letterInd])

    useEffect(() => {
        const canvas = document.getElementById('canvas');
        const curContext = canvas.getContext('2d');
        context.current = curContext

        drawTarget(curContext, tracePointInd.current, traceStrokeInd.current, transformedStrokes, imgScale.current)

        const rect = canvas.getBoundingClientRect()

        const handleTouchStart = (event) => {
            hasTracked.current = false

            lastDrawnPoint.current = {
                x: event.touches[0].clientX - rect.left,
                y: event.touches[0].clientY - rect.top
            };

            context.current.fillStyle = "black";
            context.current.beginPath();
            context.current.ellipse(lastDrawnPoint.current.x, lastDrawnPoint.current.y, DRAW_LINE_WIDTH / 2, DRAW_LINE_WIDTH / 2, 0, 0, Math.PI * 2);
            context.current.fill();
            let checkResult = checkDrawnPoint(prevD2ToPoint.current, transformedStrokes[traceStrokeInd.current][tracePointInd.current], lastDrawnPoint.current, imgScale.current)

            if (checkResult.hit) {
                advancePoint(tracePointInd, traceStrokeInd, transformedStrokes, resetPrevDist, betweenStrokes)
                if (traceStrokeInd.current >= transformedStrokes.length) {
                    advanceLetter(letterInd, setLetterInd, context.current, traceStrokeInd, tracePointInd, resetPrevDist)
                }
                else {
                    drawTarget(context.current, tracePointInd.current, traceStrokeInd.current, transformedStrokes, imgScale.current)
                }
            }

            setIsDrawing(true);
        };

        const handleTouchMove = async (event) => {
            if (!isDrawing) return;

            const x = event.touches[0].clientX - rect.left
            const y = event.touches[0].clientY - rect.top

            context.current.beginPath();
            context.current.moveTo(lastDrawnPoint.current.x, lastDrawnPoint.current.y);
            context.current.lineTo(x, y);
            context.current.strokeStyle = 'black';
            context.current.lineWidth = DRAW_LINE_WIDTH;
            context.current.lineCap = 'round'
            context.current.stroke();

            lastDrawnPoint.current = ({ x, y });

            if (transformedStrokes[traceStrokeInd.current] && tracePointInd.current < transformedStrokes[traceStrokeInd.current].length) {
                let checkResult = checkDrawnPoint(prevD2ToPoint.current, transformedStrokes[traceStrokeInd.current][tracePointInd.current], lastDrawnPoint.current, imgScale.current)
                prevD2ToPoint.current = checkResult.dist

                if (isDrawing && !checkResult.good && !betweenStrokes.current) {
                    setIsDrawing(false)
                    document.getElementById('level').style.backgroundColor = '#E84855'
                    await new Promise((resolve) => setTimeout(resolve, 0.5 * 1000))

                    setReloadKey(Math.random())
                } else if (checkResult.hit) {
                    advancePoint(tracePointInd, traceStrokeInd, transformedStrokes, resetPrevDist, betweenStrokes)
                    if (traceStrokeInd.current >= transformedStrokes.length) {
                        advanceLetter(letterInd, setLetterInd, context.current, traceStrokeInd, tracePointInd, resetPrevDist)
                    }
                    else {
                        drawTarget(context.current, tracePointInd.current, traceStrokeInd.current, transformedStrokes, imgScale.current)
                    }
                }
            } else {
                if (traceStrokeInd.current >= transformedStrokes.length) {
                    advanceLetter(letterInd, setLetterInd, context.current, traceStrokeInd, tracePointInd, resetPrevDist)
                } else {
                    advancePoint(tracePointInd, traceStrokeInd, transformedStrokes, resetPrevDist, betweenStrokes)
                }
            }
        };

        const handleTouchEnd = () => {
            setIsDrawing(false);
        };

        canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
        canvas.addEventListener('touchend', handleTouchEnd, { passive: true });
        canvas.addEventListener('touchcancel', handleTouchEnd, { passive: true });

        return () => {
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchmove', handleTouchMove);
            canvas.removeEventListener('touchend', handleTouchEnd);
            canvas.removeEventListener('touchcancel', handleTouchEnd);
        };
    }, [isDrawing, transformedStrokes]);

    return (
        <div id='level' className="level">
            <motion.div
                key={levels[levelNum].letters[letterInd] + '-level-' + reloadKey}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <img className='centered-and-cropped' id='letterImage' src={`letters/${levels[levelNum].letters[letterInd]}.png`} onLoad={loadImg} />
                <canvas
                    id="canvas"
                    width={canvasWidth}
                    height={canvasHeight}
                    style={{ border: '1px solid black' }}
                />
            </motion.div>
        </div>
    );
};

export default Level;
