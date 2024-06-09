import { configureStore, } from '@reduxjs/toolkit';
import treeReducer from "./tree.js";

//the middleware entry can be deleted, but will cause warnings with large sets of nodes
const store = configureStore({
    reducer:{
        tree:treeReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
});

export default store;