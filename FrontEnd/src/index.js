import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './contexts/authContext';
import { GeneralContext } from './contexts/generalContext';
import { BrowserRouter } from 'react-router-dom';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>

<BrowserRouter>
    <GeneralContext>
    <AuthContextProvider>
            <App />
    </AuthContextProvider>
</GeneralContext>
</BrowserRouter>
    </React.StrictMode>
        
);
