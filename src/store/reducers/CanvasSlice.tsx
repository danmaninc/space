import {Fragment} from "@/app/_hooks/useStack";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {useAppDispatch} from "@/app/_hooks/redux";
import {sendFragment} from "@/store/reducers/SocketSlice";

interface CanvasState {
    roomId: string;
    stack: Fragment[][];
}

interface ActionData {
    actionId: number,
    fragment: Fragment
}

const initialState: CanvasState = {
    roomId: "",
    stack: []
}

export const canvasSlice = createSlice({
    name: 'canvas',
    initialState,
    reducers: {
        joinFragment(state: CanvasState, action: PayloadAction<ActionData>) {
            // if canvas will go out of sync, then there is possible out of range exception!
            if (state.stack.length == action.payload.actionId) state.stack.push([]);
            state.stack[action.payload.actionId].push(action.payload.fragment);
            const dispatch = useAppDispatch();
            dispatch(sendFragment(action.payload))
        },
        joinRoom(state: CanvasState, action: PayloadAction<CanvasState>) {
            state.roomId = action.payload.roomId;
            state.stack = action.payload.stack;
        }
    }
})

export const { joinFragment, joinRoom } = canvasSlice.actions;
export default canvasSlice.reducer;