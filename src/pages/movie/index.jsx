import {
  Box,
  Container,
  Divider,
  Typography,
  CardMedia,
  Card,
  CardActionArea,
  CardHeader,
  Button,
  Stack, useTheme, useMediaQuery, Rating, IconButton,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import BookmarkAddTwoToneIcon from '@mui/icons-material/BookmarkAddTwoTone';
import { Link, Navigate, useParams } from 'react-router-dom';
import throttle from 'just-throttle';
import { useUserAuth } from 'src/context/auth';
import Loading from 'src/components/loading';
import PageLayout from 'src/components/page-layout';
import helperFunctions from 'src/utils/helper-functions';
import useMovie from 'src/hooks/use-movie';
import Carousel from 'react-material-ui-carousel';
import { images, videos } from 'src/utils/tmdb-resources-url';
import appResourcesPath from 'src/utils/app-resources-path';
import ListGridMovies from 'src/components/list-movie-grid';
import 'src/pages/movie/styles.css';
import uniqid from 'uniqid';
import ModalAddMovieToList from 'src/components/modal-add-movie-to-list';
import linkRoutes from 'src/utils/link-routes';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

export default function Movie() {
  const { user } = useUserAuth();
  const { id } = useParams();
  const {
    data, loading, error, setError,
  } = useMovie(id);
  const [modalList, setModalList] = useState(false);

  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpenModalList = useMemo(() => throttle(
    () => {
      setModalList(true);
    },
    3000,
    { leading: true },
  ), []);

  const handleCloseModalList = () => {
    setModalList(false);
  };

  if (loading || helperFunctions.isObjectEmpty(user)) return <Loading />;

  if (error?.status === 404) return <Navigate to="/404" />;

  if (error) return <Navigate to="/error" />;

  return (
    <PageLayout>
      <Container
        className="page page-movie"
        data-testid="page-movie"
      >
        <Box
          className="page-movie-header"
          data-testid="page-movie-header"
          component="header"
          sx={{
            backgroundImage:
              `linear-gradient(to left, rgba(0, 0, 0, .6), rgba(0, 0, 0, 1)), url(${data.images.backdrops[0].file_path ? images.backdropSize300(data.images.backdrops[0].file_path) : appResourcesPath.heeroDefault})`,
          }}
        >
          {downMd && (
            <Box
              className="page-movie-container-title-md"
              data-testid="page-movie-container-title-md"
            >
              <Typography sx={{ typography: { sm: 'h4', xs: 'h5' } }} component="h1" color="secondary.light">
                {data.title}
              </Typography>
            </Box>
          )}
          <Box
            className="page-movie-container-header-img"
            data-testid="page-movie-container-header-img"
          >
            <img
              alt=""
              src={data.images.posters[0].file_path
                ? images.posterSize342(data.images.posters[0].file_path)
                : appResourcesPath.cardMovieSmall}
            />
          </Box>
          <Box
            className="page-movie-container-header-info"
            data-testid="page-movie-container-header-info"
          >
            {!downMd && (
            <Typography variant="h3" component="h1" color="secondary.light">
              {data.title}
            </Typography>
            )}
            <Box
              gap={1}
              className="page-movie-container-rating-and-add-list"
              data-testid="page-movie-container-rating-and-add-list"
            >
              <div style={{
                paddingTop: '3px',
              }}
              >
                {data.movieDB && data.movieDB?.rateAverage ? `${data.movieDB.rateAverage}/10` : null }
              </div>
              <Rating
                name="movie-header-rating"
                readOnly
                defaultValue={data.movieDB === null || !data.movieDB?.rateAverage ? 0 : 1}
                max={1}
              />

              {user && !helperFunctions.isObjectEmpty(user) ? (
                <IconButton
                  aria-label="Add to list"
                  onClick={handleOpenModalList}
                >
                  <BookmarkAddTwoToneIcon fontSize="large" />
                </IconButton>
              ) : (
                <IconButton
                  aria-label="Go to the registration page to be able to add to the list."
                  onClick={handleOpenModalList}
                  component={Link}
                  to={linkRoutes.movie.registration}
                >
                  <BookmarkAddTwoToneIcon fontSize="large" />
                </IconButton>
              )}
            </Box>
            <Stack gap={1}>
              <Typography variant="subtitle1" component="p">{data?.release_date ? `Release: ${data?.release_date}` : 'Release: no information.'}</Typography>
              <Typography variant="subtitle1" component="p">{data?.runtime ? `Duration: ${data?.runtime} min` : 'Duration: no information.'}</Typography>
              <Typography variant="subtitle1" component="p">{data?.overview ? data.overview : 'No information of description.'}</Typography>
              {data.genres.length === 0 ? 'No information of genres.' : (
                <Stack gap={1} flexDirection="row" flexWrap="wrap">
                  {data.genres.map((item) => (
                    <Button
                      component={Link}
                      to={linkRoutes.movie.genre(item.id)}
                      key={item.name}
                      variant="contained"
                      size="small"
                      sx={{ borderRadius: '15px' }}
                    >
                      {item.name}
                    </Button>
                  ))}
                </Stack>
              )}
            </Stack>
          </Box>
          <div
            className="page-movie-blur-heero"
            data-testid="page-movie-blur-heero"
          />
        </Box>
        <Divider flexItem />
        <Box
          className="page-movie-section"
          data-testid="page-movie-section-images"
          component="section"
        >
          <Container>
            <Typography
              className="section-header"
              component="h2"
              variant="h5"
              sx={{
                borderLeft: `5px solid ${theme.palette.primary.main}`,
              }}
            >
              Images
            </Typography>
          </Container>
          <Carousel
            className="page-movie-carousel"
            animation="slide"
            autoPlay={false}
            indicators
            navButtonsAlwaysVisible
            indicatorContainerProps={{
              style: {
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '80vw',
                paddingLeft: '20px',
                paddingRight: '20px',
                maxWidth: '1100px',
              },
            }}
          >
            {
            data.imageGroups.map((item) => (
              <Box
                className="page-movie-container-items-images-section"
                key={uniqid()}

              >
                {item.map((inner) => (
                  <img
                    key={inner.file_path}
                    alt=""
                    src={images.posterSize185(inner.file_path)}
                  />
                ))}

              </Box>
            ))
}
          </Carousel>
        </Box>
        <Divider flexItem />
        <Box
          className="page-movie-section"
          data-testid="page-movie-section-videos"
          component="section"
        >
          <Container>
            <Typography
              className="section-header"
              component="h2"
              variant="h5"
              sx={{
                borderLeft: `5px solid ${theme.palette.primary.main}`,
              }}
            >
              Videos
            </Typography>
          </Container>
          <Carousel
            animation="slide"
            autoPlay={false}
            indicators={false}
            navButtonsAlwaysVisible
            className="page-movie-carousel"
          >
            {data.videos.results.map((item) => (
              <Card
                className="page-movie-card-video"
                key={item.id}
                sx={{
                }}
              >
                <CardActionArea>
                  <CardHeader
                    className="page-movie-card-video-header"
                    title={(

                      <Typography
                        variant="h6"
                        noWrap
                      >
                        {item.name}
                      </Typography>

                  )}
                  />
                  <CardMedia
                    className="page-movie-video"
                    data-testid="page-movie-video"
                    component="iframe"
                    alt={item.name}
                    image={videos.youtube(item.key)}
                    src={videos.youtube(item.key)}
                    title={item.name}
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </CardActionArea>
              </Card>
            ))}
          </Carousel>
        </Box>
        <Divider flexItem />
        <Box
          className="page-movie-section"
          data-testid="page-movie-section-rates"
          component="section"
        >
          <Container>
            <Stack flexDirection="row" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap">
              <Typography
                className="section-header"
                component="h2"
                variant="h5"
                sx={{
                  borderLeft: `5px solid ${theme.palette.primary.main}`,
                }}
              >
                Rates
              </Typography>
              {user && !helperFunctions.isObjectEmpty(user) ? <Button variant="contained" component={Link} to={linkRoutes.movie.AddRate(id)} endIcon={<AddOutlinedIcon />}>Add rate</Button> : <Button variant="contained" component={Link} to={linkRoutes.movie.registration} endIcon={<AddOutlinedIcon />}>Sign up for rating</Button>}
            </Stack>

            <Rating
              name="value"
              className="page-movie-section-rate-rating"
              required
              data-testid="page-movie-section-rate-rating"
              value={data.movieDB?.rateAverage || 0}
              readOnly
              max={10}
            />
            <Typography variant="body1">
              Total:
              {' '}
              {data.movieDB?.rateCount || 0}
              {' '}
              rates
            </Typography>

          </Container>
        </Box>
        <Divider flexItem />
        <Box
          className="page-movie-section"
          data-testid="page-movie-section-reviews"
          component="section"
        >
          <Container>
            <Stack
              flexDirection="row"
              alignItems="flex-start"
              justifyContent="space-between"
              gap="3px"
              flexWrap="wrap"
            >
              <Typography
                className="section-header"
                component="h2"
                variant="h5"
                sx={{
                  borderLeft: `5px solid ${theme.palette.primary.main}`,
                }}
              >
                Reviews
              </Typography>
              <Stack gap="5px" marginBottom="10px">
                {user && !helperFunctions.isObjectEmpty(user) ? <Button variant="contained" component={Link} to={linkRoutes.movie.AddReview(id)} endIcon={<AddOutlinedIcon />}>Add review</Button> : <Button variant="contained" component={Link} to={linkRoutes.movie.registration} endIcon={<AddOutlinedIcon />}>Sign up to review</Button>}
                <Button variant="contained" color="secondary" sx={{ color: '#000' }} component={Link} to={linkRoutes.movie.reviews(id)} disabled={data.movieDB === null}>See reviews</Button>
              </Stack>
            </Stack>

            <Typography
              variant="body1"
            >
              Total:
              {' '}
              {data.movieDB?.reviews || 0}
              {' '}
              reviews
            </Typography>
          </Container>
        </Box>
        <Divider flexItem />
        <Box
          className="page-movie-section"
          data-testid="page-movie-section-similar-movies"
          component="section"
        >
          <Container>
            <Typography
              className="section-header"
              component="h2"
              variant="h5"
              sx={{
                borderLeft: `5px solid ${theme.palette.primary.main}`,
              }}
            >
              Similar movies
            </Typography>
          </Container>
          <Carousel
            className="page-movie-carousel"
            animation="slide"
            autoPlay={false}
            indicators
            navButtonsAlwaysVisible
            indicatorContainerProps={{
              style: {
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '80vw',
                paddingLeft: '20px',
                paddingRight: '20px',
                maxWidth: '1100px',
              },
            }}
          >
            {
              data.similarGroups.map((item) => (
                <Box
                  className="page-movies-container-items-similar-movies-section"
                  key={uniqid()}
                >
                  <ListGridMovies list={item} wrap="noWrap" />
                </Box>
              ))
}
          </Carousel>
        </Box>
        {user?.id && (
        <ModalAddMovieToList
          handleClose={handleCloseModalList}
          open={modalList}
          userId={user.id}
          movieId={id}
        />
        )}
      </Container>
    </PageLayout>
  );
}
