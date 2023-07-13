import { useEffect, useState } from 'react';
import {
  getMovieTmdb,
  getSpecificReviewUser,
} from 'src/services/get-data';

export default function useReviewForm(movieId) {
  const [data, setData] = useState({});
  const [movieData, setMovieData] = useState({});
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [initialError, setInitialError] = useState(undefined);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        if (mounted) {
          setLoading(true);
        }
        const dataFetched = await getSpecificReviewUser(movieId);
        const movieFetched = await getMovieTmdb(movieId);
        if (mounted) {
          if (dataFetched.review !== null) {
            setTitle(dataFetched.review.title);
            setBody(dataFetched.review.body);
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
    title,
    body,
    setTitle,
    setBody,
    movieData,
  };
}
