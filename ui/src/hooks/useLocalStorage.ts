import React from "react";

export default function useLocalStorage<TData>(
  storageName: string,
  initialValue: TData,
  useJson = true
) {
  const key = `storage-${storageName}`;
  const [value, setValue] = React.useState<TData>(() => {
    const get: (s: string) => TData = useJson ? (s: string) => JSON.parse(s) : (s: string) => s;
    const storageVal = window.localStorage.getItem(key);
    if (storageVal) {
      return get(storageVal);
    }
    return initialValue;
  });

  React.useEffect(() => {
    const put: (s: TData) => string = useJson ? (s: TData) => JSON.stringify(s) : (s: TData) => String(s);
    window.localStorage.setItem(key, put(value));
  }, [value, useJson, key]);

  return [value, setValue] as const;
}
