import { useState, useEffect, useRef } from "react";

const useAxios = (config) => {
  const { axiosInstance, method, url, requestConfig } = config;

  const [response, setResponse] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);

  const should = useRef(true);

  const refetch = () => {
    setReload((prev) => prev + 1);
  };

  useEffect(() => {
    const controller = new AbortController();
    if (should.current) {
      should.current = false;

      const fetchData = async () => {
        try {
          const res = await axiosInstance[method.toLowerCase()](url, {
            ...requestConfig,
            signal: controller.signal,
          });
          console.log(res);
          setResponse(res.data);
        } catch (err) {
          console.log(err);
          console.log(err.message);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      return () => {
        controller.abort();
      };
    }
  }, [reload]);

  return [response, error, loading, refetch];
};

export default useAxios;
