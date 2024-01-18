import {combineSlices, configureStore} from "@reduxjs/toolkit";
import {canvasSlice} from "@/store/reducers/CanvasSlice";
import {socketSlice} from "@/store/reducers/SocketSlice";

const rootReducer = combineSlices(canvasSlice, socketSlice, {
    canvas: canvasSlice.reducer,
    socket: socketSlice.reducer
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']