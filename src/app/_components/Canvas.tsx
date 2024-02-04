import React, {MouseEvent} from "react";
import {useCanvas} from "@/app/_hooks/useCanvas";

export function Canvas() {
    const { canvasRef, w, isPressed, drawLineTo, stopDrawing } = useCanvas();

    function handleMouseDown(event: MouseEvent) {
        // TODO: Handle only left click
        if (!isPressed) {
            drawLineTo({x: event.pageX, y: event.pageY}, 'rgba(0, 0, 0, 1)', true);
        }
    }

    function handleMouseUp() {
        if (isPressed) {
            stopDrawing();
        }
    }

    function handleMouseMove(event : MouseEvent) {
        if (isPressed) {
            {/* Draw the line to the current coordinates */}
            drawLineTo({x: event.pageX, y: event.pageY}, 'rgba(0, 0, 0, 1)');
        }
    }

    function handleLeave() {
        if (isPressed) {
            stopDrawing();
        }
    }

    return <canvas
        width={w.width}
        height={w.height}
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleLeave}
    />
}