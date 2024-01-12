import React, {useEffect, useRef, useState, MouseEvent} from "react";
import {useResize} from "@/hooks/useResize";
import {useStack} from "@/hooks/useStack";
import {Fragment} from "@/hooks/useStack";


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

/**
 * Draws the line to specified coordinates
 * @param ctx Canvas context
 * @param target Target coordinates
 * @param color Color of the line
 */
function drawLineTo(ctx: CanvasRenderingContext2D | null, target: Fragment, color: string | CanvasGradient | CanvasPattern) {
    ctx!.strokeStyle = color;
    ctx!.lineTo(target.x, target.y);
    ctx!.stroke();
}

export function Canvas() {
    const [isPressed, setPressed] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { stack, addStep, endAction } = useStack();

    const {width, height} = useResize();

    {/* Redraw canvas if the window width or height were changed */}
    useEffect(() => {
        const ctx = canvasRef.current!.getContext('2d');
        redrawCanvas(ctx, stack);
    }, [width, height])

    function handleMouseDown(event: MouseEvent) {
        if (!isPressed) {
            {/* Start drawing process and draw the line to the current coordinates */}
            const ctx = canvasRef.current!.getContext('2d');
            ctx!.beginPath();
            drawLineTo(ctx, {x: event.pageX, y: event.pageY}, 'rgba(0, 0, 0, 1)')

            {/* Record fragment of current draw action */}
            addStep({x: event.pageX, y: event.pageY});

            {/* Update current states */}
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
            endAction();

            {/* Update current state */}
            setPressed(false);
        }
    }

    function handleMouseMove(event : MouseEvent) {
        if (isPressed) {
            {/* Draw the line to the current coordinates */}
            const ctx = canvasRef.current!.getContext('2d');
            drawLineTo(ctx, {x: event.pageX, y: event.pageY}, 'rgba(0, 0, 0, 1)');

            {/* Record movement in draw action */}
            addStep({x: event.pageX, y: event.pageY});
        }
    }

    function handleLeave() {
        if (isPressed) {
            {/* Stop drawing process */}
            const ctx = canvasRef.current!.getContext('2d');
            ctx!.stroke();
            ctx!.closePath();

            {/* Record draw action in history stack */}
            endAction();

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