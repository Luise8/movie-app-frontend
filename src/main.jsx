import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from 'src/App';
import 'src/index.css';
import { UserAuthContextProvider } from 'src/context/auth';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import darkTheme from 'src/utils/darkTheme';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserAuthContextProvider>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </UserAuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>,

);
