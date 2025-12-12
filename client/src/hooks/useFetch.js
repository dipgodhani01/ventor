import { useCallback, useEffect, useState } from "react";
import api from "../utils/api";
import axios from "axios";

export const useFetch = (
  url,
  options = {},
  axiosUse = false,
  immediate = true
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = axiosUse
        ? await axios.get(url, options)
        : await api.get(url, options);

      setData(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, axiosUse, JSON.stringify(options)]);

  useEffect(() => {
    if (immediate) fetchData();
  }, [fetchData, immediate]);

  return { data, loading, error, refetch: fetchData };
};
