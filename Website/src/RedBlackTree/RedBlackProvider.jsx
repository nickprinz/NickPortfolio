
import {Provider, } from "react-redux";
import store from "./store/store";

function RedBlackProvider({children}) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
  }
  
  export default RedBlackProvider