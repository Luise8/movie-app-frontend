import { useEffect, useState } from 'react';
import { getMoviesBySearch } from 'src/services/get-data';
import helperFunctions from 'src/utils/helper-functions';

export default function useSearch({ query }) {
  const INITIALPAGE = 1;
  const [data, setData] = useState({});
  const [page, setPage] = useState(INITIALPAGE);
  const [loading, setLoading] = useState(true);
  const [loadingNextPage, setLoadingNextPage] = useState(false);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        if (mounted) {
          setLoading(true);
        }
        const dataFetched = await getMoviesBySearch({ page: INITIALPAGE, query });
        if (mounted) {
          setData(dataFetched);
          setError(false);
          setLoading(false);
        }
      } catch (e) {
        if (mounted) {
          setError(e);
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [query]);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        if (page === INITIALPAGE) {
          return;
        }

        if (mounted) {
          setLoadingNextPage(true);
        }

        const dataFetched = await getMoviesBySearch({ page, query });
        if (mounted) {
          setData((prevData) => {
            const initialMovies = prevData.results.slice();
            const resultsMaybeDuplicated = initialMovies.concat(dataFetched.results);
            return { ...dataFetched, results: helperFunctions.getUniqueItemsByProperties(resultsMaybeDuplicated, 'id') };
          });
          setError(false);
          setLoadingNextPage(false);
        }
      } catch (e) {
        if (mounted) {
          setError(e);
          setLoadingNextPage(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [page, query]);

  return {
    data, loading, loadingNextPage, setPage, error,
  };
}
