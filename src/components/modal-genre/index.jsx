import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import BootstrapDialogTitle from 'src/components/bootstrap-dialog-title/modal-notification';
import genresTMDB from 'src/utils/movie-genres-TMDB';

function AutocompleteGenre({ handleChange, genres }) {
  return (
    <Autocomplete
      data-testid="autocomplete-genre-search"
      multiple
      id="tags-outlined"
      options={genresTMDB}
      onChange={handleChange} // prints the selected
      value={genres}
      filterSelectedOptions
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Genres"
          placeholder="Genres to search..."
        />
      )}
    />
  );
}

AutocompleteGenre.propTypes = {
  handleChange: PropTypes.func.isRequired,
  genres: PropTypes.arrayOf(PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  )),
};

AutocompleteGenre.defaultProps = {
  genres: [],
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ModalGenre({
  handleConfirm, handleClose, open, genres, handleChange,
}) {
  return (
    <BootstrapDialog
      onClose={handleClose}
      data-testid="genre-search-dialog"
      aria-labelledby="genre-search-dialog"
      open={open}
      sx={{
        '& .MuiDialog-container': {
          '& .MuiPaper-root': {
            width: '100%',
            maxWidth: '500px', // Set your width here
          },
        },
      }}
    >
      <BootstrapDialogTitle id="customized-dialog" onClose={handleClose}>
        Find movies by genre
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <AutocompleteGenre genres={genres} handleChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Cancel
        </Button>
        <Button autoFocus onClick={handleConfirm}>
          Find
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}

ModalGenre.propTypes = {
  handleConfirm: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  genres: PropTypes.arrayOf(PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  )),
};

ModalGenre.defaultProps = {
  genres: [],
};
