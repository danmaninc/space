import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import WebSocket from "ws";
import {canvasSlice, joinFragment, joinRoom, leaveRoom} from "@/store/reducers/CanvasSlice";
import {useAppDispatch} from "@/app/_hooks/redux";
import {Fragment} from "@/app/_hooks/useStack";
import {handleConnection, handleDisconnection, handleUpdate} from "@/app/_hooks/useCanvas";

interface SocketState {
    ws: WebSocket | null;
    connected: boolean;
}

const initialState: SocketState = {
    ws: null,
    connected: false
}

interface ActionData {
    actionId: number,
    fragment: Fragment
}
interface RegisterAction {
    username: string;
    roomId: string;
}
export const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        connectToServer(state: SocketState, action: PayloadAction<RegisterAction>) {
            state.ws = new WebSocket('ws://localhost:4321/');
            state.ws.on('open', function open() {
                state.connected = true;
                console.log(`[WS] connected to server @ localhost:4321`);
                console.log(`[WS] entering room ${action.payload.roomId}...`);
                const data = JSON.stringify({ username: action.payload.username, roomId: action.payload.roomId });
                state.ws!.emit("register", data);
            })
            state.ws.on('register-success', function regSuccess(event) {
                const data = JSON.parse(event);
                handleConnection(action.payload.roomId, data.stack);
                console.log(`[WS] entered room ${action.payload.roomId} with username: ${action.payload.username}.`);
            })
            state.ws.on('canvas-update', function receiveAction(event) {
                const data = JSON.parse(event);
                // TODO: maybe useContext?
                handleUpdate(data.actionId, data.fragment);
                console.log(`[WS] received and dispatched event`);
            })
            state.ws.on('close', function handleDisconnect() {
                state.connected = false;
                state.ws = null;
                handleDisconnection();
                console.log(`[WS] connection closed`);
            })
        },
        sendFragment(state: SocketState, action: PayloadAction<ActionData>) {
            if (state.ws) {
                const data = JSON.stringify(action.payload);
                state.ws.emit('canvas-update', data);
                console.log(`[WS] sent action`);
            }
        },
        disconnectFromServer(state: SocketState) {
            if (state.ws) {
                state.ws.close(1000, 'leaveRoom');
            }
        }
    }
})

export const { connectToServer, sendFragment, disconnectFromServer } = socketSlice.actions;