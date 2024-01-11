import React, {useEffect, useLayoutEffect, useRef, useState} from "react";

interface Fragment {
    x: number,
    y: number
}

export function Canvas() {
    const [isPressed, setPressed] = useState(false)
    const canvasRef = useRef();
    const [action, setAction] = useState([]);
    const [stack, setStack] = useState([]);

    useEffect(() => {
        // @ts-ignore
        const ctx = canvasRef.current.getContext('2d');
        ctx.width = window.innerWidth;
        ctx.height = window.innerHeight;
    }, [])
    // @ts-ignore
    function redrawCanvas(ctx) {
        for (let action of stack) {
            draw(ctx, action);
        }
    }

    // @ts-ignore
    function draw(ctx, action : Fragment[]) {
        ctx.beginPath();
        for (let frag of action) {
            ctx.lineTo(frag.x, frag.y);
        }
        ctx.stroke();
    }

    // @ts-ignore
    function handleMouseDown(event) {
        if (!isPressed) {
            console.log("down");
            // @ts-ignore
            const ctx = canvasRef.current.getContext('2d');
            let redrawFlag = false;
            if (ctx.width !== window.innerWidth || ctx.height !== window.innerHeight) {
                redrawFlag = true;
                console.log(ctx.width, window.innerWidth);
                console.log(ctx.height, window.innerHeight);
            }
            ctx.strokeStyle = 'rgba(0, 0, 0, 1)'
            let curAct = action;
            if (redrawFlag) {
                redrawCanvas(ctx);
            }
            ctx.beginPath();
            // @ts-ignore
            curAct.push({x: event.pageX, y: event.pageY});
            ctx.lineTo(event.pageX, event.pageY);
            ctx.stroke();
            // @ts-ignore
            setAction(curAct);
            setPressed(true);
        }
    }

    function handleMouseUp() {
        if (isPressed) {
            console.log("up");
            // @ts-ignore
            const ctx = canvasRef.current.getContext('2d');
            ctx.stroke();
            ctx.closePath();
            // @ts-ignore
            stack.push(action);
            /*if (stack.length > 10) {
                // @ts-ignore
                stack.shift();
                console.log("hi")
            }*/
            setAction([]);
            setStack(stack);
            setPressed(false);
            // @ts-ignore
            console.log(stack);
        }
    }

    // @ts-ignore
    function handleMouseMove(event) {
        console.log("move");
        if (isPressed) {
            // @ts-ignore
            const ctx = canvasRef.current.getContext('2d');
            let curAct = action;
            // @ts-ignore
            curAct.push({x: event.pageX, y: event.pageY});
            ctx.lineTo(event.pageX, event.pageY);
            ctx.stroke();
            setAction(curAct);
        }
    }

    return <canvas
        width={window.innerWidth}
        height={window.innerHeight}
        // @ts-ignore
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
    />
}