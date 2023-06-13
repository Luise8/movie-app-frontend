import React, {
  createContext, useContext, useEffect, useState, useMemo, useCallback,
} from 'react';
import { authStatus, logIn, logOut } from 'src/services/auth';
import { getUser } from 'src/services/get-data';

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({});

  function setItem(key, valueItem) {
    localStorage.setItem(key, valueItem);
  }

  function getItem(key) {
    const valueItem = localStorage.getItem(key);
    return valueItem;
  }

  function removeItem(key) {
    localStorage.removeItem(key);
  }

  const fetcAndSethUserData = useCallback(async (id) => {
    const userData = await getUser(id);
    setUser(userData);
    setItem('user', JSON.stringify(userData));
  }, []);

  const logInContext = useCallback(async ({ username, password }) => {
    const session = await logIn({ username, password });
    if (session?.currentSession.isAuth) {
      await fetcAndSethUserData(session.currentSession.userId);
    } else {
      setUser(null);
      setItem('user', '');
    }
  }, [fetcAndSethUserData]);

  const logOutContext = useCallback(async () => {
    const session = await logOut();
    if (!session?.currentSession.isAuth) {
      setItem('user', '');
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    async function onAuthStateChanged() {
      try {
        const localUser = getItem('user');
        if (localUser) {
          if (mounted) {
            setUser(localUser);
            return;
          }
        }
        const session = await authStatus();
        if (mounted) {
          if (session?.currentSession.isAuth) {
            await fetcAndSethUserData(session.currentSession.userId);
          } else {
            setUser(null);
            setItem('user', '');
          }
        }
      } catch (error) {
        if (mounted) {
          setUser(null);
          setItem('user', '');
        }
      }
    }

    onAuthStateChanged();

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      user, fetcAndSethUserData, logInContext, logOutContext,
    }),
    [user, fetcAndSethUserData, logInContext, logOutContext],
  );

  return (
    <userAuthContext.Provider
      value={value}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
