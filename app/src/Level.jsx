import React, { useState, useEffect, useRef } from 'react';
import './level.css';
import trace_points from './trace_points';

const letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']

const tracePoints = {
    a: trace_points['a'],
    b: trace_points['b'],
    c: trace_points['c'],
    d: trace_points['d'],
    e: trace_points['e'],
    f: trace_points['f'],
    g: trace_points['g'],
    h: trace_points['h'],
    i: trace_points['i'],
    j: trace_points['j'],
    k: trace_points['k'],
    l: trace_points['l'],
    m: trace_points['m'],
    n: trace_points['n'],
    o: trace_points['o'],
    p: trace_points['p'],
    q: trace_points['q'],
    r: trace_points['r'],
    s: trace_points['s'],
    t: trace_points['t'],
    u: trace_points['u'],
    v: trace_points['v'],
    w: trace_points['w'],
    x: trace_points['x'],
    y: trace_points['y'],
    z: trace_points['z'],
};

const TRACE_FUDGE_FACTOR = 23
const HIT_FUDGE_FACTOR = 23

const [canvasWidth, canvasHeight] = [window.innerWidth, window.innerHeight]

const transformStroke = (stroke, letterSize, pointsScale) => {
    const xMove = (canvasWidth - letterSize[0]) / 2
    const yMove = (canvasHeight - letterSize[1]) / 2

    const out = []
    for(let point of stroke) {
        out.push([pointsScale[0] * point[0] + xMove, -1 * pointsScale[1] * point[1] + yMove])
    }
    return out
}

const drawNextPoint = (context, tracePointIndex, traceStrokeIndex, transformStrokes, scaleFactor) => {
    context.fillStyle = "green";
    context.beginPath();
    if(transformStrokes){
        const tracePoint = transformStrokes[traceStrokeIndex][tracePointIndex]
        context.ellipse(tracePoint[0], tracePoint[1], 17 * scaleFactor, 17 * scaleFactor, 0, 0, Math.PI * 2);
        context.fill();

        const nextTracePoint = (tracePointIndex + 1 < transformStrokes[traceStrokeIndex].length) ? transformStrokes[traceStrokeIndex][tracePointIndex + 1] : null
        if(nextTracePoint) {
            context.fillStyle = "red";
            context.beginPath();
            context.ellipse(nextTracePoint[0], nextTracePoint[1], 13 * scaleFactor / 2, 13 * scaleFactor / 2, 0, 0, Math.PI * 2);
            context.fill();
        }
    }
}

const checkDrawnPoint = (prevD2ToPoint, nextPoint, pointToCheck, scaleFactor) => {
    const dist = ((pointToCheck.x - nextPoint[0]) ** 2 + (pointToCheck.y - nextPoint[1]) ** 2)
    if(dist < (HIT_FUDGE_FACTOR * scaleFactor) **2) {
        return {
            "good": true,
            "hit": true,
            "dist": dist
        }
    }

    if(Math.max(dist - (TRACE_FUDGE_FACTOR * scaleFactor) ** 2, 0) < prevD2ToPoint) {
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

const advanceLetter = (letterInd, setLetterInd, context, traceStrokeInd, tracePointInd) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    traceStrokeInd.current = 0
    tracePointInd.current = 0
    setLetterInd(letterInd + 1)
}

const advancePoint = (tracePointIndRef, traceStrokeIndRef, transformedStrokes) => {
    tracePointIndRef.current = tracePointIndRef.current + 1
    if(tracePointIndRef.current >= transformedStrokes[traceStrokeIndRef.current].length) {
        tracePointIndRef.current = 0
        traceStrokeIndRef.current = tracePointIndRef.current + 1
    }
}

const Level = ({ back }) => {
    const [letterInd, setLetterInd] = useState(0);
    const [isDrawing, setIsDrawing] = useState(false);
    const [transformedStrokes, setTransformedStrokes] = useState(null)
    const tracePointInd = useRef(null)
    const traceStrokeInd = useRef(null)
    const context = useRef(null);
    const imgScale = useRef(null)
    const letterHeight = useRef(null)
    const lastDrawnPoint = useRef({ x: 0, y: 0 });
    const prevD2ToPoint = useRef(null)

    const loadImg = (event) => {
        console.log("load image image");
        const letterImg = event.target
        const scaleFactor = window.innerHeight * .001
        imgScale.current = scaleFactor
        console.log(letterImg.height, letterImg.naturalHeight);
        letterImg.height = scaleFactor * letterImg.naturalHeight
        letterHeight.current = letterImg.height


        let points = tracePoints[letters[letterInd]]

        let pointsScale = [letterImg.width / (points.dims[0]), letterImg.height / (points.dims[1])]

        const newTransformedStrokes = []
        for(let inStroke of points.points){
            newTransformedStrokes.push(transformStroke(inStroke, [letterImg.width, letterImg.height], pointsScale))
        }

        setTransformedStrokes(newTransformedStrokes)

        tracePointInd.current = 0
        traceStrokeInd.current = 0
        prevD2ToPoint.current = (letterHeight.current * 2) ** 2
    }

    useEffect(() => {
        const canvas = document.getElementById('canvas');
        const curContext = canvas.getContext('2d');
        context.current = curContext

        drawNextPoint(curContext, tracePointInd.current, traceStrokeInd.current, transformedStrokes, imgScale.current)

        const rect = canvas.getBoundingClientRect()

        const handleTouchStart = (event) => {
            setIsDrawing(true);
  
            lastDrawnPoint.current = {
                x: event.touches[0].clientX - rect.left,
                y: event.touches[0].clientY - rect.top
            };
        };

        const handleTouchMove = (event) => {
            if (!isDrawing) return;

            const x = event.touches[0].clientX - rect.left
            const y = event.touches[0].clientY - rect.top

            context.current.beginPath();
            context.current.moveTo(lastDrawnPoint.current.x, lastDrawnPoint.current.y);
            context.current.lineTo(x, y);
            context.current.strokeStyle = 'black';
            context.current.lineWidth = 8;
            context.current.lineCap = 'round'
            context.current.stroke();

            lastDrawnPoint.current = ({ x, y });

            if(tracePointInd.current + 1 < transformedStrokes[traceStrokeInd.current].length) {
                let checkResult = checkDrawnPoint(prevD2ToPoint.current, transformedStrokes[traceStrokeInd.current][tracePointInd.current + 1], lastDrawnPoint.current, imgScale.current)
                prevD2ToPoint.current = checkResult.dist

                if(checkResult.hit) {
                    prevD2ToPoint.current = (letterHeight.current * 2) ** 2
                    drawNextPoint(context.current, tracePointInd.current, traceStrokeInd.current, transformedStrokes, imgScale.current)
                    advancePoint(tracePointInd, traceStrokeInd, transformedStrokes)
                    if(traceStrokeInd >= transformedStrokes[traceStrokeInd.current].length){
                        advanceLetter(letterInd, setLetterInd, context.current)
                    }   
                    else {
                        drawNextPoint(context.current, tracePointInd.current, traceStrokeInd.current, transformedStrokes, imgScale.current)
                    }
                }
            } else {
                if(traceStrokeInd.current + 1 >= transformedStrokes.length) {
                    advanceLetter(letterInd, setLetterInd, context.current, traceStrokeInd, tracePointInd)
                } else {
                    advancePoint(tracePointInd, traceStrokeInd, transformedStrokes)
                }
            }
        };

        const handleTouchEnd = () => {
            setIsDrawing(false);
        };

        canvas.addEventListener('touchstart', handleTouchStart, {passive: true});
        canvas.addEventListener('touchmove', handleTouchMove, {passive: true});
        canvas.addEventListener('touchend', handleTouchEnd, {passive: true});
        canvas.addEventListener('touchcancel', handleTouchEnd, {passive: true});

        return () => {
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchmove', handleTouchMove);
            canvas.removeEventListener('touchend', handleTouchEnd);
            canvas.removeEventListener('touchcancel', handleTouchEnd);
        };
    }, [isDrawing, transformedStrokes]);

    return (
        <div className="level">
            <img className='centered-and-cropped' id='letterImage' src={`letters/${letters[letterInd]}.png`} onLoad={loadImg}/>
            <canvas
                id="canvas"
                width={canvasWidth}
                height={canvasHeight}
                style={{ border: '1px solid black' }}
            />
        </div>
    );
};

export default Level;
