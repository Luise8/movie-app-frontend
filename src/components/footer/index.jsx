import {
  Box, Container, Link, useTheme,
} from '@mui/material';
import React from 'react';
import 'src/components/footer/styles.css';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import appResourcesPath from 'src/utils/app-resources-path';
import linkRoutes from 'src/utils/link-routes';

export default function Footer() {
  const theme = useTheme();
  return (
    <Container
      component="footer"
      data-testid="footer"
      className="footer"
      sx={{ backgroundColor: theme.palette.background.paper }}
    >

      <Box
        className="footer-container-links"
        data-testid="footer-container-links"
      >
        <Link
          href={linkRoutes.footer.github}
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
          sx={{
            marginRight: 'auto',
          }}
        >
          Created by Luis E. Gamez
        </Link>
        <Link
          href={linkRoutes.footer.website}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Website for Luis E. Gamez"
          color="inherit"
        >
          <img
            aria-hidden="true"
            src={appResourcesPath.myWebsiteIcon}
            alt="Url to my website"
          />

        </Link>
        <Link
          href={linkRoutes.footer.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Github account for Luis E. Gamez"
          color="inherit"
        >
          <GitHubIcon fontSize="small" />
        </Link>
        <Link
          href={linkRoutes.footer.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Linkedin account for Luis E. Gamez"
          color="inherit"
        >
          <LinkedInIcon fontSize="small" />

        </Link>
      </Box>
    </Container>
  );
}
