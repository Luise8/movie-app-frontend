import { useEffect, useState } from 'react';
import {
  getWatchlistUserLight,
} from 'src/services/get-data';
import uniqid from 'uniqid';

export default function useWatchlistLight(id) {
  const [initialData, setInitialData] = useState({});
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialError, setInitialError] = useState(undefined);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        if (mounted) {
          setLoading(true);
        }
        const dataFetched = await getWatchlistUserLight(id);
        if (mounted) {
          /* eslint no-param-reassign: ["error", { "props": false }] */
          dataFetched.results.map((item) => {
            item.key = uniqid();
            return item;
          });
          const newList = dataFetched.results.slice();
          setList(newList);
          setInitialData(dataFetched);
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
  }, [id]);

  return {
    initialData, loading, initialError, list, setList, setInitialData,
  };
}
