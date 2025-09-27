import React from 'react';
import { BrowserRouter } from "react-router-dom";
import AppContent from './components/AppContent';

export default function App() {
    return (
        <BrowserRouter basename='/dmt'>
            <AppContent />
        </BrowserRouter>
    );
}