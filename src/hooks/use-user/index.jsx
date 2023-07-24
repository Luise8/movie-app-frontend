import { useEffect, useState } from 'react';
import {
  getUser,
} from 'src/services/get-data';

export default function useUser(id) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        if (mounted) {
          setLoading(true);
        }
        const dataFetched = await getUser(id);
        if (mounted) {
          let listsWithUser = dataFetched.lists.slice();
          listsWithUser = listsWithUser.map((item) => ({ ...item, userId: dataFetched.id }));
          setData({ ...dataFetched, lists: listsWithUser });
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

  return {
    data, loading, error,
  };
}
