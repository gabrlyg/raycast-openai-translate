import { useEffect, useState } from 'react';

export const usePreferencesForm = <T>(defaultValue: T, validate: (value: T) => boolean) => {
  const [state, setState] = useState<T>(defaultValue);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const isValid = validate(state);
    if (isValid) {
      setIsError(false);
    } else {
      setIsError(true);
    }
  }, [state]);

  return [state, setState, isError];
};
