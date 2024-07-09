import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import RedBlackProvider from './RedBlackTree/RedBlackProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RedBlackProvider>
      <App />
    </RedBlackProvider>
  </React.StrictMode>,
)
