import React, {useEffect, useRef, useState, MouseEvent} from "react";
import {useResize} from "@/hooks/useResize";

interface Fragment {
    x: number,
    y: number
}

export function Canvas() {
    const [isPressed, setPressed] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [action, setAction] = useState<Fragment[]>([]);
    const [stack, setStack] = useState<Fragment[][]>([]);
    const { width, height } = useResize();
    useEffect(() => {
        const ctx = canvasRef.current!.getContext('2d');
        redrawCanvas(ctx);
    }, [width, height])

    function redrawCanvas(ctx : CanvasRenderingContext2D | null) {
        for (let action of stack) {
            draw(ctx, action);
        }
    }

    function draw(ctx : CanvasRenderingContext2D | null, action : Fragment[]) {
        ctx!.strokeStyle = 'rgba(0, 0, 0, 1)'
        ctx!.beginPath();
        for (let frag of action) {
            ctx!.lineTo(frag.x, frag.y);
        }
        ctx!.stroke();
    }

    function handleMouseDown(event : MouseEvent) {
        if (!isPressed) {
            console.log("down");
            const ctx = canvasRef.current!.getContext('2d');
            ctx!.strokeStyle = 'rgba(0, 0, 0, 1)'
            let curAct = action;
            ctx!.beginPath();
            curAct.push({x: event.pageX, y: event.pageY});
            ctx!.lineTo(event.pageX, event.pageY);
            ctx!.stroke();
            setAction(curAct);
            setPressed(true);
        }
    }

    function handleMouseUp() {
        if (isPressed) {
            console.log("up");
            const ctx = canvasRef.current!.getContext('2d');
            ctx!.stroke();
            ctx!.closePath();
            stack.push(action);
            setAction([]);
            setStack(stack);
            setPressed(false);
            console.log(stack);
        }
    }

    function handleMouseMove(event : MouseEvent) {
        console.log("move");
        if (isPressed) {
            const ctx = canvasRef.current!.getContext('2d');
            let curAct = action;
            curAct.push({x: event.pageX, y: event.pageY});
            ctx!.lineTo(event.pageX, event.pageY);
            ctx!.stroke();
            setAction(curAct);
        }
    }

    function handleLeave() {
        if (isPressed) {
            const ctx = canvasRef.current!.getContext('2d');
            ctx!.stroke();
            ctx!.closePath();
            stack.push(action);
            setAction([]);
            setStack(stack);
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