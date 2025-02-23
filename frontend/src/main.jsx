import { Buffer } from 'buffer';
window.Buffer = Buffer;
import { createRoot } from 'react-dom/client'
import './index.css'
import React from 'react';
import App from './App.jsx';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import store from "../store.js/";
// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// )
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
