import React, {
  createContext, useContext, useEffect, useState, useMemo, useCallback,
} from 'react';
import { authStatus, logIn, logOut } from 'src/services/auth';
import { getUser } from 'src/services/get-data';
import PropTypes from 'prop-types';

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({});

  function setItem(key, valueItem) {
    localStorage.setItem(key, valueItem);
  }

  function getItem(key) {
    const valueItem = JSON.parse(localStorage.getItem(key));
    return valueItem;
  }

  const removeItem = useCallback((key) => {
    localStorage.removeItem(key);
  }, []);

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
      setUser(null);
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
  }, [fetcAndSethUserData]);

  const value = useMemo(
    () => ({
      user, fetcAndSethUserData, logInContext, logOutContext, removeItem,
    }),
    [user, fetcAndSethUserData, logInContext, logOutContext, removeItem],
  );

  return (
    <userAuthContext.Provider
      value={value}
    >
      {children}
    </userAuthContext.Provider>
  );
}

UserAuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useUserAuth() {
  return useContext(userAuthContext);
}
