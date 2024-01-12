import React, {useEffect, useRef, useState, MouseEvent} from "react";
import {useResize} from "@/hooks/useResize";

interface Fragment {
    x: number,
    y: number
}

/**
 * Redraws canvas based on the history stack
 * @param ctx Canvas context
 * @param stack History stack
 */
function redrawCanvas(ctx : CanvasRenderingContext2D | null, stack : Fragment[][]) {
    for (let action of stack) {
        draw(ctx, action);
    }
}

/**
 * Draws the performed action on canvas
 * @param ctx Canvas context
 * @param action Array of fragments (coordinates)
 */
function draw(ctx : CanvasRenderingContext2D | null, action : Fragment[]) {
    ctx!.strokeStyle = 'rgba(0, 0, 0, 1)'
    ctx!.beginPath();
    for (let frag of action) {
        ctx!.lineTo(frag.x, frag.y);
    }
    ctx!.stroke();
}

export function Canvas() {
    const [isPressed, setPressed] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [action, setAction] = useState<Fragment[]>([]);
    const [stack, setStack] = useState<Fragment[][]>([]);
    const {width, height} = useResize();

    {/* Redraw canvas if the window width or height were changed */}
    useEffect(() => {
        const ctx = canvasRef.current!.getContext('2d');
        redrawCanvas(ctx, stack);
    }, [width, height])

    function handleMouseDown(event: MouseEvent) {
        if (!isPressed) {
            {/* Start drawing process */}
            const ctx = canvasRef.current!.getContext('2d');
            ctx!.strokeStyle = 'rgba(0, 0, 0, 1)'
            ctx!.beginPath();

            {/* Record fragment of current draw action */}
            let curAct = action;
            curAct.push({x: event.pageX, y: event.pageY});

            {/* Draw the line to the current coordinates */}
            ctx!.lineTo(event.pageX, event.pageY);
            ctx!.stroke();

            {/* Update current states */}
            setAction(curAct);
            setPressed(true);
        }
    }

    function handleMouseUp() {
        if (isPressed) {
            {/* Stop drawing process */}
            const ctx = canvasRef.current!.getContext('2d');
            ctx!.stroke();
            ctx!.closePath();

            {/* Record draw action in history stack */}
            stack.push(action);
            setAction([]);
            setStack(stack);

            {/* Update current state */}
            setPressed(false);
        }
    }

    function handleMouseMove(event : MouseEvent) {
        if (isPressed) {
            {/* Draw the line to the current coordinates */}
            const ctx = canvasRef.current!.getContext('2d');
            ctx!.lineTo(event.pageX, event.pageY);
            ctx!.stroke();

            {/* Record movement in draw action */}
            let curAct = action;
            curAct.push({x: event.pageX, y: event.pageY});
            setAction(curAct);
        }
    }

    function handleLeave() {
        if (isPressed) {
            {/* Stop drawing process */}
            const ctx = canvasRef.current!.getContext('2d');
            ctx!.stroke();
            ctx!.closePath();

            {/* Record draw action in history stack */}
            stack.push(action);
            setAction([]);
            setStack(stack);

            {/* Update current state */}
            setPressed(false);
        }
    }

    return <canvas
        width={width}
        height={height}
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleLeave}
    />
}