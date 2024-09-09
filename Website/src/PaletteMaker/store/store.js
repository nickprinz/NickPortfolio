import { configureStore, } from '@reduxjs/toolkit';
import paletteReducer from "./palette.ts";

//the middleware entry can be deleted, but will cause warnings with large sets of nodes
const store = configureStore({
    reducer:{
        palette:paletteReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
});

export default store;