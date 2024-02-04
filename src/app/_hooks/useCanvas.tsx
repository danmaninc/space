import {useEffect, useRef, useState} from "react";
import {useResize, WindowSize} from "@/app/_hooks/useResize";
import { Fragment } from "@/app/_hooks/useStack";
import { useAppDispatch, useAppSelector } from "@/app/_hooks/redux";
import {joinFragment, joinRoom, leaveRoom} from "@/store/reducers/CanvasSlice";
import {sendFragment} from "@/store/reducers/SocketSlice";

export function handleConnection(roomId: string, stack: Fragment[][]) {
    const dispatch = useAppDispatch();
    dispatch(joinRoom({roomId, stack}));
}

export function handleDisconnection() {
    const dispatch = useAppDispatch();
    dispatch(leaveRoom());
}

export function handleUpdate(actionId: number, fragment: Fragment) {
    const dispatch = useAppDispatch();
    dispatch(joinFragment({actionId, fragment}));
}

export const useCanvas = () => {
    const [isPressed, setPressed] = useState(false);
    const [usedAction, setUsedAction] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const stack = useAppSelector((state) => state.canvas.stack);
    const dispatch = useAppDispatch();
    const w : WindowSize = useResize();

    {/* Redraw canvas if the window width or height were changed */}
    useEffect(() => {
        const ctx = canvasRef.current!.getContext('2d');
        redrawCanvas(ctx, stack);
    }, [w.width, w.height])

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
            ctx!.stroke();
        }
    }

    /**
     * Draws the line to specified coordinates
     * @param target Target coordinates
     * @param color Color of the line
     * @param start Is this the starting point?
     */
    function drawLineTo(target: Fragment, color: string | CanvasGradient | CanvasPattern = 'rgba(0, 0, 0, 1)', start: boolean = false) {
        {/* Start drawing process and draw the line to the current coordinates */}
        const ctx = canvasRef.current!.getContext('2d');
        if (start) {
            ctx!.beginPath();
            setUsedAction(stack.length);
        }
        ctx!.strokeStyle = color;
        ctx!.lineTo(target.x, target.y);
        ctx!.stroke();

        {/* Record fragment of current draw action */}
        const action = {actionId: usedAction, fragment: { x: target.x, y: target.y }};
        dispatch(joinFragment(action));
        dispatch(sendFragment(action));
        {/* Update current states */}
        setPressed(true);
    }

    /**
     * Stops drawing process by saving draw action into history stack.
     */
    function stopDrawing() {
        {/* Stop drawing process */}
        const ctx = canvasRef.current!.getContext('2d');
        ctx!.stroke();
        ctx!.closePath();

        {/* Update current state */}
        setPressed(false);
        setUsedAction(stack.length);
    }


    return {
        canvasRef,
        w,
        isPressed,
        drawLineTo,
        stopDrawing
    }
}