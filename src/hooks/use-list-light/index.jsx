import { useEffect, useState } from 'react';
import {
  getOneListUserLight,
} from 'src/services/get-data';
import uniqid from 'uniqid';

export default function useOneListLight({ userId, listId }) {
  const [initialData, setInitialData] = useState({});
  const [list, setList] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [initialError, setInitialError] = useState(undefined);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        if (mounted) {
          setLoading(true);
        }
        const dataFetched = await getOneListUserLight({ userId, listId });
        if (mounted) {
          /* eslint no-param-reassign: ["error", { "props": false }] */
          dataFetched.results.map((item) => {
            item.key = uniqid();
            return item;
          });
          const newList = dataFetched.results.slice();
          setList(newList);
          setName(dataFetched.name);
          setDescription(dataFetched.description);
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
  }, [userId, listId]);

  return {
    initialData,
    loading,
    initialError,
    list,
    setList,
    setInitialData,
    name,
    description,
    setName,
    setDescription,
  };
}
