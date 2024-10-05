import { combineReducers, configureStore, } from '@reduxjs/toolkit';
import paletteReducer, { fixAdjustments, PaletteState } from "./palette.ts";
import { persistStore, persistReducer, PersistConfig, } from 'redux-persist';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web


//inboundState: any, state: S, reducedState: S, config: PersistConfig<S>) => S;
const reconciler = (inboundState: PaletteState, state: PaletteState, reducedState: PaletteState, config: PersistConfig<PaletteState>): PaletteState => {
  fixAdjustments(inboundState);
  return inboundState;
}

  
const persistConfig: PersistConfig<PaletteState> = {
  key: 'palette',
  storage: storage,
  stateReconciler: reconciler,
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