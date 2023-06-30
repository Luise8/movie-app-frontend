import React, {
  useCallback,
  useEffect, useMemo, useRef, useState,
} from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import BootstrapDialogTitle from 'src/components/bootstrap-dialog-title/modal-notification';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { getMoviesBySearch } from 'src/services/get-data';
import { Alert, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import debounce from 'just-debounce-it';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import linkRoutes from 'src/utils/link-routes';

function AutocompleteSearch({ inputValue, setInputValue }) {
  const [options, setOptions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mouseInListBox, setMouseInListBox] = useState(false);
  const navigate = useNavigate();
  const highlightRef = useRef('');

  const fetch = useMemo(
    () => debounce(async (request, callback) => {
      try {
        setOptions([]);
        const data = await getMoviesBySearch({ query: request?.input });
        callback(data.results);
      } catch (e) {
        if (/can't access property "ready", window.grecaptcha is undefined/i.test(e.message)) {
          setError('Something wrong. Check your conection');
        } else {
          setError('Something wrong.');
        }
        setOptions([]);
        setLoading(false);
      }
    }, 1000),
    [],
  );

  const onChangeHighligh = useCallback((event, option, reason) => {
    if (reason === 'touch' || reason === 'keyboard') {
      setMouseInListBox(true);
      highlightRef.current = option?.id;
    }
  }, []);

  const handleEnter = useCallback((e) => {
    if (e.key === 'Enter') {
      // One movie was selected, go to the movie/id
      if (highlightRef.current) {
        navigate(linkRoutes.modalSearch.movie(highlightRef.current));
      } else if (inputValue !== '') {
        // No one movie selected, just go to search page with the input value
        navigate(linkRoutes.modalSearch.query(inputValue));
      }
    }
  }, [inputValue, navigate]);

  useEffect(() => {
    let active = true;
    try {
      setLoading(true);
      if (inputValue === '') {
        setOptions([]);
        setLoading(false);
        return undefined;
      }

      fetch({ input: inputValue }, (results) => {
        if (active) {
          let newOptions = [];

          if (results) {
            newOptions = [...results];
          }
          if (newOptions.length === 0) {
            setLoading(false);
          }
          setOptions(newOptions);
        }
      });
    } catch (e) {
      setError(e.message);
      setOptions([]);
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [inputValue, fetch]);

  return (
    <>
      <Autocomplete
        data-testid="autocomplete-search"
        id="autocomplete-search"
        sx={{
          width: '100%',
          maxWidth: '400px',
        }}
        getOptionLabel={(option) => option.title}
        filterOptions={(x) => x}
        options={options}
        // To remove hover when mouseleve the textbox
        ListboxProps={{
          onMouseEnter: () => {
            setMouseInListBox(true);
            highlightRef.current = '';
          },
          onMouseLeave: () => setMouseInListBox(false),
          sx: {
            '&& li.Mui-focused': {
              bgcolor: !mouseInListBox ? 'rgba(255, 255, 255, 0)' : undefined,
            },
          },
        }}
        // both to avoid to have the alert below the noOptionsText
        // and to avoid to have no options active when niputValue is ''
        freeSolo={typeof error === 'string' || inputValue === ''}
        includeInputInList
        clearOnBlur={false}
        loading={loading}
        filterSelectedOptions
        onHighlightChange={(e, option, reason) => onChangeHighligh(e, option, reason)}
        noOptionsText="No movies"
        onChange={(event, newValue) => {
          setOptions(newValue ? [newValue, ...options] : options);
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Find movie"
            fullWidth
            onKeyDown={(e) => handleEnter(e)}
          />
        )}
        renderOption={(props, option) => (
          <li
            {...props}
            key={option.id}
          >
            <Grid
              container
              component={Link}
              to={`movie/${option.id}`}
              sx={{ textDecoration: 'none' }}
            >
              <Grid item xs={12}>
                <Typography
                  color="text.primary"
                  sx={{
                    fontWeight: option.highlight ? 'bold' : 'regular', wordWrap: 'break-word',
                  }}
                >
                  {option.release_date ? `${option.title} (${option.release_date?.slice(0, 4)})` : `${option.title}`}
                </Typography>
              </Grid>
            </Grid>
          </li>
        )}
      />
      <Collapse in={typeof error === 'string'}>
        {typeof error === 'string' && (
        <Alert
          variant="filled"
          severity="error"
          action={(
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setError(null);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          )}
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
        )}
      </Collapse>
    </>
  );
}

AutocompleteSearch.propTypes = {
  inputValue: PropTypes.string.isRequired,
  setInputValue: PropTypes.func.isRequired,
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ModalSearch({
  handleClose, open,
}) {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  function handleConfirm() {
    if (inputValue !== '') {
      // No one movie selected, just go to search page with the input value

      navigate(linkRoutes.modalSearch.query(inputValue));
    }
  }
  return (
    <BootstrapDialog
      onClose={handleClose}
      data-testid="search-dialog"
      aria-labelledby="search-dialog"
      open={open}
      sx={{
        '& .MuiDialog-container': {
          '& .MuiPaper-root': {
            width: '100%',
            maxWidth: '500px',
          },
        },
      }}
    >
      <BootstrapDialogTitle id="customized-dialog" onClose={handleClose}>
        Search movies
      </BootstrapDialogTitle>
      <Grid container alignItems="center">
        <Grid item xs={10}>
          <DialogContent dividers>
            <AutocompleteSearch inputValue={inputValue} setInputValue={setInputValue} />
          </DialogContent>
        </Grid>
        <Grid item xs={2}>
          <DialogActions>
            <Button
              autoFocus
              sx={{ display: { xs: 'none', md: 'flex' } }}
              onClick={() => handleConfirm()}
            >
              Find
            </Button>
            <IconButton
              onClick={() => handleConfirm()}
              size="medium"
              aria-label="search"
              color="inherit"
              sx={{ display: { xs: 'flex', md: 'none' } }}
            >
              <SearchIcon />
            </IconButton>
          </DialogActions>
        </Grid>
      </Grid>
    </BootstrapDialog>
  );
}

ModalSearch.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
