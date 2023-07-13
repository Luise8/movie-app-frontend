import { useEffect, useState } from 'react';
import {
  getMovieTmdb,
  getSpecificRateUser,
} from 'src/services/get-data';

export default function useRateForm(movieId) {
  const [data, setData] = useState({});
  const [movieData, setMovieData] = useState({});
  const [value, setValue] = useState(1);
  const [loading, setLoading] = useState(true);
  const [initialError, setInitialError] = useState(undefined);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        if (mounted) {
          setLoading(true);
        }
        const dataFetched = await getSpecificRateUser(movieId);
        const movieFetched = await getMovieTmdb(movieId);
        if (mounted) {
          if (dataFetched.rate !== null) {
            setValue(dataFetched.rate.value);
          }
          setData(dataFetched);
          setMovieData(movieFetched);
          setInitialError(false);
          setLoading(false);
        }
      } catch (e) {
        if (mounted) {
          setInitialError(e);
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [movieId]);

  return {
    data,
    loading,
    initialError,
    setData,
    value,
    setValue,
    movieData,
  };
}
