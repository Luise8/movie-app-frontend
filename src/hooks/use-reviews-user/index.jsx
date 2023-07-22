import throttle from 'just-throttle';
import { useEffect, useMemo, useState } from 'react';
import {
  getReviewsUser,
} from 'src/services/get-data';
import { deleteReview } from 'src/services/review-write';
import helperFunctions from 'src/utils/helper-functions';

export default function useReviewsUser({ id, user }) {
  const INITIALPAGE = 0;
  const [data, setData] = useState({});
  const [page, setPage] = useState(INITIALPAGE);
  const [loading, setLoading] = useState(true);
  const [loadingNextPage, setLoadingNextPage] = useState(false);
  const [error, setError] = useState(undefined);

  const [selectedResource, setSelectedResource] = useState({});

  const [modalConfirmDelete, setModalConfirmDelete] = useState(false);

  const [modalDeleted, setModalDeleted] = useState(false);

  const handleCloseDeleted = () => {
    setModalDeleted(false);
  };

  const debounceHandleConfirmDelete = useMemo(() => throttle(
    async () => {
      try {
        setLoading(true);
        await deleteReview({
          movieId: selectedResource.movieId,
          reviewId: selectedResource.reviewId,
        });
        setSelectedResource({});
        setModalConfirmDelete(false);
        setModalDeleted(true);
      } catch (e) {
        setError(e);
        setLoading(false);
        setModalConfirmDelete(false);
      }
    },
    3000,
    { leading: true },
  ), [selectedResource.reviewId, selectedResource.movieId, setError, setLoading]);

  const handleCloseConfirmDeleted = () => {
    setModalConfirmDelete(false);
    setSelectedResource({});
  };

  const handleDelete = ({ movieId, reviewId }) => {
    setModalConfirmDelete(true);
    setSelectedResource({ reviewId, movieId });
  };

  useEffect(() => {
    let mounted = true;
    if (helperFunctions.isObjectEmpty(user)) {
      return () => {
        mounted = false;
      };
    }
    async function fetchData() {
      try {
        if (mounted) {
          setLoading(true);
        }
        const dataFetched = await getReviewsUser({ page: INITIALPAGE, id });

        if (mounted) {
          if (user?.id === dataFetched.user_details.id) {
            dataFetched.results = dataFetched.results.map((item) => ({
              ...item, handleDelete,
            }));
          }
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
  }, [id, user]);

  useEffect(() => {
    let mounted = true;
    if (helperFunctions.isObjectEmpty(user)) {
      return () => {
        mounted = false;
      };
    }
    async function fetchData() {
      try {
        if (!modalDeleted) return;

        if (mounted) {
          setLoading(true);
        }
        const dataFetched = await getReviewsUser({ page: INITIALPAGE, id });

        if (mounted) {
          if (user?.id === dataFetched.user_details.id) {
            dataFetched.results = dataFetched.results.map((item) => ({
              ...item, handleDelete,
            }));
          }
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
        if (page === INITIALPAGE || helperFunctions.isObjectEmpty(user)) {
          return;
        }

        if (mounted) {
          setLoadingNextPage(true);
        }

        const dataFetched = await getReviewsUser({ page, id });
        if (user?.id === dataFetched.user_details.id) {
          dataFetched.results = dataFetched.results.map((item) => ({
            ...item, handleDelete,
          }));
        }
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
  }, [page, id, user]);

  return {
    data,
    loading,
    loadingNextPage,
    setPage,
    error,
    modalConfirmDelete,
    modalDeleted,
    handleCloseDeleted,
    debounceHandleConfirmDelete,
    handleCloseConfirmDeleted,
  };
}
