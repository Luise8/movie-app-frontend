import { createTheme } from '@mui/material';

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

export default darkTheme;
