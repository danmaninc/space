import {Fragment} from "@/app/_hooks/useStack";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface CanvasState {
    roomId: string;
    stack: Fragment[][];
}

const initialState: CanvasState = {
    roomId: "",
    stack: [[]]
}

export const canvasSlice = createSlice({
    name: 'canvas',
    initialState,
    reducers: {
        joinFragment(state: CanvasState, action: PayloadAction<Fragment>) {
            state.stack[state.stack.length-1].push({
                x: action.payload.x,
                y: action.payload.y
            });
        },
        endAction(state: CanvasState) {
            state.stack.push([]);
        }
    }
})

export const { joinFragment, endAction } = canvasSlice.actions;
export default canvasSlice.reducer;