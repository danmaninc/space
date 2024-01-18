import {combineReducers, combineSlices, configureStore} from "@reduxjs/toolkit";
import {canvasSlice} from "@/store/reducers/CanvasSlice";

const rootReducer = combineSlices(canvasSlice, {
    canvas: canvasSlice.reducer
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']