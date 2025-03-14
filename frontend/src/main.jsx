import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// Force CSS reload by adding a version query parameter
import './index.css?v=1'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)