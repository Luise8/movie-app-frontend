import { useEffect, useState } from 'react';
import {
  getUser,
} from 'src/services/get-data';

export default function useUserEditForm(userId) {
  const [data, setData] = useState({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState('');
  const [inputPhoto, setInputPhoto] = useState(undefined);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [initialError, setInitialError] = useState(undefined);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        if (mounted) {
          setLoading(true);
        }

        const dataFetched = await getUser(userId);
        if (mounted) {
          if (dataFetched.review !== null) {
            setUsername(dataFetched.username);
            setPhoto(dataFetched.photo);
            setBio(dataFetched.bio);
          }
          setData(dataFetched);
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
  }, [userId]);

  return {
    data,
    loading,
    initialError,
    setData,
    username,
    bio,
    setUsername,
    setBio,
    password,
    setPassword,
    photo,
    setPhoto,
    inputPhoto,
    setInputPhoto,
  };
}
