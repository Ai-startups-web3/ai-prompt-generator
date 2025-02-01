import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
// import logger from 'redux-logger'
// import authReducer from "./slices/Auth/AuthSlice"
import chatReducer from "./slices/Ai/AiSlice"

export const makeStore = () => {
  return configureStore({
    reducer: {
        // auth:authReducer,
        aiChat: chatReducer,
    }, 
    // middleware:getDefaultMiddlerware =>
    //   getDefaultMiddlerware().concat(logger),
    //   devTools:true
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>