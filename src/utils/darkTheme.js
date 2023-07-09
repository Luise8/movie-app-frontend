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
    neutral: {
      main: '#808080',
      dark: '#606060',
      contrastText: '#000',
    },
  },
});

export default darkTheme;
