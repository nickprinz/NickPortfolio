import { configureStore } from '@reduxjs/toolkit';
import treeReducer from "./tree.js";

const store = configureStore({
    reducer:{
        tree:treeReducer,
    }
});

export default store;