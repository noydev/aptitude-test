import { useState } from 'react';

const useLocalStorage = (key: string, initialValue: any) => {
  const [state, setState] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.log(err);
      return initialValue;
    }
  });

  // eslint-disable-next-line @typescript-eslint/ban-types
  const setLocalStorageState = (newState: Function | any) => {
    try {
      const newStateValue =
        typeof newState === 'function' ? newState(state) : newState;

      setState(newStateValue);
      window.localStorage.setItem(key, JSON.stringify(newStateValue));
    } catch (err) {
      console.error(`Unable to store new value for ${key} in local storage`);
    }
  };

  return [state, setLocalStorageState];
};

export default useLocalStorage;
