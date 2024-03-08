export function useCachedDataLoader(uri, transform = null) {
  const cid = uri;
  function resolveCacheMiss() {
    const [data, isLoading, error] = useDataLoader(uri);

    if (error || isLoading || !data) {
      return [data, isLoading, error];
    }

    if (transform) {
      return useTransform(data, transform);
    }

    return [data, isLoading, error];
  }

  return usePageCache('cache.page', cid, resolveCacheMiss);
}
