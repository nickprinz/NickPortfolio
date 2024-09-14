
import {Provider, } from "react-redux";
import store, { persistor } from "./store/store";
import { PersistGate } from 'redux-persist/integration/react'

function PaletteProvider({children}) {

    const loading = <p>Loading</p>

    return (
        <Provider store={store}>
            <PersistGate loading={loading} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    )
  }
  
  export default PaletteProvider