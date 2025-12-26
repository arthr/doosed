import React from 'react'
import ReactDOM from 'react-dom/client';
import { enableMapSet } from 'immer'

// Habilita suporte a Map e Set no Immer (usado pelo Zustand)
enableMapSet();

import App from '@/App';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
