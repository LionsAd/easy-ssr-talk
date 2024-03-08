export function useDataLoader(uri) {
  let value;
  const [state, setState] = useState({
    value,
    isLoading: true,
    error: false,
  });

  const fetchData = useCallback(async () => {
    setState({
      value: null,
      isLoading: true,
      error: false,
    });
    try {
      const response = await fetch(uri);
      const json = await response.json();
      setState({
        value: json,
        isLoading: false,
        error: false,
      });
    } catch (e) {
      setState({
        value: null,
        isLoading: false,
        error: e,
      });
    }
  }, [uri]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [state.value, state.isLoading, state.error];
};
