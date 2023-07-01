import React from 'react';
import PropTypes from 'prop-types';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Fade from '@mui/material/Fade';
import 'src/components/back-to-top/styles.css';

export default function BackToTop({ idReference }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      idReference,
    );

    if (anchor) {
      anchor.scrollIntoView({
        block: 'center', behavior: 'smooth',
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        className="back-to-top-box"
        onClick={handleClick}
        role="presentation"
      >
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </Box>
    </Fade>
  );
}

BackToTop.propTypes = {
  idReference: PropTypes.string.isRequired,
};
