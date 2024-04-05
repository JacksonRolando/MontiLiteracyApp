import React, { useState, useEffect, useRef } from 'react';
import './level.css';
import trace_points from './trace_points';

const letters = ['a', 'b', 'c']

const tracePoints = {
    a: trace_points['a'],
    b: trace_points['b'],
    c: trace_points['c'],
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

const advancePoint = (tracePointIndRef, traceStrokeIndRef, pointsLen) => {
    tracePointIndRef.current = tracePointIndRef.current + 1
    if(tracePointIndRef.current >= pointsLen) {
        tracePointIndRef = 0
        traceStrokeIndRef.current = tracePointIndRef.current + 1
    }
    console.log('advanced!');
}

const Level = ({ back }) => {
    const [letter, setLetter] = useState('c');
    const [letterInd, setLetterInd] = useState(0);
    const [isDrawing, setIsDrawing] = useState(false);
    const [transformedStrokes, setTransformedStrokes] = useState(null)
    const tracePointInd = useRef(null)
    const traceStrokeInd = useRef(null)
    // const [tracePointInd, setTracePointInd] = useState(null)
    // const [traceStrokeInd, setTraceStrokeInd] = useState(null)
    const context = useRef(null);
    const imgScale = useRef(null)
    const letterHeight = useRef(null)
    const lastDrawnPoint = useRef({ x: 0, y: 0 });
    const prevD2ToPoint = useRef(null)

    const loadImg = (event) => {
        const letterImg = event.target
        const scaleFactor = window.innerHeight * .001
        imgScale.current = scaleFactor
        letterImg.height = scaleFactor * letterImg.height
        letterHeight.current = letterImg.height

        let points = tracePoints[letter]

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
            let checkResult = checkDrawnPoint(prevD2ToPoint.current, transformedStrokes[traceStrokeInd.current][tracePointInd.current + 1], lastDrawnPoint.current, imgScale.current)
            prevD2ToPoint.current = checkResult.dist
            if(checkResult.hit) {
                prevD2ToPoint.current = (letterHeight.current * 2) ** 2
                advancePoint(tracePointInd, traceStrokeInd, transformedStrokes[traceStrokeInd.current].length)
                if(traceStrokeInd >= transformedStrokes[traceStrokeInd.current].length){
                    setLetterInd(letterInd + 1)
                    setLetter(letterInd + 1)
                }   
                else {
                    drawNextPoint(context.current, tracePointInd.current, traceStrokeInd.current, transformedStrokes, imgScale.current)
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

    // useEffect(() => {
    //     drawNextPoint(context, tracePointInd, traceStrokeInd, transformedStrokes, imgScale.current)
    // }, [context, tracePointInd, traceStrokeInd, transformedStrokes])

    return (
        <div className="level">
            <img className='centered-and-cropped' id='letterImage' src={`letters/${letter}.png`} onLoad={loadImg}/>
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
