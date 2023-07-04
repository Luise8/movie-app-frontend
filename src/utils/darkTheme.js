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
  },
});

export default darkTheme;
