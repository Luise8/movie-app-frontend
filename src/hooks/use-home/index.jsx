import { useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import {
  getLatestMovies, getPopularMovies, getRatedMovies, getTrendingMovies,
} from 'src/services/get-data';
import helperFunctions from 'src/utils/helper-functions';

export default function useHome() {
  const [trending, setTrending] = useState(null);
  const [rated, setRated] = useState(null);
  const [popular, setPopular] = useState(null);
  const [latest, setLatest] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [header, setHeader] = useState(null);

  const theme = useTheme();
  const down400 = useMediaQuery('(max-width:400px)');
  const downSm = useMediaQuery(theme.breakpoints.down('sm'));
  const down970 = useMediaQuery('(max-width:970px)');

  useEffect(() => {
    let ismounted = true;
    async function fetchHomeData() {
      try {
        if (ismounted) {
          setLoading(true);
        }
        const popularData = await getPopularMovies();
        popularData.results = helperFunctions.getUniqueItemsByProperties(popularData.results, 'id');
        const latestData = await getLatestMovies();
        latestData.results = helperFunctions.getUniqueItemsByProperties(latestData.results, 'id');
        const trendingData = await getTrendingMovies();
        trendingData.results = helperFunctions.getUniqueItemsByProperties(trendingData.results, 'id');
        const ratedData = await getRatedMovies();

        if (ismounted) {
          let popularGroups;
          let latestGroups;
          let trendingGroups;
          let ratedGroups;

          const down400Popular = helperFunctions.group(popularData.results, 1);
          const down400Trending = helperFunctions.group(trendingData.results, 1);
          const down400Latest = helperFunctions.group(latestData.results, 1);
          const down400Rated = helperFunctions.group(ratedData.results, 1);

          const downSmPopular = helperFunctions.group(popularData.results, 2);
          const downSmTrending = helperFunctions.group(trendingData.results, 1);
          const downSmLatest = helperFunctions.group(latestData.results, 2);
          const downSmRated = helperFunctions.group(ratedData.results, 2);

          const down970Popular = helperFunctions.group(popularData.results, 3);
          const down970Trending = helperFunctions.group(trendingData.results, 3);
          const down970Latest = helperFunctions.group(latestData.results, 3);
          const down970Rated = helperFunctions.group(ratedData.results, 3);

          const biggerPopular = helperFunctions.group(popularData.results, 5);
          const biggerTrending = helperFunctions.group(trendingData.results, 5);
          const biggerLatest = helperFunctions.group(latestData.results, 5);
          const biggerRated = helperFunctions.group(ratedData.results, 5);

          if (down400) {
            popularGroups = down400Popular.slice();
            latestGroups = down400Latest.slice();
            trendingGroups = down400Trending.slice();
            ratedGroups = down400Rated.slice();
          } else if (downSm) {
            popularGroups = downSmPopular.slice();
            latestGroups = downSmLatest.slice();
            trendingGroups = downSmTrending.slice();
            ratedGroups = downSmRated.slice();
          } else if (down970) {
            popularGroups = down970Popular.slice();
            latestGroups = down970Latest.slice();
            trendingGroups = down970Trending.slice();
            ratedGroups = down970Rated.slice();
          } else {
            popularGroups = biggerPopular.slice();
            latestGroups = biggerLatest.slice();
            trendingGroups = biggerTrending.slice();
            ratedGroups = biggerRated.slice();
          }

          popularData.popularGroups = popularGroups;
          latestData.latestGroups = latestGroups;
          trendingData.trendingGroups = trendingGroups;
          ratedData.ratedGroups = ratedGroups;

          popularData.down400Popular = down400Popular.slice();
          latestData.down400Latest = down400Latest.slice();
          trendingData.down400Trending = down400Trending.slice();
          ratedData.down400Rated = down400Rated.slice();

          popularData.downSmPopular = downSmPopular.slice();
          latestData.downSmLatest = downSmLatest.slice();
          trendingData.downSmTrending = downSmTrending.slice();
          ratedData.downSmRated = downSmRated.slice();

          popularData.down970Popular = down970Popular.slice();
          latestData.down970Latest = down970Latest.slice();
          trendingData.down970Trending = down970Trending.slice();
          ratedData.down970Rated = down970Rated.slice();

          popularData.biggerPopular = biggerPopular.slice();
          latestData.biggerLatest = biggerLatest.slice();
          trendingData.biggerTrending = biggerTrending.slice();
          ratedData.biggerRated = biggerRated.slice();

          setPopular(popularData);
          setLatest(latestData);
          setTrending(trendingData);
          setRated(ratedData);
          const headerMovies = trendingData.results.slice(0, 4);

          setHeader(headerMovies);
          setLoading(false);
        }
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    }

    fetchHomeData();
    return () => {
      ismounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (popular === null || latest === null
      || trending === null || rated === null
      || (popular.results.length === 0
        && latest.results.length === 0
        && trending.results.length === 0 && rated.results.length === 0)) {
      return;
    }
    setLoading(true);
    if (down400) {
      setPopular((prevData) => ({
        ...prevData,
        popularGroups: prevData.down400Popular.slice(),
      }));
      setLatest((prevData) => ({
        ...prevData,
        latestGroups: prevData.down400Latest.slice(),
      }));
      setTrending((prevData) => ({
        ...prevData,
        trendingGroups: prevData.down400Trending.slice(),
      }));
      setRated((prevData) => ({
        ...prevData,
        ratedGroups: prevData.down400Rated.slice(),
      }));
    } else if (downSm) {
      setPopular((prevData) => ({
        ...prevData,
        popularGroups: prevData.downSmPopular.slice(),
      }));
      setLatest((prevData) => ({
        ...prevData,
        latestGroups: prevData.downSmLatest.slice(),
      }));
      setTrending((prevData) => ({
        ...prevData,
        trendingGroups: prevData.downSmTrending.slice(),
      }));
      setRated((prevData) => ({
        ...prevData,
        ratedGroups: prevData.downSmRated.slice(),
      }));
    } else if (down970) {
      setPopular((prevData) => ({
        ...prevData,
        popularGroups: prevData.down970Popular.slice(),
      }));
      setLatest((prevData) => ({
        ...prevData,
        latestGroups: prevData.down970Latest.slice(),
      }));
      setTrending((prevData) => ({
        ...prevData,
        trendingGroups: prevData.down970Trending.slice(),
      }));
      setRated((prevData) => ({
        ...prevData,
        ratedGroups: prevData.down970Rated.slice(),
      }));
    } else {
      setPopular((prevData) => ({
        ...prevData,
        popularGroups: prevData.biggerPopular.slice(),
      }));
      setLatest((prevData) => ({
        ...prevData,
        latestGroups: prevData.biggerLatest.slice(),
      }));
      setTrending((prevData) => ({
        ...prevData,
        trendingGroups: prevData.biggerTrending.slice(),
      }));
      setRated((prevData) => ({
        ...prevData,
        ratedGroups: prevData.biggerRated.slice(),
      }));
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downSm, down970, down400]);

  return {
    latest, popular, trending, rated, error, loading, header,
  };
}
