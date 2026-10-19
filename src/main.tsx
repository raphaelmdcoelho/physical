import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '@grass-ds/tokens/tokens.css';
import '@grass-ds/css/fonts.css';
import '@grass-ds/css/grass.css';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
