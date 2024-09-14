import { combineReducers, configureStore, } from '@reduxjs/toolkit';
import paletteReducer from "./palette.ts";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
  
const persistConfig = {
  key: 'palette',
  storage,
}

//the middleware entry can be deleted, but will cause warnings with large sets of nodes
const persistedReducer = persistReducer(persistConfig, paletteReducer);

const store = configureStore({
    reducer: {palette: persistedReducer},
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
});

let ps = persistStore(store);
export const persistor = ps;
export default store;