import { useEffect, useState } from 'react';
import {
  getRatesUser,
} from 'src/services/get-data';

export default function useRatesUser({ id, modalDeleted }) {
  const INITIALPAGE = 0;
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
        const dataFetched = await getRatesUser({ page: INITIALPAGE, id });
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
  }, [id]);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        if (!modalDeleted) {
          return;
        }
        const dataFetched = await getRatesUser({ page: INITIALPAGE, id });
        if (mounted) {
          setData(dataFetched);
          setPage(INITIALPAGE);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalDeleted]);

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

        const dataFetched = await getRatesUser({ page, id });
        if (mounted) {
          setData((prevData) => {
            const initialMovies = prevData.results.slice();
            const results = initialMovies.concat(dataFetched.results);
            return { ...dataFetched, results };
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
  }, [page, id]);

  return {
    data, loading, loadingNextPage, setPage, error, setData, setError, setLoading,
  };
}
