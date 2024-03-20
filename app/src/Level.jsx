import React, { useState, useEffect, useRef } from 'react';
import './level.css';
import trace_points from './trace_points';

const tracePoints = {
    a: trace_points['a'],
    b: trace_points['b'],
    c: trace_points['c'],
    m: trace_points['c'],
    R: trace_points['c'],
    t: trace_points['c'],
    q: trace_points['q'],
};

const [canvasWidth, canvasHeight] = [window.innerWidth, window.innerHeight]

const Level = ({ back }) => {
    const [letter, setLetter] = useState('b');
    const [isDrawing, setIsDrawing] = useState(false);
    const [context, setContext] = useState(null);
    const lastDrawnPoint = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = document.getElementById('canvas');
        const curContext = canvas.getContext('2d');
        setContext(curContext);

        const rect = canvas.getBoundingClientRect()

        console.log(tracePoints[letter])

        // tracePoints[letter][0].forEach(point => {
        //     curContext.beginPath();
        //     curContext.arc(point[0] * canvasWidth, point[1] * canvasHeight, 3, 0, 2 * Math.PI);
        //     curContext.fillStyle = 'blue';
        //     curContext.fill();
        //   });

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

            context.beginPath();
            context.moveTo(lastDrawnPoint.current.x, lastDrawnPoint.current.y);
            context.lineTo(x, y);
            context.strokeStyle = 'black';
            context.lineWidth = 8;
            context.lineCap = 'round'
            context.stroke();

            lastDrawnPoint.current = ({ x, y });
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
    }, [isDrawing]);

    return (
        <div className="level">
            <img className='centered-and-cropped' src={`svg/${letter}.svg`}/>
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
