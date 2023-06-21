import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from 'src/App';
import 'src/index.css';
import { UserAuthContextProvider } from 'src/context/auth';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00897b',
      contrastText: '#000',
    },
    secondary: {
      main: '#651fff',
    },
    background: {
      default: '#000',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
